import { NextResponse } from "next/server";
import { withRLSContext } from "@/middleware/rls-context";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return withRLSContext(async (context, tx) => {
    if (context.actorKind !== "customer") {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    try {
      const { id } = await params;
      const order = await tx.order.findFirst({
        where: { OR: [{ id }, { orderNumber: id }] },
        include: {
          items: { include: { product: true } },
          statusHistory: { orderBy: { createdAt: "asc" } },
        },
      });

      return order
        ? NextResponse.json({ order })
        : NextResponse.json({ error: "Order not found" }, { status: 404 });
    } catch (error) {
      console.error("Error fetching order:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  });
}
