import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

// Public routes — must stay in sync with src/middleware.ts (legacy) and Clerk resource-based checks.
// Patterns ending with (.*) mean prefix match.
const PUBLIC_ROUTE_PATTERNS = [
  "/",
  "/produk(.*)",
  "/sejarah",
  "/tentang",
  "/metode(.*)",
  "/cabang(.*)",
  "/artikel(.*)",
  "/kontak",
  "/education",
  "/search",
  "/shop",
  "/keranjang",
  "/checkout(.*)",
  "/galeri-kegiatan(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/products(.*)",
  "/api/shipping(.*)",
  "/api/orders(.*)",
  "/api/payments(.*)",
  "/api/addresses(.*)",
  "/api/assistant(.*)",
  "/api/v1/health(.*)",
] as const;

function isPublicRoute(req: NextRequest): boolean {
  const pathname = req.nextUrl.pathname;
  return PUBLIC_ROUTE_PATTERNS.some((pattern) => {
    if (pattern.endsWith("(.*)")) {
      const base = pattern.slice(0, -4);
      return pathname === base || pathname.startsWith(base + "/");
    }
    return pathname === pattern;
  });
}

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
