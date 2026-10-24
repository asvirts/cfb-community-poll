import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 px-4 py-12">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 font-display text-xs font-bold tracking-[0.2em] text-gold uppercase">
          New Voter Registration
        </span>
        <h1 className="font-display text-4xl font-bold tracking-wide text-cream uppercase">
          Claim Your Ballot
        </h1>
        <p className="max-w-md text-sm text-muted">
          One verified ballot per subdivision. Rank every FBS team, then rank every FCS team on its own board.
        </p>
      </div>
      <Suspense fallback={<p className="text-muted">Loading sign up…</p>}>
        <SignUp
          routing="hash"
          signInUrl="/login"
          fallbackRedirectUrl="/ballot"
        />
      </Suspense>
    </main>
  );
}
