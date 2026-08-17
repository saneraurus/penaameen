import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getNotifications } from "@/lib/admin/notifications";

export async function GET(request: Request) {
  try {
    await requireStaffActor("notifications:read");
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const perPage = Number(searchParams.get("perPage")) || 25;
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const result = await getNotifications({ page, perPage, unreadOnly });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Unauthorized or failed to fetch notifications" },
      { status: 401 },
    );
  }
}