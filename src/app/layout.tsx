import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Barlow_Condensed, JetBrains_Mono, Source_Sans_3 } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "CFB Community Poll — All 136 FBS Programs Ranked by Fans",
  description:
    "Every FBS college football program from #1 to #136, ranked by the fans. One ballot per person, Borda count scoring.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-field font-sans text-cream selection:bg-gold/30 selection:text-cream">
        <Suspense fallback={null}>
          <ClerkProvider
            signInUrl="/login"
            signUpUrl="/sign-up"
            signInFallbackRedirectUrl="/ballot"
            signUpFallbackRedirectUrl="/ballot"
          >
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
                      136 FBS TEAMS
                    </span>
                  </div>
                  <p className="max-w-xl text-xs leading-relaxed text-muted">
                    Every signed-in fan submits a full 1–136 ballot. Rank #1 awards 136 points down to 1 point for #136. Ties break by first-place votes, then alphabetical order.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                  <Link href="/" className="hover:text-gold transition-colors">
                    Live Standings
                  </Link>
                  <span className="text-line-bright">•</span>
                  <Link href="/ballot" className="hover:text-gold transition-colors">
                    Submit / Edit Ballot
                  </Link>
                  <span className="text-line-bright">•</span>
                  <span className="font-mono text-[11px] text-muted/80">
                    Seeded with Oct. 18 AP Top 25
                  </span>
                </div>
              </div>
            </footer>
          </ClerkProvider>
        </Suspense>
      </body>
    </html>
  );
}
