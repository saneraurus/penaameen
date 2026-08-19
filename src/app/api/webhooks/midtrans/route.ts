import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapMidtransStatus } from "@/lib/order-status";
import crypto from "crypto";
import { isSystemControlEnabled } from "@/lib/admin/system-controls";
import { createNotification } from "@/lib/admin/notifications";
import { auditStore } from "@/infrastructure/audit";
import { recordSystemAudit } from "@/application/audit/audit-store";
import { createResourceId } from "@/domain/common/identifiers";
import { sendOrderConfirmationEmail } from "@/lib/payment/order-email";

function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
  signatureKey: string,
): boolean {
  const input = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const hash = crypto.createHash("sha512").update(input).digest("hex");
  return hash === signatureKey;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      order_id,
      transaction_status,
      fraud_status,
      gross_amount,
      status_code,
      signature_key,
    } = body;

    console.log("Midtrans webhook received:", {
      order_id,
      transaction_status,
      fraud_status,
    });

    if (!order_id) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      console.error("MIDTRANS_SERVER_KEY not configured");
      return NextResponse.json(
        { error: "Server not configured" },
        { status: 500 },
      );
    }

    const isValidSignature = verifyMidtransSignature(
      order_id,
      status_code,
      gross_amount,
      serverKey,
      signature_key,
    );

    if (!isValidSignature) {
      console.error("Invalid Midtrans signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Emergency kill-switch: stop processing payment webhooks entirely.
    if (await isSystemControlEnabled("disable_payment_webhook_processing")) {
      console.warn(
        "Webhook processing disabled by emergency control for order:",
        order_id,
      );
      return NextResponse.json(
        { error: "Webhook processing temporarily disabled" },
        { status: 503 },
      );
    }

    const order = await prisma.order.findUnique({
      where: { midtransOrderId: order_id },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      console.error("Order not found:", order_id);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const newStatus = mapMidtransStatus(transaction_status, fraud_status);
    let note = "";

    switch (transaction_status) {
      case "capture":
        note =
          fraud_status === "challenge"
            ? "Payment captured, under review (challenge)"
            : "Payment captured and accepted";
        break;
      case "settlement":
        note = "Payment settled";
        break;
      case "pending":
        note = "Payment pending";
        break;
      case "deny":
        note = "Payment denied";
        break;
      case "cancel":
        note = "Payment cancelled";
        break;
      case "expire":
        note = "Payment expired";
        break;
      case "refund":
        note = "Payment refunded";
        break;
    }

    if (newStatus && newStatus !== order.status) {
      const finalStatus = newStatus;
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: finalStatus,
            paidAt: finalStatus === "PAID" ? new Date() : null,
            cancelReason: ["CANCELLED", "REFUNDED"].includes(finalStatus)
              ? note
              : null,
            cancelledAt: ["CANCELLED", "REFUNDED"].includes(finalStatus)
              ? new Date()
              : null,
          },
        });

        await tx.orderStatusHistory.create({
          data: {
            orderId: order.id,
            status: finalStatus,
            note,
          },
        });

        if (finalStatus === "PAID") {
          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: { decrement: item.quantity },
              },
            });
          }
        } else if (
          ["CANCELLED", "REFUNDED"].includes(finalStatus) &&
          order.status === "PAID"
        ) {
          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: { increment: item.quantity },
              },
            });
          }
        }
      });

      if (finalStatus === "PAID") {
        await createNotification({
          type: "order.paid",
          severity: "info",
          title: `Pesanan ${order.orderNumber} dibayar`,
          message: `Pembayaran diterima dan stok telah dikurangi otomatis.`,
          targetType: "order",
          targetId: order.id,
        });

        if (!(await isSystemControlEnabled("disable_outbound_email"))) {
          await sendOrderConfirmationEmail(order.id);
        }
      }
    }

    await recordSystemAudit(auditStore, {
      action: "payment.webhook",
      targetType: "order",
      targetId: createResourceId(order.id),
      outcome: "succeeded",
      after: {
        transaction_status,
        fraud_status: fraud_status ?? null,
        gross_amount,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing Midtrans webhook:", error);

    await createNotification({
      type: "webhook.failed",
      severity: "critical",
      title: "Webhook Midtrans gagal diproses",
      message: error instanceof Error ? error.message : "Error tidak diketahui",
      targetType: "webhook",
      targetId: "midtrans",
    });

    await recordSystemAudit(auditStore, {
      action: "payment.webhook",
      targetType: "webhook",
      targetId: createResourceId("midtrans"),
      outcome: "failed",
      after: {
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
