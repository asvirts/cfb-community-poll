"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ApComparisonBadge,
  ConferenceBadge,
  getApRank,
  RankTierPill,
  TeamCrest,
} from "@/components/team-visuals";
import { startingOrder, type Standing } from "@/lib/poll";
import { getConferenceMeta, getTeamStyle } from "@/lib/team-meta";

type ViewTab = "all" | "top25" | "conferences";

export function PollBoard({ standings }: { standings: Standing[] }) {
  const ballotCount = standings[0]?.ballot_count ?? 0;
  const hasBallots = ballotCount > 0;

  const ordered = useMemo(() => {
    return hasBallots ? standings : startingOrder(standings);
  }, [standings, hasBallots]);

  const [view, setView] = useState<ViewTab>("all");
  const [query, setQuery] = useState("");
  const [selectedConference, setSelectedConference] = useState<string>("");

  const teamCount = ordered.length;
  const maxPointsPerTeam = ballotCount * teamCount;

  // Map each team_id to its true overall rank (1..136)
  const rankMap = useMemo(() => {
    const map = new Map<number, number>();
    ordered.forEach((team, idx) => {
      map.set(team.team_id, idx + 1);
    });
    return map;
  }, [ordered]);

  // Conference statistics
  const conferenceStats = useMemo(() => {
    const map = new Map<
      string,
      {
        conference: string;
        teamCount: number;
        top25Count: number;
        top12Count: number;
        totalPoints: number;
        rankSum: number;
        bestTeam: Standing;
        bestRank: number;
      }
    >();

    ordered.forEach((team, idx) => {
      const rank = idx + 1;
      const existing = map.get(team.conference);
      if (!existing) {
        map.set(team.conference, {
          conference: team.conference,
          teamCount: 1,
          top25Count: rank <= 25 ? 1 : 0,
          top12Count: rank <= 12 ? 1 : 0,
          totalPoints: team.points,
          rankSum: rank,
          bestTeam: team,
          bestRank: rank,
        });
      } else {
        existing.teamCount += 1;
        if (rank <= 25) existing.top25Count += 1;
        if (rank <= 12) existing.top12Count += 1;
        existing.totalPoints += team.points;
        existing.rankSum += rank;
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      const avgA = a.rankSum / a.teamCount;
      const avgB = b.rankSum / b.teamCount;
      return avgA - avgB;
    });
  }, [ordered]);

  const conferences = useMemo(
    () => [...new Set(ordered.map((t) => t.conference))].sort(),
    [ordered],
  );

  const needle = query.trim().toLowerCase();
  const filteredTeams = useMemo(() => {
    return ordered.filter((team) => {
      const rank = rankMap.get(team.team_id) ?? 999;
      if (view === "top25" && rank > 25) return false;
      if (selectedConference && team.conference !== selectedConference) {
        return false;
      }
      if (needle) {
        const style = getTeamStyle(team.name);
        const matches =
          team.name.toLowerCase().includes(needle) ||
          team.conference.toLowerCase().includes(needle) ||
          style.mascot.toLowerCase().includes(needle) ||
          style.abbrev.toLowerCase().includes(needle);
        if (!matches) return false;
      }
      return true;
    });
  }, [ordered, rankMap, view, selectedConference, needle]);

  const topFour = ordered.slice(0, 4);
  const leader = ordered[0];
  const cutlineTeam = ordered[11];
  const firstOutTeam = ordered[12];
  const topConf = conferenceStats[0];

  const isUnfilteredList =
    selectedConference === "" && needle === "" && view === "all";

  return (
    <div className="flex flex-col gap-8">
      {/* Status Banner when 0 ballots */}
      {!hasBallots ? (
        <div className="relative overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-r from-gold/15 via-card to-card p-5 shadow-lg">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3.5">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/20 font-display text-lg font-bold text-gold ring-1 ring-gold/40">
                ★
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-display text-sm font-bold tracking-wider text-gold uppercase">
                  Opening Kickoff — Pre-Poll Seedings Active
                </p>
                <p className="text-sm leading-relaxed text-cream/90">
                  No ballots yet. This list starts from the Oct. 18 AP Top 25, then the rest of FBS in alphabetical order. Rank every team to open the poll.
                </p>
              </div>
            </div>
            <Link
              href="/ballot"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gold px-5 py-2.5 font-display text-sm font-bold tracking-wider text-field uppercase shadow-md transition hover:bg-gold-bright"
            >
              Cast First Ballot →
            </Link>
          </div>
        </div>
      ) : null}

      {/* Broadcast Scoreboard KPI Strip */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Poll Volume */}
        <div className="flex flex-col justify-between rounded-2xl border border-line bg-card/90 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-display text-xs font-semibold tracking-widest text-muted uppercase">
              Verified Ballots
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {hasBallots ? "LIVE" : "SEEDED"}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold tracking-tight text-cream">
              {ballotCount.toLocaleString()}
            </span>
            <span className="text-xs text-muted">
              {ballotCount === 1 ? "ballot submitted" : "ballots submitted"}
            </span>
          </div>
          <p className="mt-2 border-t border-line/60 pt-2 font-mono text-[11px] text-muted">
            Max score: {(hasBallots ? maxPointsPerTeam : teamCount).toLocaleString()} pts ({teamCount} pts / #1)
          </p>
        </div>

        {/* Card 2: Current #1 */}
        {leader ? (
          <div className="flex flex-col justify-between rounded-2xl border border-gold/35 bg-gradient-to-br from-gold/12 via-card to-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-display text-xs font-semibold tracking-widest text-gold uppercase">
                {hasBallots ? "#1 Consensus Leader" : "#1 Pre-Poll Seed"}
              </span>
              <span className="font-mono text-xs font-bold text-gold">
                RANK #1
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <TeamCrest name={leader.name} size="md" />
              <div className="min-w-0">
                <p className="truncate font-display text-xl leading-tight font-bold text-cream uppercase">
                  {leader.name}
                </p>
                <p className="truncate text-xs text-muted">
                  {getTeamStyle(leader.name).mascot} • {leader.conference}
                </p>
              </div>
            </div>
            <p className="mt-2 border-t border-line/60 pt-2 font-mono text-[11px] text-gold/90">
              {hasBallots
                ? `${leader.points.toLocaleString()} pts • ${leader.first_place_votes} first-place ${leader.first_place_votes === 1 ? "vote" : "votes"}`
                : "Oct. 18 AP Poll #1 Seed"}
            </p>
          </div>
        ) : null}

        {/* Card 3: 12-Team Playoff Cutline */}
        {cutlineTeam ? (
          <div className="flex flex-col justify-between rounded-2xl border border-line bg-card/90 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-display text-xs font-semibold tracking-widest text-muted uppercase">
                CFP #12 Cutline
              </span>
              <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-300">
                LAST IN
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <TeamCrest name={cutlineTeam.name} size="md" />
              <div className="min-w-0">
                <p className="truncate font-display text-xl leading-tight font-bold text-cream uppercase">
                  #12 {cutlineTeam.name}
                </p>
                <p className="truncate text-xs text-muted">
                  First out: #13 {firstOutTeam?.name ?? "—"}
                </p>
              </div>
            </div>
            <p className="mt-2 border-t border-line/60 pt-2 font-mono text-[11px] text-muted">
              {hasBallots && firstOutTeam
                ? `+${(cutlineTeam.points - firstOutTeam.points).toLocaleString()} pts ahead of #13`
                : `${cutlineTeam.conference} • AP #12 Seed`}
            </p>
          </div>
        ) : null}

        {/* Card 4: Conference Pace-Setter */}
        {topConf ? (
          <div className="flex flex-col justify-between rounded-2xl border border-line bg-card/90 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-display text-xs font-semibold tracking-widest text-muted uppercase">
                Deepest League
              </span>
              <ConferenceBadge conference={topConf.conference} />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-cream">
                {(topConf.rankSum / topConf.teamCount).toFixed(1)}
              </span>
              <span className="text-xs text-muted">avg team rank</span>
            </div>
            <p className="mt-2 border-t border-line/60 pt-2 font-mono text-[11px] text-muted">
              {topConf.top25Count} in Top 25 • Led by #{topConf.bestRank}{" "}
              {topConf.bestTeam.name}
            </p>
          </div>
        ) : null}
      </div>

      {/* Top 4 CFP First-Round Bye Podium */}
      <section aria-label="Top 4 Projected Playoff Seeds" className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="h-4 w-1 rounded-full bg-gold" />
            <h2 className="font-display text-lg font-bold tracking-wider text-cream uppercase">
              Top 4 — Projected First-Round Bye Seeds
            </h2>
          </div>
          <span className="font-mono text-xs text-muted">
            {hasBallots
              ? `Based on ${ballotCount} ${ballotCount === 1 ? "ballot" : "ballots"}.`
              : "Pre-poll AP Top 4 seeds"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {topFour.map((team, idx) => {
            const rank = idx + 1;
            const style = getTeamStyle(team.name);
            const pct =
              hasBallots && maxPointsPerTeam > 0
                ? Math.round((team.points / maxPointsPerTeam) * 100)
                : 100 - idx * 4;

            return (
              <div
                key={team.team_id}
                className="group relative overflow-hidden rounded-2xl border border-line bg-card p-4 transition hover:border-gold/50"
              >
                {/* Top team color bar */}
                <div
                  className=" inset-x-0 top-0 h-1.5 w-full rounded-full mb-3"
                  style={{
                    background: `linear-gradient(90deg, ${style.primary}, ${style.secondary})`,
                  }}
                />
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15 font-display text-xl font-bold text-gold ring-1 ring-gold/40">
                      {rank}
                    </span>
                    <TeamCrest name={team.name} size="md" />
                  </div>
                  <ApComparisonBadge
                    teamName={team.name}
                    communityRank={rank}
                    hasBallots={hasBallots}
                  />
                </div>

                <div className="mt-3">
                  <h3 className="font-display text-2xl leading-none font-bold tracking-wide text-cream uppercase">
                    {team.name}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted">{style.mascot}</span>
                    <span className="text-line-bright">•</span>
                    <ConferenceBadge conference={team.conference} />
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-1.5 border-t border-line/60 pt-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-muted">
                      {hasBallots
                        ? `${team.points.toLocaleString()} pts`
                        : `Seed #${rank}`}
                    </span>
                    <span className="text-gold">
                      {hasBallots
                        ? `${team.first_place_votes} 1st-pl (${pct}%)`
                        : `AP #${getApRank(team.name) ?? rank}`}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-field">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold to-gold-bright"
                      style={{ width: `${Math.max(8, pct)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Controls Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-card/95 p-4 shadow-md">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          {/* View Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-line bg-field p-1">
            <button
              type="button"
              onClick={() => setView("all")}
              className={`rounded-lg px-3.5 py-1.5 font-display text-sm font-semibold tracking-wider uppercase transition ${
                view === "all"
                  ? "bg-gold text-field shadow-sm"
                  : "text-muted hover:text-cream"
              }`}
            >
              All 136 Teams
            </button>
            <button
              type="button"
              onClick={() => setView("top25")}
              className={`rounded-lg px-3.5 py-1.5 font-display text-sm font-semibold tracking-wider uppercase transition ${
                view === "top25"
                  ? "bg-gold text-field shadow-sm"
                  : "text-muted hover:text-cream"
              }`}
            >
              Top 25 Only
            </button>
            <button
              type="button"
              onClick={() => setView("conferences")}
              className={`rounded-lg px-3.5 py-1.5 font-display text-sm font-semibold tracking-wider uppercase transition ${
                view === "conferences"
                  ? "bg-gold text-field shadow-sm"
                  : "text-muted hover:text-cream"
              }`}
            >
              Conference Power ({conferenceStats.length})
            </button>
          </div>

          {/* Search & Conference Filter */}
          <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center lg:max-w-xl">
            <div className="relative flex-1">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search team, mascot, or conference…"
                aria-label="Search teams in standings"
                className="w-full rounded-xl border border-line bg-field px-3.5 py-2 text-sm text-cream placeholder:text-muted/70 outline-none transition focus:border-gold"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded px-1.5 py-0.5 text-xs text-muted hover:text-cream"
                >
                  Clear
                </button>
              ) : null}
            </div>

            <select
              value={selectedConference}
              onChange={(e) => setSelectedConference(e.target.value)}
              aria-label="Filter standings by conference"
              className="rounded-xl border border-line bg-field px-3.5 py-2 text-sm text-cream outline-none transition focus:border-gold"
            >
              <option value="">All Conferences (136)</option>
              {conferences.map((conf) => (
                <option key={conf} value={conf}>
                  {conf}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Conference Quick-Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5">
          <button
            type="button"
            onClick={() => setSelectedConference("")}
            className={`shrink-0 rounded-lg border px-2.5 py-1 font-display text-xs font-semibold tracking-wider uppercase transition ${
              selectedConference === ""
                ? "border-gold bg-gold/20 text-gold"
                : "border-line bg-field/60 text-muted hover:border-line-bright hover:text-cream"
            }`}
          >
            All FBS ({ordered.length})
          </button>
          {conferenceStats.map((stat) => {
            const active = selectedConference === stat.conference;
            const meta = getConferenceMeta(stat.conference);
            return (
              <button
                key={stat.conference}
                type="button"
                onClick={() =>
                  setSelectedConference(active ? "" : stat.conference)
                }
                className={`shrink-0 rounded-lg border px-2.5 py-1 font-display text-xs font-semibold tracking-wider uppercase transition ${
                  active
                    ? "border-gold bg-gold/20 text-gold"
                    : "border-line bg-field/60 text-muted hover:border-line-bright hover:text-cream"
                }`}
              >
                <span
                  className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: meta.accent }}
                />
                {stat.conference}{" "}
                <span className="font-mono text-[10px] opacity-75">
                  ({stat.teamCount})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conference Power Breakdown Panel (shown when view === "conferences") */}
      {view === "conferences" ? (
        <section
          aria-label="Conference Power Breakdown"
          className="overflow-hidden rounded-2xl border border-line bg-card shadow-lg"
        >
          <div className="border-b border-line bg-field-elevated px-5 py-3.5">
            <h3 className="font-display text-xl font-bold tracking-wider text-cream uppercase">
              Conference Power Index
            </h3>
            <p className="text-xs text-muted">
              Ranked by average community poll position across all member schools.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[42rem] text-left">
              <thead className="border-b border-line bg-field/60 font-display text-xs tracking-wider text-muted uppercase">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Conference</th>
                  <th className="px-4 py-3 text-right">Teams</th>
                  <th className="px-4 py-3 text-right">Avg Rank</th>
                  <th className="px-4 py-3 text-right">Top 25</th>
                  <th className="px-4 py-3 text-right">CFP Top 12</th>
                  <th className="px-4 py-3">Highest Ranked Team</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60 text-sm">
                {conferenceStats.map((stat, idx) => (
                  <tr
                    key={stat.conference}
                    onClick={() => {
                      setSelectedConference(stat.conference);
                      setView("all");
                    }}
                    className="cursor-pointer transition hover:bg-card-hover"
                  >
                    <td className="px-4 py-3 font-display text-lg font-bold text-gold">
                      #{idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <ConferenceBadge conference={stat.conference} />
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-muted">
                      {stat.teamCount}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-cream">
                      {(stat.rankSum / stat.teamCount).toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-300">
                      {stat.top25Count}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gold">
                      {stat.top12Count}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <TeamCrest name={stat.bestTeam.name} size="sm" />
                        <span className="font-semibold text-cream">
                          #{stat.bestRank} {stat.bestTeam.name}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {/* Main Standings Table */}
      <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-field-elevated px-4 py-3 text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-cream">
              Showing {filteredTeams.length} of {ordered.length} FBS teams
            </span>
            {selectedConference ? (
              <span>
                in <strong className="text-gold">{selectedConference}</strong>
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-gold" /> #1–4 CFP Bye
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> #5–12 CFP Field
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-sky-400" /> #13–25 Ranked
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left">
            <thead className="border-b border-line bg-field/80 font-display text-xs tracking-wider text-muted uppercase">
              <tr>
                <th className="w-20 px-4 py-3 font-semibold">Rank</th>
                <th className="px-4 py-3 font-semibold">Team</th>
                <th className="px-4 py-3 font-semibold">Conference</th>
                <th className="px-4 py-3 font-semibold">vs. AP</th>
                {hasBallots ? (
                  <>
                    <th className="px-4 py-3 text-right font-semibold">
                      Points
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Avg Rank
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      1st Place
                    </th>
                  </>
                ) : (
                  <th className="px-4 py-3 text-right font-semibold">
                    1st-Place Value
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((team) => {
                const rank = rankMap.get(team.team_id) ?? 1;
                const style = getTeamStyle(team.name);
                const pct =
                  hasBallots && maxPointsPerTeam > 0
                    ? Math.min(100, (team.points / maxPointsPerTeam) * 100)
                    : Math.max(4, ((teamCount - rank + 1) / teamCount) * 100);
                const avgRank =
                  hasBallots && ballotCount > 0
                    ? teamCount + 1 - team.points / ballotCount
                    : rank;

                const showByeCutline = isUnfilteredList && rank === 4;
                const showPlayoffCutline = isUnfilteredList && rank === 12;
                const showTop25Cutline = isUnfilteredList && rank === 25;

                return (
                  <TeamRowGroup
                    key={team.team_id}
                    team={team}
                    rank={rank}
                    mascot={style.mascot}
                    hasBallots={hasBallots}
                    pct={pct}
                    avgRank={avgRank}
                    teamCount={teamCount}
                    showByeCutline={showByeCutline}
                    showPlayoffCutline={showPlayoffCutline}
                    showTop25Cutline={showTop25Cutline}
                  />
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTeams.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <p className="font-display text-xl font-semibold text-cream">
              No FBS programs match that filter
            </p>
            <p className="text-sm text-muted">
              Try clearing your search query or switching back to All Conferences.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedConference("");
                setView("all");
              }}
              className="mt-2 rounded-lg border border-gold/40 bg-gold/15 px-4 py-1.5 font-display text-xs font-bold tracking-wider text-gold uppercase hover:bg-gold/25"
            >
              Reset Filters
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TeamRowGroup({
  team,
  rank,
  mascot,
  hasBallots,
  pct,
  avgRank,
  teamCount,
  showByeCutline,
  showPlayoffCutline,
  showTop25Cutline,
}: {
  team: Standing;
  rank: number;
  mascot: string;
  hasBallots: boolean;
  pct: number;
  avgRank: number;
  teamCount: number;
  showByeCutline: boolean;
  showPlayoffCutline: boolean;
  showTop25Cutline: boolean;
}) {
  const rankBadgeColor =
    rank <= 4
      ? "text-gold font-bold"
      : rank <= 12
        ? "text-emerald-300 font-bold"
        : rank <= 25
          ? "text-sky-300 font-semibold"
          : "text-muted";

  return (
    <>
      <tr className="group border-t border-line/70 transition-colors hover:bg-card-hover">
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className={`font-display text-2xl leading-none tabular-nums ${rankBadgeColor}`}>
              {rank}
            </span>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <TeamCrest name={team.name} size="sm" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-cream">{team.name}</span>
                <RankTierPill rank={rank} />
              </div>
              <p className="text-xs text-muted">{mascot}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <ConferenceBadge conference={team.conference} />
        </td>
        <td className="px-4 py-3">
          <ApComparisonBadge
            teamName={team.name}
            communityRank={rank}
            hasBallots={hasBallots}
          />
        </td>
        {hasBallots ? (
          <>
            <td className="px-4 py-3 text-right">
              <div className="inline-flex flex-col items-end gap-1">
                <span className="font-mono text-sm font-semibold tabular-nums text-cream">
                  {team.points.toLocaleString()}
                </span>
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-field">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold/80 to-gold"
                    style={{ width: `${Math.max(4, pct)}%` }}
                  />
                </div>
              </div>
            </td>
            <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-muted">
              #{avgRank.toFixed(1)}
            </td>
            <td className="px-4 py-3 text-right font-mono text-sm tabular-nums">
              {team.first_place_votes > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-md border border-gold/40 bg-gold/15 px-2 py-0.5 font-bold text-gold">
                  ★ {team.first_place_votes}
                </span>
              ) : (
                <span className="text-muted/60">0</span>
              )}
            </td>
          </>
        ) : (
          <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-muted">
            {teamCount - rank + 1} pts
          </td>
        )}
      </tr>

      {showByeCutline ? (
        <tr aria-hidden="true" className="bg-gold/10">
          <td
            colSpan={hasBallots ? 7 : 5}
            className="border-y border-gold/40 px-4 py-1.5 text-center font-display text-xs font-bold tracking-[0.2em] text-gold uppercase"
          >
            ▲ Top 4 First-Round Bye Cutline ▲
          </td>
        </tr>
      ) : null}

      {showPlayoffCutline ? (
        <tr aria-hidden="true" className="bg-emerald-500/10">
          <td
            colSpan={hasBallots ? 7 : 5}
            className="border-y border-emerald-400/40 px-4 py-1.5 text-center font-display text-xs font-bold tracking-[0.2em] text-emerald-300 uppercase"
          >
            ▲ 12-Team College Football Playoff Cutline ▲
          </td>
        </tr>
      ) : null}

      {showTop25Cutline ? (
        <tr aria-hidden="true" className="bg-sky-500/10">
          <td
            colSpan={hasBallots ? 7 : 5}
            className="border-y border-sky-400/40 px-4 py-1.5 text-center font-display text-xs font-bold tracking-[0.2em] text-sky-300 uppercase"
          >
            ▲ Top 25 National Poll Cutline — Others Receiving Votes Below ▲
          </td>
        </tr>
      ) : null}
    </>
  );
}
