import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getAssistantHealth } from "@/lib/assistant/assistant-health";

export async function GET() {
  try {
    await requireStaffActor("analytics:read");
    return NextResponse.json(getAssistantHealth(), {
      headers: { "cache-control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized or failed to fetch assistant health" },
      { status: 401 },
    );
  }
}
