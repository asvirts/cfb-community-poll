import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { signIn, signUp } from "@/app/actions";
import { currentUser } from "@/lib/auth";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-5xl leading-none font-semibold">Sign in</h1>
        <p className="text-muted">Use an email and password. One account, one full FBS ballot.</p>
      </div>
      <Suspense fallback={null}>
        <SignedInRedirect />
        <LoginNotice searchParams={searchParams} />
      </Suspense>
      <form action={signIn} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-muted">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="rounded-lg border border-line bg-card px-3 py-2 text-cream outline-none focus:border-gold"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted">
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            minLength={6}
            required
            className="rounded-lg border border-line bg-card px-3 py-2 text-cream outline-none focus:border-gold"
          />
        </label>
        <button type="submit" className="rounded-lg bg-gold px-4 py-2 font-semibold text-field">
          Sign in
        </button>
        <button
          type="submit"
          formAction={signUp}
          className="rounded-lg border border-line px-4 py-2 font-semibold text-cream"
        >
          Create account
        </button>
      </form>
    </main>
  );
}

async function SignedInRedirect() {
  await connection();
  const user = await currentUser().catch(() => null);
  if (user) redirect("/ballot");
  return null;
}

async function LoginNotice({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  await connection();
  const params = await searchParams;
  if (!params.error && !params.message) return null;

  return (
    <p role="alert" className="rounded-xl border border-line bg-card px-4 py-3 text-cream">
      {params.error ?? params.message}
    </p>
  );
}
