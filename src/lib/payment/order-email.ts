import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/admin/notifications";

/**
 * Sends the order confirmation email to the customer after payment is
 * accepted. Shared by the Midtrans and Casaku webhook flows.
 */
export async function sendOrderConfirmationEmail(orderId: string) {
  try {
    if (
      !process.env.RESEND_API_KEY ||
      /REDACTED|\.\.\./i.test(process.env.RESEND_API_KEY)
    ) {
      await createNotification({
        type: "email_delivery_blocked",
        severity: "warning",
        title: "Email order confirmation blocked",
        message: "Resend is not configured with a verified API key.",
        targetType: "order",
        targetId: orderId,
      }).catch(() => undefined);
      return { ok: false as const, reason: "provider_not_configured" as const };
    }
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: { include: { product: true } },
      },
    });

    if (!order || !order.user.email)
      return { ok: false as const, reason: "recipient_missing" as const };

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
    return { ok: true as const };
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    await createNotification({
      type: "email_delivery_failed",
      severity: "critical",
      title: "Order confirmation email failed",
      message:
        error instanceof Error
          ? error.message.slice(0, 500)
          : "Unknown email delivery failure",
      targetType: "order",
      targetId: orderId,
    }).catch(() => undefined);
    return { ok: false as const, reason: "delivery_failed" as const };
  }
}
