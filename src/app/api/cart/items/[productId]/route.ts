import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { resolveProductId } from "@/lib/cart/product-id";

const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await params;
    const canonicalProductId = await resolveProductId(productId);
    if (!canonicalProductId) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const body = await request.json();
    const { quantity } = updateCartItemSchema.parse(body);

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: { cartId: cart.id, productId: canonicalProductId },
      },
      include: { product: true },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Item not in cart" }, { status: 404 });
    }

    if (quantity === 0) {
      await prisma.cartItem.delete({
        where: { id: cartItem.id },
      });
      return NextResponse.json({ success: true, removed: true });
    }

    if (cartItem.product.stock < quantity) {
      return NextResponse.json(
        { error: "Insufficient stock", available: cartItem.product.stock },
        { status: 400 },
      );
    }

    await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await params;
    const canonicalProductId = await resolveProductId(productId);
    if (!canonicalProductId) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: { cartId: cart.id, productId: canonicalProductId },
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Item not in cart" }, { status: 404 });
    }

    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
