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
