import type { OrderStatus } from "@/generated/prisma";

/**
 * Maps a Midtrans transaction status (+ fraud status) to our internal order status.
 * Returns `null` when the status should not change the order.
 *
 * Reference: https://docs.midtrans.com/reference/e-commerce-status-codes
 */
export function mapMidtransStatus(
  transactionStatus: string,
  fraudStatus?: string | null,
): OrderStatus | null {
  switch (transactionStatus) {
    case "capture":
      if (fraudStatus === "challenge") return "PENDING_PAYMENT";
      if (fraudStatus === "accept") return "PAID";
      return null;
    case "settlement":
      return "PAID";
    case "pending":
      return "PENDING_PAYMENT";
    case "deny":
    case "cancel":
    case "expire":
      return "CANCELLED";
    case "refund":
    case "partial_refund":
      return "REFUNDED";
    default:
      return null;
  }
}

export type PaymentOutcome = "paid" | "pending" | "cancelled" | "refunded" | "unchanged";

export function classifyMidtransOutcome(
  transactionStatus: string,
  fraudStatus?: string | null,
): PaymentOutcome {
  const next = mapMidtransStatus(transactionStatus, fraudStatus);
  switch (next) {
    case "PAID":
      return "paid";
    case "PENDING_PAYMENT":
      return "pending";
    case "CANCELLED":
      return "cancelled";
    case "REFUNDED":
      return "refunded";
    default:
      return "unchanged";
  }
}
