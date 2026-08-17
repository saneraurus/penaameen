import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getApiSettings, saveApiSettings, type ApiSettings } from "@/lib/admin/api-settings";

export async function GET() {
  try {
    await requireStaffActor("access:read");
    const settings = getApiSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error fetching API settings:", error);
    return NextResponse.json({ error: "Unauthorized or failed to fetch settings" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireStaffActor("access:write");
    const body = await request.json();
    const current = getApiSettings();

    const merged: ApiSettings = {
      midtrans: {
        ...current.midtrans,
        ...(body.midtrans || {}),
      },
      rajaongkir: {
        ...current.rajaongkir,
        ...(body.rajaongkir || {}),
      },
      autoEmail: {
        ...current.autoEmail,
        ...(body.autoEmail || {}),
      },
      emailForwarding: {
        ...current.emailForwarding,
        ...(body.emailForwarding || {}),
      },
      clerkAuth: {
        ...current.clerkAuth,
        ...(body.clerkAuth || {}),
      },
    };

    saveApiSettings(merged);
    return NextResponse.json({ success: true, settings: merged });
  } catch (error) {
    console.error("Error saving API settings:", error);
    return NextResponse.json({ error: "Failed to save API settings" }, { status: 500 });
  }
}
