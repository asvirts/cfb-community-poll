import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col items-center gap-6 px-4 py-12">
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
