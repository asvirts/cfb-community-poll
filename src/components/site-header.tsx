import Link from "next/link";
import { connection } from "next/server";
import { signOut } from "@/app/actions";
import { currentUser } from "@/lib/auth";

export async function SiteHeader() {
  await connection();
  const user = await currentUser().catch(() => null);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-field/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="font-display text-2xl leading-none font-semibold tracking-wide text-cream">
          CFB Community Poll
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <Link href="/" className="rounded-full px-3 py-1.5 text-cream hover:bg-card">
            Poll
          </Link>
          <Link href="/ballot" className="rounded-full px-3 py-1.5 text-cream hover:bg-card">
            My ballot
          </Link>
          {user ? (
            <form action={signOut} className="flex items-center gap-2">
              <span className="max-w-40 truncate text-muted">{user.email}</span>
              <button
                type="submit"
                className="rounded-full border border-line px-3 py-1.5 text-cream hover:border-gold"
              >
                Sign out
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-gold px-3 py-1.5 font-semibold text-field hover:bg-gold/90"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
