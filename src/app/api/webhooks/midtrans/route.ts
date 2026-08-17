import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapMidtransStatus } from "@/lib/order-status";
import crypto from "crypto";
import { isSystemControlEnabled } from "@/lib/admin/system-controls";
import { createNotification } from "@/lib/admin/notifications";
import { auditStore } from "@/infrastructure/audit";
import { recordSystemAudit } from "@/application/audit/audit-store";
import { createResourceId } from "@/domain/common/identifiers";

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
      signature_[REDACTED],
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
      signature_[REDACTED],
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

async function sendOrderConfirmationEmail(orderId: string) {
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: { include: { product: true } },
      },
    });

    if (!order || !order.user.email) return;

    const shippingAddress = (order.shippingAddress ?? {}) as {
      recipientName?: string;
      addressLine1?: string;
      addressLine2?: string | null;
      city?: string;
      province?: string;
      postalCode?: string;
      country?: string;
      phone?: string;
    };

    const itemsHtml = order.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.product?.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">Rp${Number(item.price).toLocaleString()}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">Rp${Number(item.subtotal).toLocaleString()}</td>
      </tr>
    `,
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
          <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
            <h1 style="color: #12351d;">Pesanan Anda Dikonfirmasi</h1>
            <p>Halo ${order.user.name ?? "Pelanggan"},</p>
            <p>Terima kasih telah berbelanja di PENA AMEEN. Pesanan Anda telah dikonfirmasi dan akan segera diproses.</p>
            
            <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0 0 8px;"><strong>Nomor Pesanan:</strong> ${order.orderNumber}</p>
              <p style="margin: 0;"><strong>Tanggal:</strong> ${new Date(order.createdAt).toLocaleDateString("id-ID")}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Produk</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Harga</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="margin-top: 24px; text-align: right;">
              <p style="margin: 4px 0;"><strong>Subtotal:</strong> Rp${Number(order.subtotal).toLocaleString()}</p>
              <p style="margin: 4px 0;"><strong>Ongkir:</strong> Rp${Number(order.shippingCost).toLocaleString()}</p>
              <p style="margin: 8px 0 0; font-size: 18px;"><strong>Total: Rp${Number(order.total).toLocaleString()}</strong></p>
            </div>

            <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px;"><strong>Alamat Pengiriman:</strong></p>
              <p style="margin: 0; white-space: pre-line;">${shippingAddress.recipientName ?? ""}
${shippingAddress.addressLine1 ?? ""}${shippingAddress.addressLine2 ? "\n" + shippingAddress.addressLine2 : ""}
${shippingAddress.city ?? ""}, ${shippingAddress.province ?? ""} ${shippingAddress.postalCode ?? ""}
${shippingAddress.country ?? ""}
Telp: ${shippingAddress.phone ?? ""}</p>
            </div>

            <p style="margin-top: 32px; color: #6b7280; font-size: 14px;">
              Jika Anda memiliki pertanyaan, silakan hubungi kami di <a href="mailto:no-reply@penaameen.com">no-reply@penaameen.com</a>
            </p>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "Pena Ameen <no-reply@penaameen.com>",
      to: order.user.email,
      subject: `Pesanan ${order.orderNumber} Dikonfirmasi - PENA AMEEN`,
      html,
    });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
}
