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

/**
 * Sends a shipping notification email to the customer when the order
 * is marked as shipped by the admin. Includes tracking number if available.
 */
export async function sendOrderShippedEmail(orderId: string) {
  try {
    if (
      !process.env.RESEND_API_KEY ||
      /REDACTED|\.\.\./i.test(process.env.RESEND_API_KEY)
    ) {
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
      city?: string;
      province?: string;
    };

    const itemsList = order.items
      .map(
        (item) =>
          `<li style="padding: 4px 0;">${item.product?.name ?? "Produk"} x${item.quantity}</li>`,
      )
      .join("");

    const trackingSection = order.trackingNumber
      ? `
        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
          <p style="margin: 0 0 8px; font-size: 14px; color: #065f46;"><strong>Nomor Resi / Tracking</strong></p>
          <p style="margin: 0; font-size: 20px; font-weight: bold; color: #064e3b; letter-spacing: 1px; font-family: monospace;">${order.trackingNumber}</p>
          ${order.shippingMethod ? `<p style="margin: 8px 0 0; font-size: 13px; color: #047857;">Kurir: ${order.shippingMethod}</p>` : ""}
        </div>`
      : `
        <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">Nomor resi sedang diproses. Kami akan menginformasikan segera setelah tersedia.</p>
        </div>`;

    const html = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
          <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
            <h1 style="color: #12351d;">🚚 Pesanan Anda Sedang Dikirim!</h1>
            <p>Halo ${order.user.name ?? shippingAddress.recipientName ?? "Pelanggan"},</p>
            <p>Kabar baik! Pesanan <strong>${order.orderNumber}</strong> sudah dikirim dan sedang dalam perjalanan ke alamat Anda.</p>

            ${trackingSection}

            <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0 0 8px;"><strong>Tujuan Pengiriman:</strong></p>
              <p style="margin: 0;">${shippingAddress.recipientName ?? ""}, ${shippingAddress.city ?? ""}, ${shippingAddress.province ?? ""}</p>
            </div>

            <div style="margin: 24px 0;">
              <p style="margin: 0 0 8px;"><strong>Produk yang dikirim:</strong></p>
              <ul style="margin: 0; padding-left: 20px;">${itemsList}</ul>
            </div>

            <p style="margin-top: 32px; color: #6b7280; font-size: 14px;">
              Jika ada pertanyaan tentang pengiriman, hubungi kami di <a href="mailto:no-reply@penaameen.com">no-reply@penaameen.com</a>
            </p>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "Pena Ameen <no-reply@penaameen.com>",
      to: order.user.email,
      subject: `🚚 Pesanan ${order.orderNumber} Sedang Dikirim - PENA AMEEN`,
      html,
    });
    return { ok: true as const };
  } catch (error) {
    console.error("Error sending shipping email:", error);
    await createNotification({
      type: "email_delivery_failed",
      severity: "warning",
      title: "Shipping notification email failed",
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
