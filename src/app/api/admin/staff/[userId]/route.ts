import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { requireRequestOrigin } from "@/application/security/origin-guard";
import { auditStore } from "@/infrastructure/audit";
import { safeRecordAudit } from "@/application/audit/audit-store";
import { createRequestCorrelationId } from "@/infrastructure/observability/correlation-id";
import { createResourceId } from "@/domain/common/identifiers";
import {
  deleteStaffMember,
  getStaffMemberById,
  STAFF_ROLES,
  updateStaffPassword,
  updateStaffRole,
  updateStaffStatus,
  type StaffMemberWithCapabilities,
} from "@/lib/admin/staff";
import type { ClerkOrgRole } from "@/application/auth/clerk-auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    await requireStaffActor("access:read");
    const { userId } = await params;
    const member = await getStaffMemberById(userId);

    if (!member) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { data: member, meta: { requestId: userId } },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json(
      { error: message },
      { status: message.includes("AUTHENTICATION_REQUIRED") ? 401 : 403 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  requireRequestOrigin(request);
  const actor = await requireStaffActor("access:write");
  const correlationId = createRequestCorrelationId(
    request.headers.get("x-request-id"),
  );
  const { userId } = await params;

  let body: { role?: string; isActive?: boolean; password?: string };
  try {
    body = await request.json();
  } catch {
    safeRecordAudit(auditStore, {
      actorKind: "staff",
      actorId: actor.staffId,
      actorEmail: actor.email,
      actorRole: actor.orgRole,
      action: "staff:update",
      targetType: "admin_user",
      targetId: createResourceId(userId),
      outcome: "denied",
      correlationId,
      reason: "Invalid JSON body",
    });
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const before = await getStaffMemberById(userId);
  if (!before) {
    return NextResponse.json(
      { error: "Pengguna tidak ditemukan" },
      { status: 404 },
    );
  }

  try {
    // 1. Update role if requested
    if (body.role !== undefined) {
      const role = body.role as ClerkOrgRole;
      if (!STAFF_ROLES.includes(role)) {
        return NextResponse.json(
          { error: "Role yang dipilih tidak valid" },
          { status: 422 },
        );
      }
      await updateStaffRole(userId, role);
    }

    // 2. Update status (active/inactive) if requested
    if (body.isActive !== undefined) {
      if (typeof body.isActive !== "boolean") {
        return NextResponse.json(
          { error: "Nilai status tidak valid" },
          { status: 422 },
        );
      }
      await updateStaffStatus(userId, body.isActive);
    }

    // 3. Update password if requested
    if (body.password !== undefined) {
      if (typeof body.password !== "string" || body.password.length < 6) {
        return NextResponse.json(
          { error: "Password minimal 6 karakter" },
          { status: 422 },
        );
      }
      await updateStaffPassword(userId, body.password);
    }

    const updated = await getStaffMemberById(userId);

    safeRecordAudit(auditStore, {
      actorKind: "staff",
      actorId: actor.staffId,
      actorEmail: actor.email,
      actorRole: actor.orgRole,
      action: "staff:update",
      targetType: "admin_user",
      targetId: createResourceId(userId),
      outcome: "succeeded",
      correlationId,
      before: {
        role: before.role,
        status: before.status,
      },
      after: {
        role: updated?.role,
        status: updated?.status,
        passwordChanged: Boolean(body.password),
      },
    });

    return NextResponse.json(
      {
        data: updated as StaffMemberWithCapabilities,
        meta: { requestId: userId },
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update staff member";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  requireRequestOrigin(request);
  const actor = await requireStaffActor("access:write");
  const correlationId = createRequestCorrelationId(
    request.headers.get("x-request-id"),
  );
  const { userId } = await params;

  try {
    const before = await getStaffMemberById(userId);
    if (!before) {
      return NextResponse.json(
        { error: "Pengguna tidak ditemukan" },
        { status: 404 },
      );
    }

    await deleteStaffMember(userId);

    safeRecordAudit(auditStore, {
      actorKind: "staff",
      actorId: actor.staffId,
      actorEmail: actor.email,
      actorRole: actor.orgRole,
      action: "staff:delete",
      targetType: "admin_user",
      targetId: createResourceId(userId),
      outcome: "succeeded",
      correlationId,
      before: {
        username: before.username,
        role: before.role,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete staff member";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
