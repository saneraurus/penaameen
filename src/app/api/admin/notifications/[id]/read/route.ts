import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { requireRequestOrigin } from "@/application/security/origin-guard";
import { markNotificationRead } from "@/lib/admin/notifications";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    requireRequestOrigin(request);
    await requireStaffActor("notifications:write");
    const { id } = await params;
    const updated = await markNotificationRead(id);
    if (!updated) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, notification: updated });
  } catch (error) {
    console.error("Error marking notification read:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
