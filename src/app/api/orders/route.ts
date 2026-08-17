import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import Midtrans from "midtrans-client";

const createOrderSchema = z.object({
  addressId: z.string().cuid(),
  shippingMethod: z.string(), // e.g., "jne-reg"
  shippingCost: z.number().int().positive(),
  shippingRate: z.any().optional(),
});

const midtrans = new Midtrans.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

function generateOrderNumber(): string {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `PA-${yyyy}${mm}${dd}-${random}`;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { addressId, shippingMethod, shippingCost, shippingRate } = createOrderSchema.parse(body);

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.product.name}`, available: item.product.stock },
          { status: 400 }
        );
      }
    }

    const subtotal = cart.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
    const total = subtotal + shippingCost;
    const orderNumber = generateOrderNumber();

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: "PENDING_PAYMENT",
          subtotal: BigInt(subtotal),
          shippingCost: BigInt(shippingCost),
          total: BigInt(total),
          currency: "IDR",
          shippingAddress: {
            label: address.label,
            recipientName: address.recipientName,
            phone: address.phone,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            city: address.city,
            province: address.province,
            postalCode: address.postalCode,
            country: address.country,
          },
          shippingMethod,
          shippingRate: shippingRate ?? null,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
              subtotal: BigInt(Number(item.product.price) * item.quantity),
            })),
          },
          statusHistory: {
            create: {
              status: "PENDING_PAYMENT",
              note: "Order created, awaiting payment",
            },
          },
        },
        include: { items: true },
      });

      return newOrder;
    });

    const midtransOrderId = order.id;
    const parameter = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: total,
      },
      customer_details: {
        first_name: address.recipientName,
        email: (await prisma.user.findUnique({ where: { id: userId } }))?.email ?? "",
        phone: address.phone,
        shipping_address: {
          first_name: address.recipientName,
          address: address.addressLine1,
          city: address.city,
          postal_code: address.postalCode,
          phone: address.phone,
        },
      },
      item_details: order.items.map((item) => ({
        id: item.productId,
        price: Number(item.price),
        quantity: item.quantity,
        name: `Product ${item.productId}`,
      })),
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order_id=${midtransOrderId}`,
        error: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/payment?error=true&order_id=${midtransOrderId}`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/payment?pending=true&order_id=${midtransOrderId}`,
      },
    };

    const midtransResponse = await midtrans.createTransaction(parameter);

    await prisma.order.update({
      where: { id: order.id },
      data: {
        midtransOrderId,
        midtransToken: midtransResponse.token,
      },
    });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      snapToken: midtransResponse.token,
      redirectUrl: midtransResponse.redirect_url,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
