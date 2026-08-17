import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { auditStore } from "@/infrastructure/audit";
import { recordStaffAudit } from "@/application/audit/audit-store";
import { createRequestCorrelationId } from "@/infrastructure/observability/correlation-id";
import { createResourceId } from "@/domain/common/identifiers";
import {
  getStaffMemberById,
  updateStaffRole,
  STAFF_ROLES,
  type StaffMemberWithCapabilities,
} from "@/lib/admin/staff";
import type { ClerkOrgRole } from "@/application/auth/clerk-auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
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
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const actor = await requireStaffActor("access:write");
  const correlationId = createRequestCorrelationId(
    request.headers.get("x-request-id"),
  );
  const { userId } = await params;

  let body: { role?: string };
  try {
    body = await request.json();
  } catch {
    await recordStaffAudit(auditStore, actor, {
      action: "staff.role.denied",
      targetType: "staff",
      targetId: createResourceId(userId),
      outcome: "denied",
      correlationId,
      reason: "Invalid JSON body",
    });
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const role = body.role as ClerkOrgRole | undefined;
  if (!role || !STAFF_ROLES.includes(role)) {
    await recordStaffAudit(auditStore, actor, {
      action: "staff.role.denied",
      targetType: "staff",
      targetId: createResourceId(userId),
      outcome: "denied",
      correlationId,
      reason: `Invalid or missing role: ${String(body.role)}`,
    });
    return NextResponse.json(
      { error: "Invalid or missing role" },
      { status: 422 },
    );
  }

  const before = await getStaffMemberById(userId);
  const updated = await updateStaffRole(userId, role);
  if (!updated) {
    await recordStaffAudit(auditStore, actor, {
      action: "staff.role.failed",
      targetType: "staff",
      targetId: createResourceId(userId),
      outcome: "failed",
      correlationId,
      reason: "Staff member not found",
    });
    return NextResponse.json(
      { error: "Staff member not found" },
      { status: 404 },
    );
  }

  await recordStaffAudit(auditStore, actor, {
    action: "staff.role",
    targetType: "staff",
    targetId: createResourceId(userId),
    outcome: "succeeded",
    correlationId,
    before: { role: before?.role },
    after: { role: updated.role },
  });

  return NextResponse.json(
    {
      data: updated as StaffMemberWithCapabilities,
      meta: { requestId: userId },
    },
    { headers: { "cache-control": "no-store" } },
  );
}
