import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { PollBoard } from "@/components/poll-board";
import { pollStandings } from "@/lib/db";
import { type Standing } from "@/lib/poll";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:py-10">
      {/* Press-Box Hero Masthead */}
      <section className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-card via-field-elevated to-field p-6 shadow-2xl sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl"
        />
        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 font-display text-xs font-bold tracking-[0.2em] text-gold uppercase">
                Fans have the ball
              </span>
              <span className="rounded-full border border-line bg-field/80 px-3 py-1 font-mono text-xs text-muted">
                Week 8 • Oct. 2026
              </span>
            </div>

            <h1 className="font-display text-5xl leading-none font-bold tracking-tight text-cream uppercase sm:text-6xl">
              The Poll
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Every signed-in fan ranks all FBS teams. First place is worth one point per team. Last place is worth 1. The table is the sum of those ballots.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/ballot"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-3 font-display text-base font-bold tracking-wider text-field uppercase shadow-lg transition hover:bg-gold-bright"
            >
              Submit / Edit My Ballot →
            </Link>
          </div>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-8 text-center">
            <p className="font-display text-xl tracking-wider text-gold uppercase">
              Loading the poll…
            </p>
            <p className="text-sm text-muted">
              Tabulating all 136 FBS team standings from community ballots.
            </p>
          </div>
        }
      >
        <Standings />
      </Suspense>
    </main>
  );
}

async function Standings() {
  await connection();
  let standings: Standing[];
  try {
    standings = await pollStandings();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    return (
      <div
        role="alert"
        className="rounded-2xl border border-gold/40 bg-card p-6 text-gold"
      >
        Could not load the poll. {message}
      </div>
    );
  }

  if (standings.length === 0) {
    return <p className="text-muted">No teams are in the poll yet.</p>;
  }

  return <PollBoard standings={standings} />;
}
