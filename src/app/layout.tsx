import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Barlow_Condensed, Source_Sans_3 } from "next/font/google";
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

export const metadata: Metadata = {
  title: "CFB Community Poll",
  description: "Every FBS team, ranked by the fans. One ballot per person.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full bg-field font-sans text-cream">
        <Suspense fallback={null}>
          <ClerkProvider
            signInUrl="/login"
            signUpUrl="/sign-up"
            signInFallbackRedirectUrl="/ballot"
            signUpFallbackRedirectUrl="/ballot"
          >
            <SiteHeader />
            {children}
          </ClerkProvider>
        </Suspense>
      </body>
    </html>
  );
}
