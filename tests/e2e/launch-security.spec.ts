import { expect, test } from "@playwright/test";

test("public response includes security headers", async ({ request }) => {
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["x-frame-options"]).toBe("DENY");
  expect(response.headers()["content-security-policy"]).toContain(
    "default-src 'self'",
  );
});

test("private and mutable route responses are not cacheable", async ({
  request,
}) => {
  const response = await request.get("/api/v1/health");
  expect(response.headers()["cache-control"]).toContain("no-store");
});
