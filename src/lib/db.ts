import { ballots, ballotPicks, teams } from "@schema";
import { DIVISION_PROFILES, type Division } from "@/lib/division";
import {
  orderTeams,
  scoreStandings,
  startingOrder,
  validateBallot,
  type Pick,
  type Standing,
  type Team,
} from "@/lib/poll";
import { teamSeedRows } from "@/lib/team-seed";
import { and, db, eq } from "void/db";

export class BallotError extends Error {}

const CHUNK = 30;

let ready: Promise<void> | undefined;

export function ensureReady() {
  ready ??= seedMissingTeams().catch((error: unknown) => {
    ready = undefined;
    throw error;
  });
  return ready;
}

async function seedMissingTeams() {
  const rows = teamSeedRows();
  for (let index = 0; index < rows.length; index += CHUNK) {
    await db
      .insert(teams)
      .values(rows.slice(index, index + CHUNK))
      .onConflictDoNothing();
  }
}

export async function pollStandings(division: Division): Promise<Standing[]> {
  await ensureReady();
  const teamRows = await db.select().from(teams).where(eq(teams.division, division));
  const picks = await db
    .select({
      ballotId: ballotPicks.ballotId,
      teamId: ballotPicks.teamId,
      rank: ballotPicks.rank,
    })
    .from(ballotPicks)
    .innerJoin(ballots, eq(ballots.id, ballotPicks.ballotId))
    .where(eq(ballots.division, division));

  return scoreStandings(
    teamRows.map((team) => ({
      id: team.id,
      name: team.name,
      conference: team.conference,
    })),
    picks,
  );
}

export async function listTeams(division: Division): Promise<Team[]> {
  await ensureReady();
  const rows = await db
    .select({ id: teams.id, name: teams.name, conference: teams.conference })
    .from(teams)
    .where(eq(teams.division, division));
  return rows;
}

export async function listBallotPicks(userId: string, division: Division): Promise<Pick[]> {
  await ensureReady();
  const rows = await db
    .select({ team_id: ballotPicks.teamId, rank: ballotPicks.rank })
    .from(ballotPicks)
    .innerJoin(ballots, eq(ballots.id, ballotPicks.ballotId))
    .where(and(eq(ballots.userId, userId), eq(ballots.division, division)))
    .orderBy(ballotPicks.rank);
  return rows;
}

export async function loadOrderedBallot(userId: string, division: Division) {
  const profile = DIVISION_PROFILES[division];
  const listed = await listTeams(division);
  const picks = await listBallotPicks(userId, division);
  const hasExistingBallot = picks.length > 0;
  return {
    teams: hasExistingBallot ? orderTeams(listed, picks) : startingOrder(listed, profile.seed),
    hasExistingBallot,
  };
}

export async function saveBallotForUser(userId: string, teamIds: number[], division: Division) {
  await ensureReady();
  const listed = await listTeams(division);
  const problem = validateBallot(
    teamIds,
    listed.map((team) => team.id),
    division,
  );
  if (problem) throw new BallotError(problem);

  const [ballot] = await db
    .insert(ballots)
    .values({ userId, division })
    .onConflictDoUpdate({
      target: [ballots.userId, ballots.division],
      set: { updatedAt: new Date().toISOString() },
    })
    .returning({ id: ballots.id });

  if (!ballot) throw new BallotError("Could not save the ballot.");

  const rows = teamIds.map((teamId, index) => ({
    ballotId: ballot.id,
    teamId,
    rank: index + 1,
  }));
  const inserts = [];
  for (let index = 0; index < rows.length; index += CHUNK) {
    inserts.push(db.insert(ballotPicks).values(rows.slice(index, index + CHUNK)));
  }
  // D1 rejects SQL BEGIN. A batch is the atomic replacement for the old picks.
  await db.batch([db.delete(ballotPicks).where(eq(ballotPicks.ballotId, ballot.id)), ...inserts]);
}
