import { describe, expect, it } from "vitest";

describe("operational analytics aggregate contract", () => {
  it("distinguishes authoritative operational totals from unknown marketing KPIs", () => {
    const response = {
      operational: { commerce: { paidOrderCount: 2, paidOrderTotal: 100000 } },
      kpis: { conversion: { state: "unknown" } },
    };
    expect(response.operational.commerce.paidOrderCount).toBe(2);
    expect(response.kpis.conversion.state).toBe("unknown");
  });
});
