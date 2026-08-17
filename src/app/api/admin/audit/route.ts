import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getAuditStore } from "@/infrastructure/audit";
import type { AuditListOptions } from "@/application/audit/audit-store";

export async function GET(request: Request) {
  try {
    await requireStaffActor("audit:read");
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const perPage = Number(searchParams.get("perPage")) || 50;

    const action = searchParams.get("action");
    const targetType = searchParams.get("targetType");
    const actorId = searchParams.get("actorId");
    const outcome = searchParams.get("outcome");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const options: AuditListOptions = {
      page,
      perPage,
      ...(action ? { action } : {}),
      ...(targetType ? { targetType } : {}),
      ...(actorId ? { actorId } : {}),
      ...(outcome ? { outcome } : {}),
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
    };

    const result = await getAuditStore().list(options);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching audit events:", error);
    return NextResponse.json(
      { error: "Unauthorized or failed to fetch audit events" },
      { status: 401 },
    );
  }
}
