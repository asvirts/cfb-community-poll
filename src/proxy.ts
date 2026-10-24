import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/ballot(.*)"]);

export default clerkMiddleware(
  async (auth, request) => {
    if (isProtectedRoute(request)) {
      const signInUrl = new URL("/login", request.url);
      signInUrl.searchParams.set("redirect_url", request.url);
      await auth.protect({ unauthenticatedUrl: signInUrl.toString() });
    }
  },
  {
    signInUrl: "/login",
    signUpUrl: "/sign-up",
  },
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    // Clerk's Frontend API proxy serves /__clerk/*.js. The static-file rule above skips those.
    "/__clerk/(.*)",
  ],
};
