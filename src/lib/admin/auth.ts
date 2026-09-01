import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  ROLE_CAPABILITY_MAP,
  type ClerkOrgRole,
  type StaffActor,
} from "@/application/auth/clerk-auth";
import type { ActorId } from "@/domain/common/identifiers";

export const ADMIN_COOKIE_NAME = "pena_admin_session";
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

export interface AdminTokenPayload {
  userId: string;
  username: string;
  role: ClerkOrgRole;
  exp: number;
  iat: number;
}

function getSessionSecret(): string {
  return (
    process.env.APP_SETTINGS_ENCRYPTION_KEY ||
    process.env.CLERK_SECRET_KEY ||
    "penaameen-default-admin-session-signing-secret-key-32chars"
  );
}

/**
 * Hashes a plaintext password using crypto.scryptSync with a cryptographically secure salt.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verifies a password against a stored salt:hash string using timing-safe comparison.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(":")) {
    return false;
  }
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;

  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);

  if (keyBuffer.length !== derivedKey.length) {
    return false;
  }

  return crypto.timingSafeEqual(keyBuffer, derivedKey);
}

/**
 * Creates an HMAC-SHA256 signed session token for the admin user.
 */
export function signAdminToken(user: {
  id: string;
  username: string;
  role: string;
}): string {
  const payload: AdminTokenPayload = {
    userId: user.id,
    username: user.username,
    role: (user.role in ROLE_CAPABILITY_MAP
      ? user.role
      : "admin") as ClerkOrgRole,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    iat: Date.now(),
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );
  const hmac = crypto.createHmac("sha256", getSessionSecret());
  hmac.update(payloadBase64);
  const signature = hmac.digest("base64url");

  return `${payloadBase64}.${signature}`;
}

/**
 * Verifies and decodes an admin session token. Returns null if expired or invalid.
 */
export function verifyAdminToken(token: string): AdminTokenPayload | null {
  if (!token || !token.includes(".")) {
    return null;
  }

  const [payloadBase64, signature] = token.split(".");
  if (!payloadBase64 || !signature) {
    return null;
  }

  const hmac = crypto.createHmac("sha256", getSessionSecret());
  hmac.update(payloadBase64);
  const expectedSignature = hmac.digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);

  if (
    sigBuf.length !== expBuf.length ||
    !crypto.timingSafeEqual(sigBuf, expBuf)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(payloadBase64, "base64url").toString("utf-8"),
    ) as AdminTokenPayload;

    if (!payload.exp || Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Ensures the default admin account (ihsan / AdminPena123) exists in the database.
 */
export async function ensureDefaultAdmin(): Promise<void> {
  try {
    const existing = await prisma.adminUser.findUnique({
      where: { username: "ihsan" },
    });

    if (!existing) {
      await prisma.adminUser.create({
        data: {
          username: "ihsan",
          passwordHash: hashPassword("AdminPena123"),
          fullName: "Ihsan (Admin)",
          role: "admin",
          isActive: true,
        },
      });
      console.log("[AdminAuth] Default admin account 'ihsan' initialized.");
    }
  } catch (error) {
    console.warn("[AdminAuth] Could not check or seed default admin:", error);
  }
}

/**
 * Retrieves the currently authenticated StaffActor from the database session cookie.
 */
export async function getAdminActorFromSession(): Promise<StaffActor | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    const payload = verifyAdminToken(sessionCookie.value);
    if (!payload?.userId) {
      return null;
    }

    let user: {
      id: string;
      username: string;
      fullName: string | null;
      role: string;
      isActive: boolean;
    } | null = null;

    try {
      user = await prisma.adminUser.findUnique({
        where: { id: payload.userId, isActive: true },
        select: {
          id: true,
          username: true,
          fullName: true,
          role: true,
          isActive: true,
        },
      });
    } catch {
      // If DB is temporarily unreachable, fallback to verified cryptographic payload
      user = null;
    }

    const username = user?.username || payload.username;
    const role = (
      (user?.role || payload.role) in ROLE_CAPABILITY_MAP
        ? user?.role || payload.role
        : "admin"
    ) as ClerkOrgRole;
    const capabilities = ROLE_CAPABILITY_MAP[role] ?? new Set();

    return {
      kind: "staff",
      staffId: (user?.id || payload.userId) as ActorId,
      capabilities,
      email: `${username}@admin.local`,
      fullName: user?.fullName || username,
      orgRole: role,
    };
  } catch {
    return null;
  }
}
