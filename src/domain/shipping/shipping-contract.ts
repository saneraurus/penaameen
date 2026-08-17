import type { CorrelationId, ResourceId } from "@/domain/common/identifiers";
import type { MonetaryAmount } from "@/domain/payment/payment-contract";

export type ShippingStatus =
  | "quoted"
  | "created"
  | "awb_assigned"
  | "label_ready"
  | "dispatched"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "exception"
  | "returned";

export type ShippingDestination = {
  readonly destinationReference: ResourceId;
};

export type PackageDescriptor = {
  readonly packageReference: ResourceId;
};

export type ShippingRateQuoteRequest = {
  readonly orderId: ResourceId;
  readonly destination: ShippingDestination;
  readonly package: PackageDescriptor;
  readonly correlationId: CorrelationId;
};

export type ShippingRateOption = {
  readonly optionReference: string;
  readonly amount: MonetaryAmount;
  readonly expiresAt?: Date;
};

export type ShipmentIntent = {
  readonly shipmentId: ResourceId;
  readonly orderId: ResourceId;
  readonly selectedRateReference: string;
  readonly idempotencyKey: string;
  readonly correlationId: CorrelationId;
};

export type TrackingEvent = {
  readonly eventId: string;
  readonly shipmentId: ResourceId;
  readonly status: ShippingStatus;
  readonly occurredAt: Date;
  readonly correlationId: CorrelationId;
};
