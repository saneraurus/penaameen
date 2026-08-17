import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { CasakuClient } from "@/lib/payment/casaku";
import {
  applyCasakuEvent,
  buildCasakuConfig,
} from "@/lib/payment/casaku-service";
import { getApiSettings } from "@/lib/admin/api-settings";

const statusSchema = z.object({
  transactionId: z.string().min(1),
});

/**
 * Polls Casaku for the current transaction status on behalf of the customer
 * (used by the "Saya Sudah Bayar" button). Applies paid/cancelled events
 * through the same idempotent path as the webhook.
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { transactionId } = statusSchema.parse(await request.json());

    const order = await prisma.order.findUnique({
      where: { casakuTransactionId: transactionId },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        casakuTotalAmount: true,
        userId: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Transaksi tidak ditemukan" },
        { status: 404 },
      );
    }

    const dbUser = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!dbUser || dbUser.id !== order.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const settings = getApiSettings();
    const config = buildCasakuConfig(settings);
    if (!config) {
      return NextResponse.json(
        { error: "Casaku belum dikonfigurasi" },
        { status: 503 },
      );
    }

    const client = new CasakuClient(config);
    const status = await client.checkStatus(transactionId);

    const outcome = await applyCasakuEvent(
      {
        transactionId,
        amount: status.amount,
        status: status.status,
      },
      "status_poll",
    );

    return NextResponse.json({
      transactionId,
      status: status.status,
      amount: status.amount,
      outcome,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error checking Casaku status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
