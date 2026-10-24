import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";

export function SiteHeader() {
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
          <Suspense fallback={<div className="h-8 w-28" />}>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="cursor-pointer rounded-full bg-gold px-3 py-1.5 font-semibold text-field hover:bg-gold/90"
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="cursor-pointer rounded-full border border-line px-3 py-1.5 text-cream hover:border-gold"
                >
                  Sign up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
