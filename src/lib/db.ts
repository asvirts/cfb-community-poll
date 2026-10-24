import postgres from "postgres";
import type { Division } from "@/lib/division";
import { isDivision } from "@/lib/division";
import { FBS_TEAMS } from "@/lib/fbs-teams";
import { FCS_TEAMS } from "@/lib/fcs-teams";
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
  `alter table teams add column if not exists division text not null default 'FBS'`,
  `alter table teams drop constraint if exists teams_division_check`,
  `alter table teams add constraint teams_division_check check (division in ('FBS', 'FCS'))`,
  `alter table ballots add column if not exists division text not null default 'FBS'`,
  `alter table ballots drop constraint if exists ballots_user_id_key`,
  `alter table ballots drop constraint if exists ballots_user_id_division_key`,
  `alter table ballots add constraint ballots_user_id_division_key unique (user_id, division)`,
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

  const fbs = FBS_TEAMS.map((team) => ({ ...team, division: "FBS" }));
  const fcs = FCS_TEAMS.map(({ name, conference }) => ({
    name,
    conference,
    division: "FCS",
  }));

  await sql`
    insert into teams ${sql(fbs, "name", "conference", "division")}
    on conflict (name) do nothing
  `;
  await sql`
    insert into teams ${sql(fcs, "name", "conference", "division")}
    on conflict (name) do nothing
  `;
}

export async function pollStandings(division: Division = "FBS"): Promise<Standing[]> {
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
      select count(*)::integer as team_count
      from teams
      where division = ${division}
    ),
    picks as (
      select bp.team_id, bp.rank
      from ballot_picks bp
      join ballots b on b.id = bp.ballot_id
      where b.division = ${division}
    ),
    scored as (
      select
        t.id as team_id,
        t.name,
        t.conference,
        coalesce(sum(sized.team_count - picks.rank + 1), 0)::bigint as points,
        count(picks.rank) filter (where picks.rank = 1)::bigint as first_place_votes
      from teams t
      cross join sized
      left join picks on picks.team_id = t.id
      where t.division = ${division}
      group by t.id, t.name, t.conference, sized.team_count
    )
    select
      scored.team_id,
      scored.name,
      scored.conference,
      scored.points,
      scored.first_place_votes,
      (select count(*) from ballots where division = ${division})::bigint as ballot_count
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

export async function listTeams(division: Division = "FBS"): Promise<Team[]> {
  await ensureReady();
  const rows = await getSql()<{ id: number | string; name: string; conference: string }[]>`
    select id, name, conference from teams
    where division = ${division}
  `;
  return rows.map((row) => ({
    id: Number(row.id),
    name: row.name,
    conference: row.conference,
  }));
}

export async function listBallotPicks(
  userId: string,
  division: Division = "FBS",
): Promise<Pick[]> {
  await ensureReady();
  const rows = await getSql()<{ team_id: number | string; rank: number | string }[]>`
    select bp.team_id, bp.rank
    from ballots b
    join ballot_picks bp on bp.ballot_id = b.id
    where b.user_id = ${userId}
      and b.division = ${division}
    order by bp.rank
  `;
  return rows.map((row) => ({
    team_id: Number(row.team_id),
    rank: Number(row.rank),
  }));
}

export async function saveBallotForUser(
  userId: string,
  teamIds: number[],
  division: Division,
) {
  await ensureReady();
  if (!isDivision(division)) {
    throw new BallotError("Unknown division");
  }
  const sql = getSql();

  await sql.begin(async (tx) => {
    const teams = await tx<{ id: number | string }[]>`
      select id from teams where division = ${division}
    `;
    const expected = new Set(teams.map((team) => Number(team.id)));

    if (teamIds.length !== expected.size) {
      throw new BallotError(`Ballot must include every ${division} team`);
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
      insert into ballots (user_id, division)
      values (${userId}, ${division})
      on conflict (user_id, division) do update
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
