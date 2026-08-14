import { describe, expect, it } from "vitest";

import { isSafeRelativeRedirect } from "@/application/security/safe-redirect";

describe("foundation safety regressions", () => {
  it("does not allow external redirect targets", () => {
    expect(isSafeRelativeRedirect("https://provider.example/callback")).toBe(
      false,
    );
    expect(isSafeRelativeRedirect("//provider.example/callback")).toBe(false);
  });

  it("allows a local approved-route-shaped path", () => {
    expect(isSafeRelativeRedirect("/shop")).toBe(true);
  });
});
