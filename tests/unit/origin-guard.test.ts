import { describe, expect, it, vi, afterEach } from "vitest";

import { validateRequestOrigin } from "@/application/security/origin-guard";

describe("request origin guard", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows non-browser server requests without an origin header", () => {
    vi.stubEnv("APP_ENV", "development");
    expect(validateRequestOrigin(new Request("http://localhost/api"))).toEqual({
      ok: true,
    });
  });

  it("allows the configured application origin", () => {
    vi.stubEnv("APP_ENV", "development");
    vi.stubEnv("APP_BASE_URL", "http://localhost:3000");
    expect(
      validateRequestOrigin(
        new Request("http://localhost/api", {
          headers: { origin: "http://localhost:3000" },
        }),
      ),
    ).toEqual({ ok: true });
  });

  it("rejects an untrusted browser origin", () => {
    vi.stubEnv("APP_ENV", "development");
    vi.stubEnv("APP_BASE_URL", "http://localhost:3000");
    expect(
      validateRequestOrigin(
        new Request("http://localhost/api", {
          headers: { origin: "https://attacker.example" },
        }),
      ),
    ).toEqual({ ok: false, reason: "Request origin is not trusted" });
  });
});
