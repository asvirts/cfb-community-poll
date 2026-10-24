import { FBS_TEAMS } from "@/lib/fbs-teams";
import { FCS_TEAMS } from "@/lib/fcs-teams";

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
