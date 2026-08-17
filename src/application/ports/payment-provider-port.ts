import type { Result } from "@/domain/common/result";
import type {
  MonetaryAmount,
  PaymentEvent,
  PaymentIntent,
  PaymentStatus,
} from "@/domain/payment/payment-contract";

export type PaymentProviderError = {
  readonly category:
    "temporary" | "permanent" | "invalid_event" | "review_required";
  readonly message: string;
};

export type PaymentInitiation = {
  readonly providerReference: string;
  readonly status: Extract<
    PaymentStatus,
    "initiated" | "pending" | "requires_review"
  >;
};

export type RefundIntent = {
  readonly paymentReference: string;
  readonly idempotencyKey: string;
  readonly amount: MonetaryAmount;
};

export interface PaymentProviderPort {
  initiate(
    intent: PaymentIntent,
  ): Promise<Result<PaymentInitiation, PaymentProviderError>>;
  verifyEvent(
    payload: unknown,
  ): Promise<Result<PaymentEvent, PaymentProviderError>>;
  requestRefund(
    intent: RefundIntent,
  ): Promise<
    Result<{ readonly providerReference: string }, PaymentProviderError>
  >;
}
