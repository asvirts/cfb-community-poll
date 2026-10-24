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

export function alphabeticalTeams(teams: Team[]) {
  return [...teams].sort((a, b) => a.name.localeCompare(b.name));
}
