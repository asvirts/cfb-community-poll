export type Team = {
  id: number;
  name: string;
  conference: string;
};

export type Pick = {
  team_id: number;
  rank: number;
};

export type Standing = {
  team_id: number;
  name: string;
  conference: string;
  points: number;
  first_place_votes: number;
  ballot_count: number;
};

export function orderTeams(teams: Team[], picks: Pick[]): Team[] {
  const byId = new Map(teams.map((team) => [team.id, team]));
  const ranked = [...picks].sort((a, b) => a.rank - b.rank);
  const seen = new Set<number>();
  const ordered: Team[] = [];

  for (const pick of ranked) {
    const team = byId.get(pick.team_id);
    if (!team || seen.has(team.id)) continue;
    seen.add(team.id);
    ordered.push(team);
  }

  const rest = teams
    .filter((team) => !seen.has(team.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  return [...ordered, ...rest];
}

/** AP Top 25 through games of Oct. 17, 2026, released Oct. 18. */
export const AP_TOP_25 = [
  "Miami (FL)",
  "BYU",
  "Ohio State",
  "Notre Dame",
  "Georgia",
  "Indiana",
  "Ole Miss",
  "Texas Tech",
  "UCLA",
  "Utah",
  "Tennessee",
  "Kentucky",
  "Alabama",
  "Houston",
  "Iowa",
  "USC",
  "Wake Forest",
  "LSU",
  "Texas",
  "Florida",
  "Boise State",
  "Missouri",
  "SMU",
  "Northwestern",
  "Arizona",
] as const;

/** Stats Perform FCS Top 25 released Oct. 19, 2026, after Week 7. */
export const FCS_TOP_25 = [
  "Tarleton State",
  "Stephen F. Austin",
  "Montana State",
  "Youngstown State",
  "South Dakota State",
  "North Dakota",
  "Northern Arizona",
  "South Dakota",
  "Austin Peay",
  "Illinois State",
  "Lehigh",
  "Tennessee Tech",
  "Campbell",
  "Montana",
  "Harvard",
  "Lamar",
  "Mercer",
  "East Tennessee State",
  "Monmouth",
  "UC Davis",
  "Northern Iowa",
  "Weber State",
  "Southeastern Louisiana",
  "Jackson State",
  "Richmond",
] as const;

export type ScoredPick = {
  ballotId: number;
  teamId: number;
  rank: number;
};

/** First place is worth one point per team. Last place is worth 1. */
export function scoreStandings(teams: Team[], picks: ScoredPick[]): Standing[] {
  const teamCount = teams.length;
  const points = new Map<number, number>();
  const firstPlaceVotes = new Map<number, number>();
  const ballots = new Set<number>();

  for (const pick of picks) {
    ballots.add(pick.ballotId);
    points.set(pick.teamId, (points.get(pick.teamId) ?? 0) + (teamCount - pick.rank + 1));
    if (pick.rank === 1) {
      firstPlaceVotes.set(pick.teamId, (firstPlaceVotes.get(pick.teamId) ?? 0) + 1);
    }
  }

  const ballotCount = ballots.size;
  return teams
    .map((team) => ({
      team_id: team.id,
      name: team.name,
      conference: team.conference,
      points: points.get(team.id) ?? 0,
      first_place_votes: firstPlaceVotes.get(team.id) ?? 0,
      ballot_count: ballotCount,
    }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.first_place_votes !== a.first_place_votes) {
        return b.first_place_votes - a.first_place_votes;
      }
      return a.name.localeCompare(b.name);
    });
}

export function validateBallot(
  teamIds: number[],
  expectedIds: Iterable<number>,
  division: string,
): string | null {
  const expected = new Set(expectedIds);
  if (teamIds.length !== expected.size) {
    return `Ballot must include every ${division} team`;
  }

  const unique = new Set(teamIds);
  if (unique.size !== teamIds.length) {
    return "Ballot contains duplicate teams";
  }

  for (const teamId of teamIds) {
    if (!Number.isInteger(teamId) || !expected.has(teamId)) {
      return "Ballot contains an unknown team";
    }
  }

  return null;
}

export function startingOrder<T extends { name: string }>(
  teams: T[],
  seed: readonly string[] = AP_TOP_25,
): T[] {
  const rank = new Map<string, number>(seed.map((name, index) => [name, index]));
  return [...teams].sort((a, b) => {
    const aRank = rank.get(a.name);
    const bRank = rank.get(b.name);
    if (aRank !== undefined && bRank !== undefined) return aRank - bRank;
    if (aRank !== undefined) return -1;
    if (bRank !== undefined) return 1;
    return a.name.localeCompare(b.name);
  });
}
