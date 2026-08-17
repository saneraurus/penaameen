import { describe, expect, it } from "vitest";

import { classifyMidtransOutcome, mapMidtransStatus } from "@/lib/order-status";

describe("mapMidtransStatus", () => {
  it("maps capture + accept to PAID", () => {
    expect(mapMidtransStatus("capture", "accept")).toBe("PAID");
  });

  it("maps capture + challenge to PENDING_PAYMENT", () => {
    expect(mapMidtransStatus("capture", "challenge")).toBe("PENDING_PAYMENT");
  });

  it("maps settlement to PAID", () => {
    expect(mapMidtransStatus("settlement")).toBe("PAID");
  });

  it("maps pending to PENDING_PAYMENT", () => {
    expect(mapMidtransStatus("pending")).toBe("PENDING_PAYMENT");
  });

  it("maps deny, cancel and expire to CANCELLED", () => {
    expect(mapMidtransStatus("deny")).toBe("CANCELLED");
    expect(mapMidtransStatus("cancel")).toBe("CANCELLED");
    expect(mapMidtransStatus("expire")).toBe("CANCELLED");
  });

  it("maps refund and partial_refund to REFUNDED", () => {
    expect(mapMidtransStatus("refund")).toBe("REFUNDED");
    expect(mapMidtransStatus("partial_refund")).toBe("REFUNDED");
  });

  it("returns null for unknown or non-actionable statuses", () => {
    expect(mapMidtransStatus("capture", "something-else")).toBeNull();
    expect(mapMidtransStatus("unrecognized")).toBeNull();
    expect(mapMidtransStatus("")).toBeNull();
  });
});

describe("classifyMidtransOutcome", () => {
  it("classifies paid outcomes", () => {
    expect(classifyMidtransOutcome("capture", "accept")).toBe("paid");
    expect(classifyMidtransOutcome("settlement")).toBe("paid");
  });

  it("classifies pending outcomes", () => {
    expect(classifyMidtransOutcome("capture", "challenge")).toBe("pending");
    expect(classifyMidtransOutcome("pending")).toBe("pending");
  });

  it("classifies cancelled outcomes", () => {
    expect(classifyMidtransOutcome("deny")).toBe("cancelled");
    expect(classifyMidtransOutcome("cancel")).toBe("cancelled");
    expect(classifyMidtransOutcome("expire")).toBe("cancelled");
  });

  it("classifies refunded outcomes", () => {
    expect(classifyMidtransOutcome("refund")).toBe("refunded");
    expect(classifyMidtransOutcome("partial_refund")).toBe("refunded");
  });

  it("classifies non-actionable outcomes as unchanged", () => {
    expect(classifyMidtransOutcome("unrecognized")).toBe("unchanged");
    expect(classifyMidtransOutcome("capture", "weird")).toBe("unchanged");
  });
});
