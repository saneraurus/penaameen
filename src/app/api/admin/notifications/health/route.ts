import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getNotificationDeliveryHealth } from "@/lib/notifications/delivery-health";

export async function GET() {
  try {
    await requireStaffActor("notifications:read");
    return NextResponse.json(getNotificationDeliveryHealth(), {
      headers: { "cache-control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized or failed to fetch notification health" },
      { status: 401 },
    );
  }
}
