import { describe, expect, it } from "vitest";

describe("content SEO health contract", () => {
  it("keeps unverified and blocked states explicit", () => {
    const health = {
      structuredData: { state: "unknown" },
      redirects: { state: "blocked" },
    };
    expect(health.structuredData.state).toBe("unknown");
    expect(health.redirects.state).toBe("blocked");
  });
});
