import { Link, useRouter } from "@void/react";

import { CredentialsForm } from "@/components/credentials-form";

export default function LoginPage() {
  const next = useRouter().query.get("next");
  const signUpHref = next ? `/sign-up?next=${encodeURIComponent(next)}` : "/sign-up";
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 px-4 py-12">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 font-display text-xs font-bold tracking-[0.2em] text-gold uppercase">
          Voter Credentials
        </span>
        <h1 className="font-display text-4xl font-bold tracking-wide text-cream uppercase">
          Enter the Press Box
        </h1>
        <p className="max-w-md text-sm text-muted">
          Sign in to submit or update your FBS ballot and your separate FCS ballot.
        </p>
      </div>
      <CredentialsForm mode="sign-in" />
      <p className="text-sm text-muted">
        New voter?{" "}
        <Link href={signUpHref} className="text-gold hover:text-gold-bright">
          Claim a ballot
        </Link>
      </p>
    </main>
  );
}
