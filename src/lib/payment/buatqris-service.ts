import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";
import {
  BuatQrisClient,
  BuatQrisError,
  type BuatQrisConfig,
  type BuatQrisPaymentStatus,
  type BuatQrisQrisData,
} from "@/lib/payment/buatqris";
import type { ApiSettings } from "@/lib/admin/api-settings";
import { isSystemControlEnabled } from "@/lib/admin/system-controls";
import { createNotification } from "@/lib/admin/notifications";
import { auditStore } from "@/infrastructure/audit";
import { recordSystemAudit } from "@/application/audit/audit-store";
import { createResourceId } from "@/domain/common/identifiers";
import { sendOrderConfirmationEmail } from "@/lib/payment/order-email";

export type BuatQrisPaymentOutcome =
  | "paid"
  | "pending"
  | "cancelled"
  | "unchanged"
  | "order_not_found"
  | "amount_mismatch";

export type BuatQrisEventSource = "webhook" | "status_poll";

/** Builds the client config from admin settings; null when BuatQRIS is disabled. */
export function buildBuatQrisConfig(
  settings: ApiSettings,
): BuatQrisConfig | null {
  const buatqris = settings.buatqris;
  if (!buatqris.enabled || !buatqris.accountId || !buatqris.secretToken)
    return null;
  return {
    accountId: buatqris.accountId,
    secretToken: buatqris.secretToken,
    baseUrl: buatqris.apiBaseUrl,
    expiryMinutes: buatqris.expiryMinutes,
  };
}

export type GeneratedBuatQrisResult =
  | {
      ok: true;
      data: BuatQrisQrisData;
      expiresAt: Date;
    }
  | { ok: false; error: string; detail?: string };

/**
 * Generates a dynamic QRIS for an order via BuatQRIS and persists the transaction
 * reference. Idempotent: existing unexpired transaction is reused.
 */
export async function generateBuatQrisForOrder(
  orderId: string,
  amount: number,
  settings: ApiSettings,
): Promise<GeneratedBuatQrisResult> {
  const config = buildBuatQrisConfig(settings);
  if (!config) return { ok: false, error: "not_configured" };

  let existing: {
    orderNumber: string;
    casakuTransactionId: string | null;
    casakuExpiresAt: Date | null;
    casakuQrString: string | null;
    casakuTotalAmount: bigint | null;
  } | null = null;

  try {
    existing = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        orderNumber: true,
        casakuTransactionId: true,
        casakuExpiresAt: true,
        casakuQrString: true,
        casakuTotalAmount: true,
      },
    });
  } catch (dbErr) {
    return {
      ok: false,
      error: "db_read_failed",
      detail:
        dbErr instanceof Error
          ? dbErr.message
          : "Gagal membaca data pesanan dari database",
    };
  }

  if (existing?.casakuTransactionId) {
    if (existing.casakuExpiresAt && existing.casakuExpiresAt > new Date()) {
      return {
        ok: false,
        error: "already_exists",
      };
    }
  }

  const client = new BuatQrisClient(config);
  let data: BuatQrisQrisData;
  try {
    data = await client.createQris({
      amount,
      description: `Order ${existing?.orderNumber ?? orderId}`,
      callbackUrl: settings.buatqris.webhookUrl,
    });
  } catch (err) {
    if (err instanceof BuatQrisError) {
      return { ok: false, error: "buatqris_api", detail: err.message };
    }
    return {
      ok: false,
      error: "buatqris_unknown",
      detail: err instanceof Error ? err.message : "Unknown BuatQRIS error",
    };
  }

  const expiresAt = data.expiredAt
    ? new Date(data.expiredAt)
    : new Date(Date.now() + (config.expiryMinutes || 15) * 60_000);

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        casakuTransactionId: data.transactionId,
        casakuTotalAmount: BigInt(data.totalAmount),
        casakuQrString: data.qrUrl || data.qrisImage || null,
        casakuExpiresAt: expiresAt,
      },
    });
  } catch (dbErr) {
    return {
      ok: false,
      error: "db_persist_failed",
      detail:
        dbErr instanceof Error
          ? dbErr.message
          : "Gagal menyimpan referensi pembayaran ke database",
    };
  }

  return { ok: true, data, expiresAt };
}

/**
 * Applies a BuatQRIS payment event to the matching order. Idempotent: a paid
 * event arriving more than once never re-triggers stock/notification side
 * effects.
 */
export async function applyBuatQrisEvent(
  event: {
    transactionId: string;
    amount?: number | undefined;
    totalAmount?: number | undefined;
    status: BuatQrisPaymentStatus;
  },
  source: BuatQrisEventSource,
  client: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<BuatQrisPaymentOutcome> {
  const order = await client.order.findUnique({
    where: { casakuTransactionId: event.transactionId },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    await recordSystemAudit(auditStore, {
      action: "payment.webhook",
      targetType: "order",
      targetId: createResourceId("unknown-buatqris-trx"),
      outcome: "failed",
      after: {
        provider: "buatqris",
        transactionId: event.transactionId,
        source,
      },
    });
    return "order_not_found";
  }

  if (event.status === "pending") return "pending";

  const isPaid = event.status === "paid" || event.status === "success";
  const isCancel =
    event.status === "cancel" ||
    event.status === "expired" ||
    event.status === "failed";

  if (!isPaid && !isCancel) return "unchanged";

  if (isPaid && (event.totalAmount || event.amount)) {
    const expectedAmount = order.casakuTotalAmount ?? order.total;
    const receivedAmount = event.totalAmount || event.amount || 0;
    // Allow slight variance only if unique code was added by gateway
    if (
      receivedAmount > 0 &&
      Number(expectedAmount) > 0 &&
      Math.abs(Number(expectedAmount) - receivedAmount) > 500
    ) {
      await recordSystemAudit(auditStore, {
        action: "payment.webhook",
        targetType: "order",
        targetId: createResourceId(order.id),
        outcome: "failed",
        after: {
          provider: "buatqris",
          transactionId: event.transactionId,
          expectedAmount: Number(expectedAmount),
          receivedAmount,
          source,
        },
      });
      await createNotification({
        type: "webhook.failed",
        severity: "critical",
        title: `Nominal pembayaran BuatQRIS tidak cocok (${order.orderNumber})`,
        message: `Diharapkan Rp${Number(expectedAmount).toLocaleString("id-ID")}, diterima Rp${receivedAmount.toLocaleString("id-ID")}. Perlu verifikasi manual.`,
        targetType: "order",
        targetId: order.id,
      });
      return "amount_mismatch";
    }
  }

  if (order.status === "PAID") return "unchanged";

  const finalStatus = isPaid ? "PAID" : "CANCELLED";
  const note = isPaid
    ? "Pembayaran diterima via QRIS (BuatQRIS)"
    : event.status === "expired"
      ? "QRIS BuatQRIS kedaluwarsa"
      : "Pembayaran BuatQRIS dibatalkan/gagal";

  const persist = async (tx: Prisma.TransactionClient) => {
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: finalStatus,
        paidAt: finalStatus === "PAID" ? new Date() : null,
        cancelReason: finalStatus === "CANCELLED" ? note : null,
        cancelledAt: finalStatus === "CANCELLED" ? new Date() : null,
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
    } else if (finalStatus === "CANCELLED") {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity },
          },
        });
      }
    }
  };

  if ("$transaction" in client) {
    await client.$transaction(persist);
  } else {
    await persist(client);
  }

  if (finalStatus === "PAID") {
    await createNotification({
      type: "order.paid",
      severity: "info",
      title: `Pesanan ${order.orderNumber} dibayar`,
      message: `Pembayaran QRIS BuatQRIS diterima dan stok telah dikurangi otomatis.`,
      targetType: "order",
      targetId: order.id,
    });

    if (!(await isSystemControlEnabled("disable_outbound_email"))) {
      await sendOrderConfirmationEmail(order.id);
    }
  } else if (finalStatus === "CANCELLED") {
    await createNotification({
      type: "order.cancelled",
      severity: "info",
      title: `Pesanan ${order.orderNumber} dibatalkan/kedaluwarsa`,
      message: `Pembayaran QRIS ${event.status === "expired" ? "kedaluwarsa" : "dibatalkan"}; stok dikembalikan.`,
      targetType: "order",
      targetId: order.id,
    });
  }

  await recordSystemAudit(auditStore, {
    action: "payment.webhook",
    targetType: "order",
    targetId: createResourceId(order.id),
    outcome: "succeeded",
    after: {
      provider: "buatqris",
      transactionId: event.transactionId,
      newStatus: finalStatus,
      source,
    },
  });

  return isPaid ? "paid" : "cancelled";
}
