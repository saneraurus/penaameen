import { describe, expect, it } from "vitest";

import { loadServerConfig } from "@/application/config/config";
import { getFoundationHealth } from "@/application/services/get-foundation-health";

describe("foundation health service", () => {
  it("reports safe foundation status from validated configuration", () => {
    const configResult = loadServerConfig({ APP_ENV: "test" });

    expect(configResult.ok).toBe(true);

    if (configResult.ok) {
      expect(getFoundationHealth(configResult.value)).toMatchObject({
        status: "ok",
        foundationMode: true,
        environment: "test",
      });
      expect(getFoundationHealth(configResult.value).readiness).toMatchObject({
        environment: "test",
        state: "unknown",
      });
    }
  });
});
