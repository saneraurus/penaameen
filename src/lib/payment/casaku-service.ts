import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";
import {
  CasakuClient,
  CasakuError,
  type CasakuConfig,
  type CasakuPaymentStatus,
  type CasakuQrisData,
} from "@/lib/payment/casaku";
import type { ApiSettings } from "@/lib/admin/api-settings";
import { isSystemControlEnabled } from "@/lib/admin/system-controls";
import { createNotification } from "@/lib/admin/notifications";
import { auditStore } from "@/infrastructure/audit";
import { recordSystemAudit } from "@/application/audit/audit-store";
import { createResourceId } from "@/domain/common/identifiers";
import { sendOrderConfirmationEmail } from "@/lib/payment/order-email";

export type CasakuPaymentOutcome =
  | "paid"
  | "pending"
  | "cancelled"
  | "unchanged"
  | "order_not_found"
  | "amount_mismatch";

export type CasakuEventSource = "webhook" | "status_poll";

/** Builds the client config from admin settings; null when Casaku is disabled. */
export function buildCasakuConfig(settings: ApiSettings): CasakuConfig | null {
  const casaku = settings.casaku;
  if (!casaku.enabled || !casaku.licenseKey || !casaku.qrId) return null;
  return {
    licenseKey: casaku.licenseKey,
    qrId: casaku.qrId,
    baseUrl: casaku.apiBaseUrl,
    packageIds: casaku.packageIds,
    expiryMinutes: casaku.expiryMinutes,
    prefix: "PA",
  };
}

export type GeneratedQrisResult =
  | {
      ok: true;
      data: CasakuQrisData;
      expiresAt: Date;
    }
  | { ok: false; error: string; detail?: string };

/**
 * Generates a dynamic QRIS for an order and persists the transaction
 * reference. Idempotent: existing casakuTransactionId is reused.
 *
 * Casaku API failures and database persistence failures are kept distinct so
 * the caller can show an accurate message instead of a misleading
 * "Penyedia QRIS tidak tersedia" fallback.
 */
export async function generateQrisForOrder(
  orderId: string,
  amount: number,
  settings: ApiSettings,
): Promise<GeneratedQrisResult> {
  const config = buildCasakuConfig(settings);
  if (!config) return { ok: false, error: "not_configured" };

  let existing: {
    casakuTransactionId: string | null;
    casakuExpiresAt: Date | null;
  } | null = null;
  try {
    existing = await prisma.order.findUnique({
      where: { id: orderId },
      select: { casakuTransactionId: true, casakuExpiresAt: true },
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

  // Generate the QR from Casaku first — this is independent of our DB.
  const client = new CasakuClient(config);
  let data: CasakuQrisData;
  try {
    data = await client.generateQris({ amount });
  } catch (err) {
    if (err instanceof CasakuError) {
      return { ok: false, error: "casaku_api", detail: err.message };
    }
    return {
      ok: false,
      error: "casaku_unknown",
      detail: err instanceof Error ? err.message : "Unknown Casaku error",
    };
  }

  const expiresAt = new Date(
    Date.now() + (data.expiredInMinutes || config.expiryMinutes || 15) * 60_000,
  );

  // Persist the transaction reference. A failure here is a database problem,
  // NOT a Casaku/QRIS-provider problem.
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        casakuTransactionId: data.transactionId,
        casakuTotalAmount: BigInt(data.totalAmount),
        casakuQrString: data.qrString ?? null,
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
 * Applies a Casaku payment event to the matching order. Idempotent: a paid
 * event arriving more than once never re-triggers stock/notification side
 * effects. Amount is cross-checked against the QR total persisted at
 * generation time; mismatches are quarantined (audit + notification) without
 * transitioning the order.
 */
export async function applyCasakuEvent(
  event: {
    transactionId: string;
    amount: number;
    status: CasakuPaymentStatus;
  },
  source: CasakuEventSource,
  client: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<CasakuPaymentOutcome> {
  const order = await client.order.findUnique({
    where: { casakuTransactionId: event.transactionId },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    await recordSystemAudit(auditStore, {
      action: "payment.webhook",
      targetType: "order",
      targetId: createResourceId("unknown-casaku-trx"),
      outcome: "failed",
      after: { provider: "casaku", transactionId: event.transactionId, source },
    });
    return "order_not_found";
  }

  if (event.status === "pending") return "pending";

  const isPaid = event.status === "paid" || event.status === "success";
  const isCancel = event.status === "cancel" || event.status === "expired";
  if (!isPaid && !isCancel) return "unchanged";

  if (isPaid) {
    const expectedAmount = order.casakuTotalAmount ?? order.total;
    if (Number(expectedAmount) !== event.amount) {
      await recordSystemAudit(auditStore, {
        action: "payment.webhook",
        targetType: "order",
        targetId: createResourceId(order.id),
        outcome: "failed",
        after: {
          provider: "casaku",
          transactionId: event.transactionId,
          expectedAmount: Number(expectedAmount),
          receivedAmount: event.amount,
          source,
        },
      });
      await createNotification({
        type: "webhook.failed",
        severity: "critical",
        title: `Nominal pembayaran Casaku tidak cocok (${order.orderNumber})`,
        message: `Diharapkan Rp${Number(expectedAmount).toLocaleString("id-ID")}, diterima Rp${event.amount.toLocaleString("id-ID")}. Perlu verifikasi manual.`,
        targetType: "order",
        targetId: order.id,
      });
      return "amount_mismatch";
    }
  }

  if (order.status === "PAID") return "unchanged";

  const finalStatus = isPaid ? "PAID" : "CANCELLED";
  const note = isPaid
    ? "Pembayaran diterima via QRIS Casaku"
    : event.status === "expired"
      ? "QRIS Casaku kedaluwarsa"
      : "Pembayaran Casaku dibatalkan";

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
      // Mirror Midtrans behaviour: a cancelled/expired QRIS payment must
      // return the reserved stock to inventory. Without this, stock is
      // permanently lost whenever a Casaku QR expires or is cancelled.
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
      message: `Pembayaran QRIS Casaku diterima dan stok telah dikurangi otomatis.`,
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
      message: `Pembayaran QRIS Casaku ${event.status === "expired" ? "kedaluwarsa" : "dibatalkan"}; stok telah dikembalikan otomatis.`,
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
      provider: "casaku",
      transactionId: event.transactionId,
      amount: event.amount,
      newStatus: finalStatus,
      source,
    },
  });

  return isPaid ? "paid" : "cancelled";
}
