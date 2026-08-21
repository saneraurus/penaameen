import { expect, test } from "@playwright/test";

test.describe("runtime security boundaries", () => {
  test("health reports safe readiness data without secrets", async ({
    request,
  }) => {
    const response = await request.get("/api/v1/health");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.data.status).toBe("ok");
    expect(body.data.readiness.state).toMatch(/ready|unknown|blocked/);
    expect(body.data.readiness.checks.length).toBeGreaterThan(0);
    expect(JSON.stringify(body)).not.toMatch(
      /sk_|gsk_|cashify_|postgresql:\/\//i,
    );
  });

  test("rejects untrusted origins before Admin authentication", async ({
    request,
  }) => {
    const response = await request.patch("/api/admin/system-controls", {
      headers: {
        Origin: "https://attacker.example",
        "Content-Type": "application/json",
      },
      data: {},
    });

    expect(response.status()).toBe(403);
    expect(await response.json()).toEqual({
      error: "Request origin is not trusted",
    });
  });

  test("protects Admin mutations from signed-out users on trusted origin", async ({
    request,
  }) => {
    const response = await request.patch("/api/admin/system-controls", {
      headers: {
        Origin: "http://127.0.0.1:3000",
        "Content-Type": "application/json",
      },
      data: {},
    });

    expect([307, 401, 403]).toContain(response.status());
  });
});
