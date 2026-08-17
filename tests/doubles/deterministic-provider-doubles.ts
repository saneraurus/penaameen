import type {
  PaymentProviderError,
  PaymentProviderPort,
} from "@/application/ports/payment-provider-port";
import type {
  ShippingProviderError,
  ShippingProviderPort,
} from "@/application/ports/shipping-provider-port";
import { succeed, type Result } from "@/domain/common/result";
import type {
  PaymentEvent,
  PaymentIntent,
} from "@/domain/payment/payment-contract";
import type {
  ShipmentIntent,
  ShippingRateOption,
  TrackingEvent,
} from "@/domain/shipping/shipping-contract";

/** TEST ONLY: deterministic contract double, never a production provider adapter. */
export class DeterministicPaymentProviderDouble implements PaymentProviderPort {
  async initiate(
    intent: PaymentIntent,
  ): Promise<
    Result<
      { readonly providerReference: string; readonly status: "initiated" },
      PaymentProviderError
    >
  > {
    return succeed({
      providerReference: `test-payment-${intent.paymentAttemptId}`,
      status: "initiated",
    });
  }

  async verifyEvent(
    payload: unknown,
  ): Promise<Result<PaymentEvent, PaymentProviderError>> {
    return succeed(payload as PaymentEvent);
  }

  async requestRefund(): Promise<
    Result<{ readonly providerReference: string }, PaymentProviderError>
  > {
    return succeed({ providerReference: "test-refund" });
  }
}

/** TEST ONLY: deterministic contract double, never a production provider adapter. */
export class DeterministicShippingProviderDouble implements ShippingProviderPort {
  async quote(): Promise<
    Result<readonly ShippingRateOption[], ShippingProviderError>
  > {
    return succeed([]);
  }

  async createShipment(
    intent: ShipmentIntent,
  ): Promise<
    Result<{ readonly providerReference: string }, ShippingProviderError>
  > {
    return succeed({ providerReference: `test-shipment-${intent.shipmentId}` });
  }

  async verifyTrackingEvent(
    payload: unknown,
  ): Promise<Result<TrackingEvent, ShippingProviderError>> {
    return succeed(payload as TrackingEvent);
  }
}
