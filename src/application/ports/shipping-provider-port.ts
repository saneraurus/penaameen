import type { Result } from "@/domain/common/result";
import type {
  ShipmentIntent,
  ShippingRateOption,
  ShippingRateQuoteRequest,
  TrackingEvent,
} from "@/domain/shipping/shipping-contract";

export type ShippingProviderError = {
  readonly category:
    "temporary" | "permanent" | "invalid_event" | "manual_review_required";
  readonly message: string;
};

export type ShipmentCreation = {
  readonly providerReference: string;
  readonly trackingReference?: string;
  readonly labelReference?: string;
};

export interface ShippingProviderPort {
  quote(
    request: ShippingRateQuoteRequest,
  ): Promise<Result<readonly ShippingRateOption[], ShippingProviderError>>;
  createShipment(
    intent: ShipmentIntent,
  ): Promise<Result<ShipmentCreation, ShippingProviderError>>;
  verifyTrackingEvent(
    payload: unknown,
  ): Promise<Result<TrackingEvent, ShippingProviderError>>;
}
