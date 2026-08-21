import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { requireRequestOrigin } from "@/application/security/origin-guard";
import { markAllNotificationsRead } from "@/lib/admin/notifications";

export async function POST(request: Request) {
  try {
    requireRequestOrigin(request);
    await requireStaffActor("notifications:write");
    const count = await markAllNotificationsRead();
    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("Error marking all notifications read:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
