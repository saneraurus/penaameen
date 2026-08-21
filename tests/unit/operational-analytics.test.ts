import { describe, expect, it } from "vitest";

describe("operational analytics boundary", () => {
  it("does not treat unknown business KPIs as zero", () => {
    const kpi = { state: "unknown", value: null };
    expect(kpi.state).toBe("unknown");
    expect(kpi.value).toBeNull();
  });
});
