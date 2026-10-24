import { useRouter } from "@void/react";
import { useState } from "react";
import { auth } from "void/client";

function nextPath(value: string | null) {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return "/ballot";
}

export function CredentialsForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const signingUp = mode === "sign-up";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const result = signingUp
        ? await auth.signUp.email({ email, password, name })
        : await auth.signIn.email({ email, password });
      if (result.error) {
        setError(result.error.message ?? "Could not sign in.");
        return;
      }
      void router.visit(nextPath(router.query.get("next")));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not sign in.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-4">
      {signingUp ? (
        <label className="flex flex-col gap-1.5 text-sm text-cream">
          Name
          <input
            required
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded-xl border border-line bg-field px-3 py-2.5 text-cream outline-none focus:border-gold"
          />
        </label>
      ) : null}
      <label className="flex flex-col gap-1.5 text-sm text-cream">
        Email
        <input
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-xl border border-line bg-field px-3 py-2.5 text-cream outline-none focus:border-gold"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm text-cream">
        Password
        <input
          required
          type="password"
          minLength={8}
          autoComplete={signingUp ? "new-password" : "current-password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-xl border border-line bg-field px-3 py-2.5 text-cream outline-none focus:border-gold"
        />
      </label>
      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-gold/40 bg-card px-3 py-2 text-sm text-gold"
        >
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-gold px-4 py-3 font-display text-base font-bold tracking-wider text-field uppercase shadow-lg transition hover:bg-gold-bright disabled:opacity-60"
      >
        {pending ? "Checking the gate…" : signingUp ? "Create account" : "Sign in"}
      </button>
    </form>
  );
}
