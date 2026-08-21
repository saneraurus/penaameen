import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getAdminPaymentQueue } from "@/lib/admin/commerce-operations";

export async function GET() {
  try {
    await requireStaffActor("payments:read");
    return NextResponse.json(
      {
        payments: await getAdminPaymentQueue(),
        actions: {
          verification: "blocked_until_verified_evidence",
          refunds: "blocked_until_provider_sandbox_and_policy",
        },
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Unauthorized or failed to fetch payments" },
      { status: 401 },
    );
  }
}
