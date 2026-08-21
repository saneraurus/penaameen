import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getOperationalAnalytics } from "@/application/analytics/operational-analytics";

export async function GET() {
  try {
    await requireStaffActor("analytics:read");
    return NextResponse.json(await getOperationalAnalytics(), {
      headers: { "cache-control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized or failed to fetch analytics" },
      { status: 401 },
    );
  }
}
