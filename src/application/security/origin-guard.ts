import { getServerConfig } from "@/application/config/config";

export type OriginGuardResult =
  { readonly ok: true } | { readonly ok: false; readonly reason: string };

function normalizeOrigin(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function validateRequestOrigin(request: Request): OriginGuardResult {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const candidate = origin
    ? normalizeOrigin(origin)
    : referer
      ? normalizeOrigin(referer)
      : null;

  // Non-browser callers do not send these headers and remain protected by
  // route authentication or webhook signature validation.
  if (!candidate) return { ok: true };

  const config = getServerConfig();
  const allowed = new Set<string>([config.appBaseUrl.origin]);

  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "http";
  if (host) {
    const hostOrigin = normalizeOrigin(`${proto}://${host}`);
    if (hostOrigin) allowed.add(hostOrigin);
  }

  if (process.env.NODE_ENV !== "production") {
    allowed.add("http://localhost:3000");
    allowed.add("http://127.0.0.1:3000");
    allowed.add("http://localhost:3001");
    allowed.add("http://127.0.0.1:3001");
  }

  for (const value of (process.env.TRUSTED_ORIGINS || "").split(",")) {
    const normalized = normalizeOrigin(value.trim());
    if (normalized) allowed.add(normalized);
  }

  return allowed.has(candidate)
    ? { ok: true }
    : { ok: false, reason: "Request origin is not trusted" };
}

export function requireRequestOrigin(request: Request): void {
  if (!validateRequestOrigin(request).ok) {
    throw new Error("ORIGIN_NOT_TRUSTED");
  }
}
