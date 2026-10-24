import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { BallotEditor } from "@/components/ballot-editor";
import { alphabeticalTeams, orderTeams, type Pick, type Team } from "@/lib/poll";
import { createClient } from "@/lib/supabase/server";

export default function BallotPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-5xl leading-none font-semibold">My ballot</h1>
        <p className="max-w-2xl text-muted">
          Put every FBS team in order. Your ballot replaces the previous one, and the public poll updates from the latest ranking.
        </p>
      </div>
      <Suspense fallback={<p className="text-muted">Loading your ballot…</p>}>
        <BallotLoader />
      </Suspense>
    </main>
  );
}

async function BallotLoader() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: teamsData, error: teamsError } = await supabase
    .from("teams")
    .select("id, name, conference");

  if (teamsError) {
    return (
      <p role="alert" className="text-gold">
        Could not load teams. {teamsError.message}
      </p>
    );
  }

  const teams = asTeams(teamsData);
  const { data: ballot, error: ballotError } = await supabase
    .from("ballots")
    .select("ballot_picks(team_id, rank)")
    .eq("user_id", user.id)
    .maybeSingle();

  if (ballotError) {
    return (
      <p role="alert" className="text-gold">
        Could not load your ballot. {ballotError.message}
      </p>
    );
  }

  const picks = asPicks(ballot?.ballot_picks);
  const ordered = picks.length > 0 ? orderTeams(teams, picks) : alphabeticalTeams(teams);

  return <BallotEditor key={user.id} userId={user.id} teams={ordered} />;
}

function asTeams(data: unknown): Team[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const item = row as Record<string, unknown>;
    return {
      id: Number(item.id),
      name: String(item.name ?? ""),
      conference: String(item.conference ?? ""),
    };
  });
}

function asPicks(data: unknown): Pick[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const item = row as Record<string, unknown>;
    return {
      team_id: Number(item.team_id),
      rank: Number(item.rank),
    };
  });
}
