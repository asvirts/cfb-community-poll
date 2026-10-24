import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { BallotEditor } from "@/components/ballot-editor";
import { listBallotPicks, listTeams } from "@/lib/db";
import { DIVISION_PROFILES, type Division } from "@/lib/division";
import { orderTeams, startingOrder } from "@/lib/poll";

export function DivisionBallot({ division }: { division: Division }) {
  const profile = DIVISION_PROFILES[division];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:py-10">
      <section className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-card via-field-elevated to-field p-6 shadow-2xl sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl"
        />
        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 font-display text-xs font-bold tracking-[0.2em] text-gold uppercase">
                Official Voter Desk
              </span>
              <span className="rounded-full border border-line bg-field/80 px-3 py-1 font-mono text-xs text-muted">
                {profile.ballotBadge}
              </span>
            </div>

            <h1 className="font-display text-5xl leading-none font-bold tracking-tight text-cream uppercase sm:text-6xl">
              {profile.ballotTitle}
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {profile.ballotHero}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={profile.standingsHref}
              className="inline-flex items-center gap-2 rounded-xl border border-line-bright bg-field/80 px-4 py-2.5 font-display text-sm font-semibold tracking-wider text-cream uppercase transition hover:border-gold hover:text-gold"
            >
              ← View Live Poll
            </Link>
          </div>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-8 text-center">
            <p className="font-display text-xl tracking-wider text-gold uppercase">
              Loading your ballot…
            </p>
            <p className="text-sm text-muted">{profile.ballotLoading}</p>
          </div>
        }
      >
        <BallotLoader division={division} />
      </Suspense>
    </main>
  );
}

async function BallotLoader({ division }: { division: Division }) {
  await connection();
  const profile = DIVISION_PROFILES[division];
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  let ordered;
  let hasExistingBallot = false;
  try {
    const teams = await listTeams(division);
    const picks = await listBallotPicks(userId, division);
    hasExistingBallot = picks.length > 0;
    ordered = hasExistingBallot
      ? orderTeams(teams, picks)
      : startingOrder(teams, profile.seed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    return (
      <p
        role="alert"
        className="rounded-2xl border border-gold/40 bg-card p-6 text-gold"
      >
        Could not load your {profile.name} ballot. {message}
      </p>
    );
  }

  return (
    <BallotEditor
      key={`${division}-${userId}`}
      userId={userId}
      division={division}
      teams={ordered}
      hasExistingBallot={hasExistingBallot}
    />
  );
}
