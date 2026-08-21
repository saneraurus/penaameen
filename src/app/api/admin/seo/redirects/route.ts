import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getRedirectInventoryHealth } from "@/lib/seo/redirect-inventory";

export async function GET() {
  try {
    await requireStaffActor("seo:read");
    return NextResponse.json(
      { inventory: getRedirectInventoryHealth() },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Unauthorized or failed to fetch redirect inventory" },
      { status: 401 },
    );
  }
}
