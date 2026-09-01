import { NextResponse } from "next/server";
import { z } from "zod";
import { CasakuClient } from "@/lib/payment/casaku";
import {
  applyCasakuEvent,
  buildCasakuConfig,
} from "@/lib/payment/casaku-service";
import { getApiSettings } from "@/lib/admin/api-settings";
import { withRLSContext, withSystemRLSContext } from "@/middleware/rls-context";

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
    const { transactionId } = statusSchema.parse(await request.json());
    const order = await withRLSContext(async (context, tx) => {
      if (context.actorKind !== "customer") return null;
      return tx.order.findUnique({
        where: { casakuTransactionId: transactionId },
        select: { id: true, orderNumber: true, status: true },
      });
    });

    if (!order) {
      return NextResponse.json(
        { error: "Transaksi tidak ditemukan" },
        { status: 404 },
      );
    }

    const config = buildCasakuConfig(getApiSettings());
    if (!config) {
      return NextResponse.json(
        { error: "Casaku belum dikonfigurasi" },
        { status: 503 },
      );
    }

    const status = await new CasakuClient(config).checkStatus(transactionId);
    const outcome = await withSystemRLSContext((_systemContext, systemTx) =>
      applyCasakuEvent(
        { transactionId, amount: status.amount, status: status.status },
        "status_poll",
        systemTx,
      ),
    );
    const updatedOrder = await withRLSContext(async (context, tx) => {
      if (context.actorKind !== "customer") return null;
      return tx.order.findUnique({
        where: { id: order.id },
        select: { status: true },
      });
    });

    return NextResponse.json({
      transactionId,
      status: status.status,
      amount: status.amount,
      outcome,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: updatedOrder?.status ?? order.status,
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
