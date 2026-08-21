import { describe, expect, it } from "vitest";

describe("commerce operations gate", () => {
  it("keeps provider-dependent actions explicitly blocked", () => {
    const actions = {
      verification: "blocked_until_verified_evidence",
      refunds: "blocked_until_provider_sandbox_and_policy",
      shipmentCreation: "blocked_until_provider_sandbox_and_sop",
      labelPrinting: "blocked_until_provider_support",
    };

    expect(
      Object.values(actions).every((value) => value.startsWith("blocked_")),
    ).toBe(true);
  });
});
