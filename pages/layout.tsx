import { Link } from "@void/react";

import { SiteHeader } from "@/components/site-header";

import "../src/styles/globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <footer className="mt-16 border-t border-line bg-field-elevated/90">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold tracking-wider text-gold uppercase">
                CFB Community Poll
              </span>
              <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">
                FBS + FCS
              </span>
            </div>
            <p className="max-w-xl text-xs leading-relaxed text-muted">
              Each signed-in fan submits one full ballot per subdivision. FBS rank #1 awards 138
              points. FCS rank #1 awards 128. Ties break by first-place votes, then alphabetical
              order.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
            <Link href="/" className="transition-colors hover:text-gold">
              FBS Standings
            </Link>
            <span className="text-line-bright">•</span>
            <Link href="/fcs" className="transition-colors hover:text-gold">
              FCS Standings
            </Link>
            <span className="text-line-bright">•</span>
            <Link href="/ballot" className="transition-colors hover:text-gold">
              Submit / Edit Ballot
            </Link>
            <span className="text-line-bright">•</span>
            <span className="font-mono text-[11px] text-muted/80">
              FBS seed: Oct. 18 AP • FCS seed: Oct. 19 Stats Perform
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
