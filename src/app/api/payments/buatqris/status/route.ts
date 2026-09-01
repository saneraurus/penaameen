import { NextResponse } from "next/server";
import { z } from "zod";
import { BuatQrisClient } from "@/lib/payment/buatqris";
import {
  applyBuatQrisEvent,
  buildBuatQrisConfig,
} from "@/lib/payment/buatqris-service";
import { getApiSettings } from "@/lib/admin/api-settings";
import { withRLSContext, withSystemRLSContext } from "@/middleware/rls-context";

const statusSchema = z.object({
  transactionId: z.string().min(1),
});

/**
 * Polls BuatQRIS for the current transaction status on behalf of the customer
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

    const config = buildBuatQrisConfig(getApiSettings());
    if (!config) {
      return NextResponse.json(
        { error: "BuatQRIS belum dikonfigurasi" },
        { status: 503 },
      );
    }

    const statusData = await new BuatQrisClient(config).checkStatus(
      transactionId,
    );
    const outcome = await withSystemRLSContext((_systemContext, systemTx) =>
      applyBuatQrisEvent(
        {
          transactionId,
          amount: statusData.amount,
          totalAmount: statusData.totalAmount,
          status: statusData.status,
        },
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
      status: statusData.status,
      amount: statusData.amount,
      totalAmount: statusData.totalAmount,
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
    console.error("Error checking BuatQRIS status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
