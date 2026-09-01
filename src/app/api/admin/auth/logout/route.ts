import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin/auth";
import { getStaffActor } from "@/application/auth/clerk-auth";
import { auditStore } from "@/infrastructure/audit";
import { safeRecordAudit } from "@/application/audit/audit-store";
import {
  createCorrelationId,
  createResourceId,
} from "@/domain/common/identifiers";

export async function POST() {
  const correlationId = createCorrelationId("admin-logout");
  const staff = await getStaffActor();

  if (staff) {
    safeRecordAudit(auditStore, {
      actorKind: "staff",
      actorId: staff.staffId,
      actorEmail: staff.email,
      actorRole: staff.orgRole,
      action: "staff:logout",
      targetType: "admin_session",
      targetId: createResourceId(staff.staffId),
      outcome: "succeeded",
      correlationId,
    });
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
