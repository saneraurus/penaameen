import { describe, expect, it } from "vitest";

import { createCorrelationId } from "@/domain/common/identifiers";
import { createRequestCorrelationId } from "@/infrastructure/observability/correlation-id";

describe("correlation identifier safety", () => {
  it("rejects unsafe correlation identifiers", () => {
    expect(() => createCorrelationId("unsafe\nvalue")).toThrow();
  });

  it("replaces an unsafe incoming request identifier", () => {
    const correlationId = createRequestCorrelationId("unsafe\nvalue");

    expect(correlationId).toMatch(/^[A-Za-z0-9._-]{1,128}$/);
    expect(correlationId).not.toBe("unsafe\nvalue");
  });
});
