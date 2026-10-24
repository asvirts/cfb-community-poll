import postgres from "postgres";
import { FBS_TEAMS } from "@/lib/fbs-teams";
import type { Pick, Standing, Team } from "@/lib/poll";

export class BallotError extends Error {}

const SCHEMA = [
  `drop table if exists sessions`,
  `alter table if exists ballots drop constraint if exists ballots_user_id_fkey`,
  `drop table if exists users`,
  `create table if not exists teams (
    id bigint generated always as identity primary key,
    name text not null unique,
    conference text not null
  )`,
  `create table if not exists ballots (
    id uuid primary key default gen_random_uuid(),
    user_id text not null unique,
    updated_at timestamptz not null default now()
  )`,
  `alter table ballots alter column user_id type text using user_id::text`,
  `create table if not exists ballot_picks (
    ballot_id uuid not null references ballots (id) on delete cascade,
    team_id bigint not null references teams (id) on delete cascade,
    rank integer not null check (rank >= 1),
    primary key (ballot_id, rank),
    unique (ballot_id, team_id)
  )`,
  `create index if not exists ballot_picks_team_id_idx on ballot_picks (team_id)`,
];

const globalForDb = globalThis as unknown as {
  pollSql?: ReturnType<typeof postgres>;
  pollReady?: Promise<void>;
};

function connectionString() {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!url) {
    throw new Error("Missing DATABASE_URL. Point it at the Neon connection string.");
  }
  return url;
}

export function getSql() {
  if (!globalForDb.pollSql) {
    const url = connectionString();
    const local = url.includes("localhost") || url.includes("127.0.0.1");
    globalForDb.pollSql = postgres(url, {
      ssl: local ? false : "require",
      max: 1,
      prepare: false,
      idle_timeout: 20,
      connect_timeout: 15,
      onnotice: () => {},
    });
  }
  return globalForDb.pollSql;
}

export function ensureReady() {
  if (!globalForDb.pollReady) {
    globalForDb.pollReady = migrate().catch((error: unknown) => {
      globalForDb.pollReady = undefined;
      throw error;
    });
  }
  return globalForDb.pollReady;
}

async function migrate() {
  const sql = getSql();
  for (const statement of SCHEMA) {
    await sql.unsafe(statement);
  }

  // The only ballot saved before the AP starting order was a test: Alabama first, then alphabetical.
  await sql`
    delete from ballots b
    where (select count(*) from ballots) = 1
      and (
        select t.name
        from ballot_picks bp
        join teams t on t.id = bp.team_id
        where bp.ballot_id = b.id and bp.rank = 1
      ) = 'Alabama'
      and (
        select t.name
        from ballot_picks bp
        join teams t on t.id = bp.team_id
        where bp.ballot_id = b.id and bp.rank = 2
      ) = 'Air Force'
  `;

  const [{ count }] = await sql<{ count: number }[]>`
    select count(*)::int as count from teams
  `;
  if (Number(count) > 0) return;

  await sql`
    insert into teams ${sql(FBS_TEAMS, "name", "conference")}
    on conflict (name) do nothing
  `;
}

export async function pollStandings(): Promise<Standing[]> {
  await ensureReady();
  const rows = await getSql()<
    {
      team_id: number | string;
      name: string;
      conference: string;
      points: number | string;
      first_place_votes: number | string;
      ballot_count: number | string;
    }[]
  >`
    with sized as (
      select count(*)::integer as team_count from teams
    ),
    scored as (
      select
        t.id as team_id,
        t.name,
        t.conference,
        coalesce(sum(sized.team_count - bp.rank + 1), 0)::bigint as points,
        count(bp.rank) filter (where bp.rank = 1)::bigint as first_place_votes
      from teams t
      cross join sized
      left join ballot_picks bp on bp.team_id = t.id
      group by t.id, t.name, t.conference, sized.team_count
    )
    select
      scored.team_id,
      scored.name,
      scored.conference,
      scored.points,
      scored.first_place_votes,
      (select count(*) from ballots)::bigint as ballot_count
    from scored
    order by scored.points desc, scored.first_place_votes desc, scored.name asc
  `;

  return rows.map((row) => ({
    team_id: Number(row.team_id),
    name: row.name,
    conference: row.conference,
    points: Number(row.points),
    first_place_votes: Number(row.first_place_votes),
    ballot_count: Number(row.ballot_count),
  }));
}

export async function listTeams(): Promise<Team[]> {
  await ensureReady();
  const rows = await getSql()<{ id: number | string; name: string; conference: string }[]>`
    select id, name, conference from teams
  `;
  return rows.map((row) => ({
    id: Number(row.id),
    name: row.name,
    conference: row.conference,
  }));
}

export async function listBallotPicks(userId: string): Promise<Pick[]> {
  await ensureReady();
  const rows = await getSql()<{ team_id: number | string; rank: number | string }[]>`
    select bp.team_id, bp.rank
    from ballots b
    join ballot_picks bp on bp.ballot_id = b.id
    where b.user_id = ${userId}
    order by bp.rank
  `;
  return rows.map((row) => ({
    team_id: Number(row.team_id),
    rank: Number(row.rank),
  }));
}

export async function saveBallotForUser(userId: string, teamIds: number[]) {
  await ensureReady();
  const sql = getSql();

  await sql.begin(async (tx) => {
    const teams = await tx<{ id: number | string }[]>`select id from teams`;
    const expected = new Set(teams.map((team) => Number(team.id)));

    if (teamIds.length !== expected.size) {
      throw new BallotError("Ballot must include every team");
    }

    const unique = new Set(teamIds);
    if (unique.size !== teamIds.length) {
      throw new BallotError("Ballot contains duplicate teams");
    }

    for (const teamId of teamIds) {
      if (!Number.isInteger(teamId) || !expected.has(teamId)) {
        throw new BallotError("Ballot contains an unknown team");
      }
    }

    const [ballot] = await tx<{ id: string }[]>`
      insert into ballots (user_id)
      values (${userId})
      on conflict (user_id) do update
        set updated_at = now()
      returning id
    `;

    await tx`delete from ballot_picks where ballot_id = ${ballot.id}`;

    await tx`
      insert into ballot_picks ${tx(
        teamIds.map((teamId, index) => ({
          ballot_id: ballot.id,
          team_id: teamId,
          rank: index + 1,
        })),
        "ballot_id",
        "team_id",
        "rank",
      )}
    `;
  });
}
