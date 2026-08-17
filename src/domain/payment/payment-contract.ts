import type { CorrelationId, ResourceId } from "@/domain/common/identifiers";

export type CurrencyCode = string;

export type MonetaryAmount = {
  readonly amountMinor: bigint;
  readonly currency: CurrencyCode;
};

export type PaymentStatus =
  | "initiated"
  | "pending"
  | "authorized"
  | "paid"
  | "failed"
  | "expired"
  | "cancelled"
  | "refunded"
  | "partially_refunded"
  | "requires_review";

export type PaymentIntent = {
  readonly orderId: ResourceId;
  readonly paymentAttemptId: ResourceId;
  readonly idempotencyKey: string;
  readonly amount: MonetaryAmount;
  readonly correlationId: CorrelationId;
};

export type PaymentEvent = {
  readonly eventId: string;
  readonly paymentAttemptId: ResourceId;
  readonly status: PaymentStatus;
  readonly correlationId: CorrelationId;
  readonly receivedAt: Date;
};
