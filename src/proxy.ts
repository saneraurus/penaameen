import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Public routes — must stay in sync with src/middleware.ts (legacy) and Clerk resource-based checks.
// Patterns ending with (.*) mean prefix match.
const PUBLIC_ROUTE_PATTERNS = [
  "/",
  "/admin(.*)",
  "/api/admin(.*)",
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
    const allowed = new Set<string>();

    if (process.env.APP_BASE_URL) {
      try {
        allowed.add(new URL(process.env.APP_BASE_URL).origin);
      } catch {}
    }

    if (req.nextUrl.origin) {
      allowed.add(req.nextUrl.origin);
    }

    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto =
      req.headers.get("x-forwarded-proto") ||
      req.nextUrl.protocol.replace(":", "") ||
      "http";
    if (host) {
      try {
        allowed.add(new URL(`${proto}://${host}`).origin);
      } catch {}
    }

    if (process.env.NODE_ENV !== "production") {
      allowed.add("http://localhost:3000");
      allowed.add("http://127.0.0.1:3000");
      allowed.add("http://localhost:3001");
      allowed.add("http://127.0.0.1:3001");
    }

    const trustedOrigins = (process.env.TRUSTED_ORIGINS || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    for (const item of trustedOrigins) {
      try {
        allowed.add(new URL(item).origin);
      } catch {}
    }

    return allowed.has(candidateOrigin);
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

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);

  if (!isPublicRoute(req)) {
    await auth.protect();
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
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
