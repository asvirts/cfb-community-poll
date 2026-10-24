"use client";

import { Show, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { DIVISION_PROFILES } from "@/lib/division";

export function SiteHeader() {
  const pathname = usePathname();
  const isFcs = pathname === "/fcs" || pathname?.startsWith("/ballot/fcs");
  const profile = DIVISION_PROFILES[isFcs ? "FCS" : "FBS"];
  const isPoll = pathname === profile.standingsHref;
  const isBallot = pathname === profile.ballotHref;

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-field/90 backdrop-blur-md">
      {/* Top press-box ticker bar */}
      <div className="border-b border-line/60 bg-field-elevated/90 px-4 py-1">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 text-[11px] tracking-wider text-muted uppercase">
          <div className="flex items-center gap-2 font-mono">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span className="font-semibold text-cream">{profile.seasonLabel}</span>
            <span className="text-line-bright">•</span>
            <span>{profile.programsLabel}</span>
            <span className="hidden sm:inline text-line-bright">•</span>
            <span className="hidden sm:inline">{profile.scoringLabel}</span>
          </div>
          <div className="font-mono text-gold/90">
            Baseline: {profile.pollTitle} Top 25
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link
          href={profile.standingsHref}
          className="group flex items-center gap-3 focus:outline-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/40 bg-gradient-to-br from-gold/25 via-card to-field shadow-inner transition-transform group-hover:scale-105">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="text-gold"
            >
              <path
                d="M19.4 4.6C15.9 1.1 8.8 2.4 5.6 5.6C2.4 8.8 1.1 15.9 4.6 19.4C8.1 22.9 15.2 21.6 18.4 18.4C21.6 15.2 22.9 8.1 19.4 4.6Z"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <path
                d="M8.5 15.5L15.5 8.5M9.5 11.5L12.5 14.5M11.5 9.5L14.5 12.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl leading-none font-bold tracking-wide text-cream uppercase group-hover:text-gold transition-colors">
              CFB Community Poll
            </span>
            <span className="text-[11px] font-medium tracking-widest text-muted uppercase">
              FBS and FCS, ranked by the fans
            </span>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <div className="flex items-center rounded-full border border-line bg-card/80 p-1">
            <Link
              href={isBallot ? "/ballot" : "/"}
              className={`rounded-full px-3 py-1.5 font-display text-sm font-semibold tracking-wider uppercase transition-all ${
                isFcs
                  ? "text-cream/85 hover:text-cream"
                  : "bg-gold text-field shadow-sm"
              }`}
            >
              FBS
            </Link>
            <Link
              href={isBallot ? "/ballot/fcs" : "/fcs"}
              className={`rounded-full px-3 py-1.5 font-display text-sm font-semibold tracking-wider uppercase transition-all ${
                isFcs
                  ? "bg-gold text-field shadow-sm"
                  : "text-cream/85 hover:text-cream"
              }`}
            >
              FCS
            </Link>
          </div>
          <div className="flex items-center rounded-full border border-line bg-card/80 p-1">
            <Link
              href={profile.standingsHref}
              className={`rounded-full px-3.5 py-1.5 font-display text-sm font-semibold tracking-wider uppercase transition-all ${
                isPoll
                  ? "bg-gold text-field shadow-sm"
                  : "text-cream/85 hover:text-cream"
              }`}
            >
              Standings
            </Link>
            <Link
              href={profile.ballotHref}
              className={`rounded-full px-3.5 py-1.5 font-display text-sm font-semibold tracking-wider uppercase transition-all ${
                isBallot
                  ? "bg-gold text-field shadow-sm"
                  : "text-cream/85 hover:text-cream"
              }`}
            >
              My Ballot
            </Link>
          </div>

          <Suspense fallback={<div className="h-9 w-28 rounded-full bg-card/60" />}>
            <Show when="signed-out">
              <div className="flex items-center gap-2 pl-1">
                <Link
                  href="/login"
                  className="rounded-full bg-gold px-4 py-1.5 font-display text-sm font-bold tracking-wider text-field uppercase shadow-sm transition hover:bg-gold-bright"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-full border border-line-bright bg-card/70 px-4 py-1.5 font-display text-sm font-semibold tracking-wider text-cream uppercase transition hover:border-gold hover:text-gold"
                >
                  Sign up
                </Link>
              </div>
            </Show>
            <Show when="signed-in">
              <div className="flex items-center pl-1">
                <UserButton />
              </div>
            </Show>
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
