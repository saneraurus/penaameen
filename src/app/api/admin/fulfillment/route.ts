import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getAdminFulfillmentQueue } from "@/lib/admin/commerce-operations";

export async function GET() {
  try {
    await requireStaffActor("fulfillment:read");
    return NextResponse.json(
      {
        fulfillment: await getAdminFulfillmentQueue(),
        actions: {
          shipmentCreation: "blocked_until_provider_sandbox_and_sop",
          labelPrinting: "blocked_until_provider_support",
        },
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Unauthorized or failed to fetch fulfillment" },
      { status: 401 },
    );
  }
}
