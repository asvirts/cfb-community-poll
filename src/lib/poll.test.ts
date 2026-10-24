import { describe, expect, it } from "vite-plus/test";

import { orderTeams, scoreStandings, startingOrder, validateBallot, type Team } from "./poll";

const teams: Team[] = [
  { id: 1, name: "Alpha", conference: "A" },
  { id: 2, name: "Bravo", conference: "A" },
  { id: 3, name: "Charlie", conference: "B" },
];

describe("scoreStandings", () => {
  it("awards one point per team for first place and 1 for last", () => {
    const standings = scoreStandings(teams, [
      { ballotId: 1, teamId: 2, rank: 1 },
      { ballotId: 1, teamId: 1, rank: 2 },
      { ballotId: 1, teamId: 3, rank: 3 },
    ]);

    expect(standings.map((standing) => [standing.name, standing.points])).toEqual([
      ["Bravo", 3],
      ["Alpha", 2],
      ["Charlie", 1],
    ]);
    expect(standings[0]?.ballot_count).toBe(1);
    expect(standings[0]?.first_place_votes).toBe(1);
  });

  it("breaks equal points by first-place votes, then name", () => {
    const standings = scoreStandings(teams, [
      { ballotId: 1, teamId: 1, rank: 1 },
      { ballotId: 1, teamId: 2, rank: 2 },
      { ballotId: 1, teamId: 3, rank: 3 },
      { ballotId: 2, teamId: 3, rank: 1 },
      { ballotId: 2, teamId: 2, rank: 2 },
      { ballotId: 2, teamId: 1, rank: 3 },
    ]);

    expect(standings.map((standing) => standing.name)).toEqual(["Alpha", "Charlie", "Bravo"]);
    expect(standings.every((standing) => standing.points === 4)).toBe(true);
    expect(standings[2]?.first_place_votes).toBe(0);
    expect(standings[0]?.ballot_count).toBe(2);
  });
});

describe("validateBallot", () => {
  const expected = teams.map((team) => team.id);

  it("accepts a complete unique ranking", () => {
    expect(validateBallot([3, 1, 2], expected, "FBS")).toBeNull();
  });

  it("rejects a short, duplicate, or unknown ballot", () => {
    expect(validateBallot([1, 2], expected, "FCS")).toBe("Ballot must include every FCS team");
    expect(validateBallot([1, 1, 2], expected, "FBS")).toBe("Ballot contains duplicate teams");
    expect(validateBallot([1, 2, 9], expected, "FBS")).toBe("Ballot contains an unknown team");
  });
});

describe("startingOrder", () => {
  it("puts the seed first and the rest in alphabetical order", () => {
    const ordered = startingOrder(teams, ["Charlie"]);
    expect(ordered.map((team) => team.name)).toEqual(["Charlie", "Alpha", "Bravo"]);
  });
});

describe("orderTeams", () => {
  it("keeps a saved ranking and appends missing teams alphabetically", () => {
    const ordered = orderTeams(teams, [
      { team_id: 3, rank: 1 },
      { team_id: 99, rank: 2 },
    ]);
    expect(ordered.map((team) => team.name)).toEqual(["Charlie", "Alpha", "Bravo"]);
  });
});
