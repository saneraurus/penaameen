import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { listStockMovements } from "@/application/inventory/stock-service";
import { isSheetsConfigured } from "@/infrastructure/sheets/sheets-config";

export async function GET() {
  try {
    await requireStaffActor("inventory:read");
    if (!isSheetsConfigured()) {
      return NextResponse.json({ movements: [] });
    }
    const movements = await listStockMovements();
    return NextResponse.json({ movements });
  } catch (error) {
    console.error("Error fetching stock movements:", error);
    return NextResponse.json(
      { error: "Unauthorized or failed to fetch stock movements" },
      { status: 401 },
    );
  }
}
