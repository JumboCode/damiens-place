import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip the public upload handler, Next.js internals, and static files.
    "/((?!api/uploads/proof-of-residence(?:/|$)|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for Clerk's auto-proxy path
    "/__clerk/:path*",
    // Always run for API routes except the public upload handler
    "/((?!api/uploads/proof-of-residence(?:/|$))(?:api|trpc).*)",
  ],
};
