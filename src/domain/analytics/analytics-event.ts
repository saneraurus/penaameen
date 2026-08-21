import type { CorrelationId } from "@/domain/common/identifiers";

export const ANALYTICS_EVENT_NAMES = [
  "page_view",
  "product_view",
  "search",
  "add_to_cart",
  "cart_view",
  "checkout_started",
  "checkout_validation_error",
  "shipping_quote_requested",
  "shipping_option_selected",
  "payment_started",
  "payment_pending",
  "payment_success",
  "payment_failure",
  "purchase",
  "order_shipped",
  "tracking_viewed",
  "content_engagement",
  "redirect_resolved",
  "not_found_viewed",
  "notification_outcome",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

export type AnalyticsEvent = {
  readonly id: string;
  readonly version: 1;
  readonly name: AnalyticsEventName;
  readonly occurredAt: string;
  readonly correlationId: CorrelationId;
  readonly consent: "unknown" | "not_granted" | "granted";
  readonly context: Readonly<Record<string, string | number | boolean>>;
};

export function createAnalyticsEvent(input: {
  name: AnalyticsEventName;
  correlationId: CorrelationId;
  consent?: AnalyticsEvent["consent"];
  context?: AnalyticsEvent["context"];
}): AnalyticsEvent {
  return {
    id: `evt_${crypto.randomUUID()}`,
    version: 1,
    name: input.name,
    occurredAt: new Date().toISOString(),
    correlationId: input.correlationId,
    consent: input.consent ?? "unknown",
    context: input.context ?? {},
  };
}
