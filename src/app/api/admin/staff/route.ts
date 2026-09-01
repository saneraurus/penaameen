import { NextRequest, NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import {
  createStaffMember,
  getStaffMembers,
  STAFF_ROLES,
} from "@/lib/admin/staff";
import { auditStore } from "@/infrastructure/audit";
import { safeRecordAudit } from "@/application/audit/audit-store";
import {
  createCorrelationId,
  createResourceId,
} from "@/domain/common/identifiers";
import type { ClerkOrgRole } from "@/application/auth/clerk-auth";

export async function GET() {
  try {
    await requireStaffActor("access:read");
    const members = await getStaffMembers();
    return NextResponse.json({ data: members });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json(
      { error: message },
      { status: message.includes("AUTHENTICATION_REQUIRED") ? 401 : 403 },
    );
  }
}

export async function POST(req: NextRequest) {
  const correlationId = createCorrelationId("admin-create-staff");

  try {
    const actor = await requireStaffActor("access:write");
    const body = await req.json();
    const { username, fullName, role, password } = body;

    if (!username || typeof username !== "string" || !username.trim()) {
      return NextResponse.json(
        { error: "Username wajib diisi." },
        { status: 400 },
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter." },
        { status: 400 },
      );
    }

    if (!role || !STAFF_ROLES.includes(role as ClerkOrgRole)) {
      return NextResponse.json({ error: "Role tidak valid." }, { status: 400 });
    }

    const member = await createStaffMember({
      username: username.trim(),
      fullName: typeof fullName === "string" ? fullName.trim() : null,
      role: role as ClerkOrgRole,
      password,
    });

    safeRecordAudit(auditStore, {
      actorKind: "staff",
      actorId: actor.staffId,
      actorEmail: actor.email,
      actorRole: actor.orgRole,
      action: "staff:create",
      targetType: "admin_user",
      targetId: createResourceId(member.id),
      outcome: "succeeded",
      after: {
        username: member.username,
        role: member.role,
        fullName: member.fullName,
      },
      correlationId,
    });

    return NextResponse.json({ data: member }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create staff member";

    safeRecordAudit(auditStore, {
      actorKind: "staff",
      action: "staff:create",
      targetType: "admin_user",
      targetId: createResourceId("new-staff-failure"),
      outcome: "failed",
      reason: message,
      correlationId,
    });

    return NextResponse.json(
      { error: message },
      {
        status: message.includes("AUTHENTICATION_REQUIRED")
          ? 401
          : message.includes("AUTHORIZATION_DENIED")
            ? 403
            : 400,
      },
    );
  }
}
