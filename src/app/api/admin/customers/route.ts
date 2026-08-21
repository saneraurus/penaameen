import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getAdminCustomers } from "@/lib/admin/commerce-operations";

export async function GET(request: Request) {
  try {
    await requireStaffActor("customers:read");
    const search = new URL(request.url).searchParams.get("search") || "";
    return NextResponse.json(
      { customers: await getAdminCustomers(search) },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Unauthorized or failed to fetch customers" },
      { status: 401 },
    );
  }
}
