import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // H-3 FIX: require authentication and scope the lookup to the caller's
    // own orders. Previously any unauthenticated client could read any order
    // (incl. customer PII) by guessing the id/orderNumber.
    const authObj = await auth();
    const clerkUserId = authObj?.userId;
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: { clerkId: clerkUserId },
    });
    if (!user) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: {
        userId: user.id,
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: {
          include: { product: true },
        },
        statusHistory: { orderBy: { createdAt: "asc" } },
      },
    });

    if (order) {
      return NextResponse.json({ order });
    }

    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
