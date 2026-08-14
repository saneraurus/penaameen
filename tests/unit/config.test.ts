import { describe, expect, it } from "vitest";

import { loadServerConfig } from "@/application/config/config";

describe("loadServerConfig", () => {
  it("uses safe local defaults for development", () => {
    const result = loadServerConfig({ APP_ENV: "development" });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.appBaseUrl.toString()).toBe("http://localhost:3000/");
      expect(result.value.foundationMode).toBe(true);
    }
  });

  it("requires an explicit base URL for production", () => {
    const result = loadServerConfig({ APP_ENV: "production" });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "CONFIGURATION_ERROR",
      },
    });
  });

  it("rejects unsupported environment names", () => {
    const result = loadServerConfig({ APP_ENV: "production-like" });

    expect(result).toMatchObject({ ok: false });
  });
});
