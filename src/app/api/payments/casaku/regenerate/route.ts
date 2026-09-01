import { NextResponse } from "next/server";
import { getApiSettings } from "@/lib/admin/api-settings";
import {
  buildCasakuConfig,
  generateQrisForOrder,
} from "@/lib/payment/casaku-service";
import { CasakuError } from "@/lib/payment/casaku";
import { withRLSContext } from "@/middleware/rls-context";
import { createNotification } from "@/lib/admin/notifications";

/**
 * Regenerates a Casaku QRIS for an existing PENDING_PAYMENT order
 * without creating a duplicate order. The customer can use this when
 * the previous QR has expired.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId } = body as { orderId: string };

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 },
      );
    }

    const order = await withRLSContext(async (context, tx) => {
      if (context.actorKind !== "customer") return null;
      return tx.order.findUnique({
        where: { id: orderId },
        select: { id: true, orderNumber: true, status: true, total: true },
      });
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "PENDING_PAYMENT") {
      return NextResponse.json(
        { error: `Order is already ${order.status}; QR cannot be regenerated` },
        { status: 409 },
      );
    }

    const settings = getApiSettings();
    const config = buildCasakuConfig(settings);
    if (!config) {
      return NextResponse.json(
        { error: "Casaku belum dikonfigurasi" },
        { status: 503 },
      );
    }

    try {
      const result = await generateQrisForOrder(
        order.id,
        Number(order.total),
        settings,
      );

      if (!result.ok) {
        return NextResponse.json(
          { error: result.error || "Gagal membuat QRIS" },
          { status: 502 },
        );
      }

      await createNotification({
        type: "payment.qr_regenerated",
        severity: "info",
        title: `QRIS baru di-generate (${order.orderNumber})`,
        message: `Pelanggan memperbarui kode QRIS untuk pesanan ${order.orderNumber} (Rp${Number(order.total).toLocaleString("id-ID")}).`,
        targetType: "order",
        targetId: order.id,
      }).catch(() => undefined);

      return NextResponse.json({
        ok: true,
        data: result.data,
        expiresAt: result.expiresAt.toISOString(),
      });
    } catch (err) {
      const message =
        err instanceof CasakuError ? err.message : "Gagal menghubungi Casaku";
      const status = err instanceof CasakuError ? err.status : 502;
      return NextResponse.json({ error: message }, {
        status: status ?? 502,
      } as Parameters<typeof NextResponse.json>[1]);
    }
  } catch (error) {
    console.error("Error regenerating Casaku QRIS:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
