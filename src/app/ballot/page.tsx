import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { BallotEditor } from "@/components/ballot-editor";
import { currentUser } from "@/lib/auth";
import { listBallotPicks, listTeams } from "@/lib/db";
import { alphabeticalTeams, orderTeams } from "@/lib/poll";

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
  let user;
  try {
    user = await currentUser();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    return (
      <p role="alert" className="text-gold">
        Could not load your ballot. {message}
      </p>
    );
  }

  if (!user) {
    redirect("/login");
  }

  let ordered;
  try {
    const teams = await listTeams();
    const picks = await listBallotPicks(user.id);
    ordered = picks.length > 0 ? orderTeams(teams, picks) : alphabeticalTeams(teams);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    return (
      <p role="alert" className="text-gold">
        Could not load your ballot. {message}
      </p>
    );
  }

  return <BallotEditor key={user.id} userId={user.id} teams={ordered} />;
}
