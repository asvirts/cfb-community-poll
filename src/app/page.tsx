import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Standing } from "@/lib/poll";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <p className="font-display text-sm tracking-[0.2em] text-gold uppercase">Fans have the ball</p>
        <h1 className="font-display text-5xl leading-none font-semibold text-cream">The poll</h1>
        <p className="max-w-2xl text-muted">
          Every signed-in fan ranks all FBS teams. First place is worth one point per team. Last place is worth 1. The table is the sum of those ballots.
        </p>
      </div>
      <Suspense fallback={<p className="text-muted">Loading the poll…</p>}>
        <Standings />
      </Suspense>
    </main>
  );
}

async function Standings() {
  await connection();
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("poll_standings");

  if (error) {
    return (
      <p role="alert" className="text-gold">
        Could not load the poll. {error.message}
      </p>
    );
  }

  const standings = asStandings(data);
  const ballotCount = standings[0]?.ballot_count ?? 0;

  if (standings.length === 0) {
    return <p className="text-muted">No teams are in the poll yet.</p>;
  }

  if (ballotCount === 0) {
    return (
      <div className="flex flex-col gap-4">
        <p className="rounded-xl border border-line bg-card px-4 py-3 text-cream">
          No ballots yet. Rank every team to open the poll.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[32rem] text-left">
            <thead className="bg-card text-sm text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Team</th>
                <th className="px-4 py-3 font-medium">Conference</th>
              </tr>
            </thead>
            <tbody>
              {[...standings]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((team) => (
                  <tr key={team.team_id} className="border-t border-line">
                    <td className="px-4 py-2.5 font-semibold">{team.name}</td>
                    <td className="px-4 py-2.5 text-muted">{team.conference}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted">
        Based on {ballotCount} {ballotCount === 1 ? "ballot" : "ballots"}.
      </p>
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[40rem] text-left">
          <thead className="bg-card text-sm text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Rank</th>
              <th className="px-4 py-3 font-medium">Team</th>
              <th className="px-4 py-3 font-medium">Conference</th>
              <th className="px-4 py-3 text-right font-medium">Points</th>
              <th className="px-4 py-3 text-right font-medium">1st place</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => (
              <tr key={team.team_id} className="border-t border-line">
                <td className="px-4 py-2.5 font-display text-xl text-gold">{index + 1}</td>
                <td className="px-4 py-2.5 font-semibold">{team.name}</td>
                <td className="px-4 py-2.5 text-muted">{team.conference}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">{team.points.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">{team.first_place_votes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function asStandings(data: unknown): Standing[] {
  if (!Array.isArray(data)) return [];

  return data.map((row) => {
    const item = row as Record<string, unknown>;
    return {
      team_id: Number(item.team_id),
      name: String(item.name ?? ""),
      conference: String(item.conference ?? ""),
      points: Number(item.points ?? 0),
      first_place_votes: Number(item.first_place_votes ?? 0),
      ballot_count: Number(item.ballot_count ?? 0),
    };
  });
}
