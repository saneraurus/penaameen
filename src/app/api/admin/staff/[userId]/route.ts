import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
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
  await requireStaffActor("access:write");
  const { userId } = await params;

  let body: { role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const role = body.role as ClerkOrgRole | undefined;
  if (!role || !STAFF_ROLES.includes(role)) {
    return NextResponse.json(
      { error: "Invalid or missing role" },
      { status: 422 },
    );
  }

  const updated = await updateStaffRole(userId, role);
  if (!updated) {
    return NextResponse.json(
      { error: "Staff member not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      data: updated as StaffMemberWithCapabilities,
      meta: { requestId: userId },
    },
    { headers: { "cache-control": "no-store" } },
  );
}
