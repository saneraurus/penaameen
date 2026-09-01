import { NextResponse } from "next/server";
import { getStaffActor } from "@/application/auth/clerk-auth";

export async function GET() {
  const staff = await getStaffActor();

  if (!staff) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({
    staff: {
      id: staff.staffId,
      username: staff.email.replace(/@admin\.local$/, ""),
      fullName: staff.fullName,
      role: staff.orgRole,
      capabilities: Array.from(staff.capabilities),
    },
  });
}
