import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveProductId } from "@/lib/cart/product-id";
import { getCurrentUserId, withRLSContext } from "@/middleware/rls-context";

const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
});

export async function GET() {
  return withRLSContext(async (context, tx) => {
    if (context.actorKind !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const cart = await tx.cart.findFirst({
        include: {
          items: {
            include: {
              product: {
                include: { category: true },
              },
            },
          },
        },
      });

      if (!cart) {
        return NextResponse.json({ items: [], total: 0, itemCount: 0 });
      }

      const items = cart.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product: {
          id: item.product.id,
          slug: item.product.slug,
          name: item.product.name,
          category: item.product.category.name,
          price: item.product.price.toString(),
          image: item.product.image,
          stock: item.product.stock,
        },
        subtotal: Number(item.product.price) * item.quantity,
      }));

      const total = items.reduce((sum, item) => sum + item.subtotal, 0);
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

      return NextResponse.json({ items, total: total.toString(), itemCount });
    } catch (error) {
      console.error("Error fetching cart:", error);
      const isDbConnectionError =
        error instanceof Error &&
        ("code" in error
          ? (error as { code?: string }).code === "ECONNREFUSED"
          : /ECONNREFUSED/i.test(error.message));
      if (isDbConnectionError) {
        return NextResponse.json(
          {
            error:
              "Database unavailable — run `npm run db:start` to start embedded Postgres",
            code: "DB_UNAVAILABLE",
          },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  });
}

export async function POST(request: Request) {
  return withRLSContext(async (context, tx) => {
    if (context.actorKind !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const body = await request.json();
      const { productId, quantity } = addToCartSchema.parse(body);
      const userId = await getCurrentUserId(tx);
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const canonicalProductId = await resolveProductId(productId, tx);
      const product = canonicalProductId
        ? await tx.product.findUnique({ where: { id: canonicalProductId } })
        : null;

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
      }

      if (!product.isActive) {
        return NextResponse.json(
          { error: "Product is not available" },
          { status: 400 },
        );
      }

      if (product.stock < quantity) {
        return NextResponse.json(
          { error: "Insufficient stock", available: product.stock },
          { status: 400 },
        );
      }

      let cart = await tx.cart.findFirst();

      if (!cart) {
        cart = await tx.cart.create({
          data: { userId },
        });
      }

      const existingItem = await tx.cartItem.findUnique({
        where: {
          cartId_productId: { cartId: cart.id, productId: product.id },
        },
      });

      const newQuantity = (existingItem?.quantity ?? 0) + quantity;

      if (product.stock < newQuantity) {
        return NextResponse.json(
          { error: "Insufficient stock", available: product.stock },
          { status: 400 },
        );
      }

      if (existingItem) {
        await tx.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity },
        });
      } else {
        await tx.cartItem.create({
          data: {
            cartId: cart.id,
            productId: product.id,
            quantity,
          },
        });
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.issues }, { status: 400 });
      }
      console.error("Error adding to cart:", error);
      const isDbConnectionError =
        error instanceof Error &&
        ("code" in error
          ? (error as { code?: string }).code === "ECONNREFUSED"
          : /ECONNREFUSED/i.test(error.message));
      if (isDbConnectionError) {
        return NextResponse.json(
          {
            error:
              "Database unavailable — run `npm run db:start` to start embedded Postgres",
            code: "DB_UNAVAILABLE",
          },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  });
}
