import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { markAllNotificationsRead } from "@/lib/admin/notifications";

export async function POST() {
  try {
    await requireStaffActor("notifications:write");
    const count = await markAllNotificationsRead();
    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("Error marking all notifications read:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
