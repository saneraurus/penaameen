import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getGalleryHealth } from "@/lib/media/gallery-health";

export async function GET() {
  try {
    await requireStaffActor("media:read");
    return NextResponse.json(
      { gallery: getGalleryHealth() },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Unauthorized or failed to fetch media health" },
      { status: 401 },
    );
  }
}
