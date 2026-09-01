import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_COOKIE_NAME,
  ensureDefaultAdmin,
  hashPassword,
  signAdminToken,
  verifyPassword,
} from "@/lib/admin/auth";
import { auditStore } from "@/infrastructure/audit";
import { safeRecordAudit } from "@/application/audit/audit-store";
import {
  createCorrelationId,
  createActorId,
  createResourceId,
} from "@/domain/common/identifiers";

export async function POST(req: NextRequest) {
  const correlationId = createCorrelationId("admin-login");

  try {
    const body = await req.json();
    const { username, password } = body;

    if (
      !username ||
      !password ||
      typeof username !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi." },
        { status: 400 },
      );
    }

    const normalizedUsername = username.trim().toLowerCase();

    // Ensure default admin account exists before lookup
    await ensureDefaultAdmin().catch(() => undefined);

    let user: {
      id: string;
      username: string;
      passwordHash: string;
      fullName: string | null;
      role: string;
      isActive: boolean;
    } | null = null;

    try {
      user = await prisma.adminUser.findUnique({
        where: { username: normalizedUsername },
      });
    } catch (dbErr) {
      console.warn(
        "[AdminAuth] DB lookup failed, checking default admin fallback:",
        dbErr instanceof Error ? dbErr.message : dbErr,
      );
      // If DB is offline, allow root admin authentication
      if (
        normalizedUsername === "ihsan" &&
        verifyPassword(password, hashPassword("AdminPena123"))
      ) {
        user = {
          id: "admin-ihsan-root",
          username: "ihsan",
          passwordHash: hashPassword("AdminPena123"),
          fullName: "Ihsan (Admin)",
          role: "admin",
          isActive: true,
        };
      }
    }

    if (!user) {
      safeRecordAudit(auditStore, {
        actorKind: "staff",
        actorEmail: normalizedUsername,
        action: "staff:login",
        targetType: "admin_user",
        targetId: createResourceId(normalizedUsername),
        outcome: "denied",
        reason: "User not found",
        correlationId,
      });

      return NextResponse.json(
        { error: "Username atau kata sandi tidak valid." },
        { status: 401 },
      );
    }

    if (!user.isActive) {
      safeRecordAudit(auditStore, {
        actorKind: "staff",
        actorId: createActorId(user.id),
        actorEmail: user.username,
        action: "staff:login",
        targetType: "admin_user",
        targetId: createResourceId(user.id),
        outcome: "denied",
        reason: "User is inactive",
        correlationId,
      });

      return NextResponse.json(
        { error: "Akun ini telah dinonaktifkan. Hubungi administrator." },
        { status: 403 },
      );
    }

    const isValid = verifyPassword(password, user.passwordHash);

    if (!isValid) {
      safeRecordAudit(auditStore, {
        actorKind: "staff",
        actorId: createActorId(user.id),
        actorEmail: user.username,
        action: "staff:login",
        targetType: "admin_user",
        targetId: createResourceId(user.id),
        outcome: "denied",
        reason: "Invalid password",
        correlationId,
      });

      return NextResponse.json(
        { error: "Username atau kata sandi tidak valid." },
        { status: 401 },
      );
    }

    // Update lastActiveAt timestamp if DB is available
    await prisma.adminUser
      .update({
        where: { id: user.id },
        data: { lastActiveAt: new Date() },
      })
      .catch(() => undefined);

    safeRecordAudit(auditStore, {
      actorKind: "staff",
      actorId: createActorId(user.id),
      actorEmail: user.username,
      actorRole: user.role,
      action: "staff:login",
      targetType: "admin_user",
      targetId: createResourceId(user.id),
      outcome: "succeeded",
      correlationId,
    });

    const token = signAdminToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("[Admin Login Error]", error);
    return NextResponse.json(
      {
        error:
          "Terjadi kesalahan saat memproses autentikasi. Silakan coba lagi.",
      },
      { status: 500 },
    );
  }
}
