import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { transitionOrder, type OrderTransition } from "@/lib/admin/orders";

const VALID_TRANSITIONS: OrderTransition[] = [
  "mark_paid",
  "mark_processing",
  "mark_completed",
  "cancel",
  "refund",
  "mark_fulfilled",
  "mark_shipped",
  "mark_delivered",
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireStaffActor("orders:transition");
    const { id } = await params;
    const body = await request.json();
    const transition = body.transition as OrderTransition;

    if (!VALID_TRANSITIONS.includes(transition)) {
      return NextResponse.json(
        { error: "Invalid transition" },
        { status: 400 },
      );
    }

    const updated = await transitionOrder(id, transition);
    if (!updated) {
      return NextResponse.json(
        { error: "Order not found or transition not allowed" },
        { status: 404 },
      );
    }

    return NextResponse.json({ order: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
