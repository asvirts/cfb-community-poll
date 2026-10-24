import { AP_TOP_25, FCS_TOP_25 } from "@/lib/poll";

export type Division = "FBS" | "FCS";

export type DivisionProfile = {
  id: Division;
  name: string;
  title: string;
  ballotTitle: string;
  seasonLabel: string;
  programsLabel: string;
  scoringLabel: string;
  standingsHref: string;
  ballotHref: string;
  seed: readonly string[];
  pollShort: string;
  pollTitle: string;
  seedButton: string;
  savedSeed: string;
  emptyBanner: string;
  leaderSeed: string;
  podiumFallback: string;
  byeRank: number;
  playoffRank: number;
  byeCutline: string;
  playoffCutline: string;
  rankedCutline: string;
  cutlineCard: string;
  podiumTitle: string;
  legendBye: string;
  legendField: string;
  legendRanked: string;
  playoffStat: string;
  tierBye: string;
  tierField: string;
  comparisonHeader: string;
  hero: string;
  ballotHero: string;
  loading: string;
  ballotLoading: string;
  ballotBadge: string;
};

export const DIVISION_PROFILES: Record<Division, DivisionProfile> = {
  FBS: {
    id: "FBS",
    name: "FBS",
    title: "The Poll",
    ballotTitle: "My ballot",
    seasonLabel: "2026 FBS Season",
    programsLabel: "138 Programs",
    scoringLabel: "Borda Count (138–1 Pts)",
    standingsHref: "/",
    ballotHref: "/ballot",
    seed: AP_TOP_25,
    pollShort: "AP",
    pollTitle: "Oct. 18 AP Poll",
    seedButton: "AP Seed",
    savedSeed: "Seeded from Oct. 18 AP Top 25",
    emptyBanner:
      "No ballots yet. This list starts from the Oct. 18 AP Top 25, then the rest of FBS in alphabetical order. Rank every team to open the poll.",
    leaderSeed: "Oct. 18 AP Poll #1 Seed",
    podiumFallback: "Pre-poll AP Top 4 seeds",
    byeRank: 4,
    playoffRank: 12,
    byeCutline: "▲ Top 4 First-Round Bye Cutline ▲",
    playoffCutline: "▲ 12-Team College Football Playoff Cutline ▲",
    rankedCutline: "▲ Top 25 National Poll Cutline — Others Receiving Votes Below ▲",
    cutlineCard: "CFP #12 Cutline",
    podiumTitle: "Top 4 — Projected First-Round Bye Seeds",
    legendBye: "#1–4 CFP Bye",
    legendField: "#5–12 CFP Field",
    legendRanked: "#13–25 Ranked",
    playoffStat: "CFP Top 12",
    tierBye: "CFP Bye",
    tierField: "CFP Top 12",
    comparisonHeader: "vs. AP",
    hero: "Every signed-in fan ranks all FBS teams. First place is worth one point per team. Last place is worth 1. The table is the sum of those ballots.",
    ballotHero:
      "Put every FBS team in order. A new ballot starts from the latest AP Top 25, then the rest of FBS in alphabetical order. Your ballot replaces the previous one, and the public poll updates from the latest ranking.",
    loading: "Tabulating all 138 FBS team standings from community ballots.",
    ballotLoading: "Preparing all 138 FBS programs for your ranking.",
    ballotBadge: "138 Teams • Borda Count",
  },
  FCS: {
    id: "FCS",
    name: "FCS",
    title: "The FCS Poll",
    ballotTitle: "My FCS ballot",
    seasonLabel: "2026 FCS Season",
    programsLabel: "128 Programs",
    scoringLabel: "Borda Count (128–1 Pts)",
    standingsHref: "/fcs",
    ballotHref: "/ballot/fcs",
    seed: FCS_TOP_25,
    pollShort: "SP",
    pollTitle: "Oct. 19 Stats Perform Poll",
    seedButton: "Poll Seed",
    savedSeed: "Seeded from the Oct. 19 Stats Perform FCS Top 25",
    emptyBanner:
      "No FCS ballots yet. This list starts from the Oct. 19 Stats Perform Top 25, then the rest of FCS in alphabetical order. Rank every FCS team to open this board.",
    leaderSeed: "Oct. 19 Stats Perform #1 Seed",
    podiumFallback: "Pre-poll Stats Perform Top 4 seeds",
    byeRank: 8,
    playoffRank: 24,
    byeCutline: "▲ Top 8 First-Round Bye Cutline ▲",
    playoffCutline: "▲ 24-Team FCS Playoff Cutline ▲",
    rankedCutline: "▲ Top 25 National Poll Cutline — Others Receiving Votes Below ▲",
    cutlineCard: "Playoff #24 Cutline",
    podiumTitle: "Top 4 — Highest Championship Seeds",
    legendBye: "#1–8 Playoff Bye",
    legendField: "#9–24 Playoff Field",
    legendRanked: "#25 Ranked",
    playoffStat: "Playoff 24",
    tierBye: "Bye",
    tierField: "Playoff",
    comparisonHeader: "vs. SP",
    hero: "Every signed-in fan ranks all FCS teams on this board. First place is worth one point per FCS team. Last place is worth 1. FBS ballots stay on their own poll.",
    ballotHero:
      "Put every FCS team in order. A new ballot starts from the Oct. 19 Stats Perform Top 25, then the rest of FCS in alphabetical order. This ballot is separate from your FBS ranking.",
    loading: "Tabulating all 128 FCS team standings from community ballots.",
    ballotLoading: "Preparing all 128 FCS programs for your ranking.",
    ballotBadge: "128 Teams • Borda Count",
  },
};

export function isDivision(value: string): value is Division {
  return value === "FBS" || value === "FCS";
}
