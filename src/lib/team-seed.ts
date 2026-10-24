import { FCS_TEAMS } from "@/lib/fcs-teams";
import { FBS_TEAMS } from "@/lib/fbs-teams";

export function teamSeedRows() {
  return [
    ...FBS_TEAMS.map((team) => ({
      name: team.name,
      conference: team.conference,
      division: "FBS" as const,
    })),
    ...FCS_TEAMS.map((team) => ({
      name: team.name,
      conference: team.conference,
      division: "FCS" as const,
    })),
  ];
}
