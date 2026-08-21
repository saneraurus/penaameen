import { describe, expect, it } from "vitest";
import { createAnalyticsEvent } from "@/domain/analytics/analytics-event";

describe("privacy-safe analytics event", () => {
  it("creates versioned events with unknown consent by default", () => {
    const event = createAnalyticsEvent({
      name: "page_view",
      correlationId: "correlation_test_123" as never,
      context: { routeType: "public" },
    });
    expect(event.version).toBe(1);
    expect(event.consent).toBe("unknown");
    expect(event.context).toEqual({ routeType: "public" });
  });
});
