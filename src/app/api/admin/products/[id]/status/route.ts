import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { setProductStatus } from "@/lib/admin/products";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireStaffActor("catalog:write");
    const { id } = await params;
    const body = await request.json();
    const status = body.status as "published" | "draft" | "archived";

    if (!status || !["published", "draft", "archived"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await setProductStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Error setting product status:", error);
    return NextResponse.json({ error: "Failed to update product status" }, { status: 500 });
  }
}
