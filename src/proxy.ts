import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

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

function isAdminMutation(req: NextRequest): boolean {
  return (
    req.nextUrl.pathname.startsWith("/api/admin/") &&
    ["POST", "PATCH", "PUT", "DELETE"].includes(req.method)
  );
}

function hasTrustedOrigin(req: NextRequest): boolean {
  const rawOrigin = req.headers.get("origin");
  const rawReferer = req.headers.get("referer");
  const candidate = rawOrigin || rawReferer;

  // Server-to-server requests are validated by route auth/signature checks.
  if (!candidate) return true;

  try {
    const candidateOrigin = new URL(candidate).origin;
    const configuredOrigin = new URL(
      process.env.APP_BASE_URL || req.nextUrl.origin,
    ).origin;
    const trustedOrigins = (process.env.TRUSTED_ORIGINS || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => new URL(value).origin);
    return [configuredOrigin, ...trustedOrigins].includes(candidateOrigin);
  } catch {
    return false;
  }
}

export default clerkMiddleware(async (auth, req) => {
  if (isAdminMutation(req) && !hasTrustedOrigin(req)) {
    return NextResponse.json(
      { error: "Request origin is not trusted" },
      { status: 403 },
    );
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
    return NextResponse.next();
  }

  return NextResponse.next();
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
