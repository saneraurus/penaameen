import { describe, expect, it } from "vitest";

import {
  getEnvironmentReadiness,
  loadServerConfig,
} from "@/application/config/config";

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

  it("blocks production readiness when core configuration is missing", () => {
    const readiness = getEnvironmentReadiness({ APP_ENV: "production" });

    expect(readiness.state).toBe("blocked");
    expect(readiness.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "app.base_url", state: "blocked" }),
        expect.objectContaining({ id: "database.url", state: "blocked" }),
        expect.objectContaining({ id: "auth.clerk", state: "blocked" }),
      ]),
    );
  });

  it("never includes configuration values in readiness output", () => {
    const readiness = getEnvironmentReadiness({
      APP_ENV: "production",
      APP_BASE_URL: "https://store.example",
      SUPABASE_DB_URL: "postgresql://secret",
      CLERK_PUBLISHABLE_KEY: "pk_test_secret",
      CLERK_SECRET_KEY: "sk_test_secret",
    });

    expect(JSON.stringify(readiness)).not.toContain("postgresql://secret");
    expect(JSON.stringify(readiness)).not.toContain("sk_test_secret");
  });
});
