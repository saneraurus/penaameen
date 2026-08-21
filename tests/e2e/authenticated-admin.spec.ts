import { expect, test } from "@playwright/test";

test.describe("authenticated Admin staging journeys", () => {
  test.skip(
    !process.env.PLAYWRIGHT_AUTH_STATE,
    "Requires staging Clerk storage state from secret-managed setup",
  );

  test("can open protected Admin operations surfaces", async ({ page }) => {
    for (const route of [
      "/admin",
      "/admin/customers",
      "/admin/payments",
      "/admin/fulfillment",
      "/admin/analytics",
    ]) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBeLessThan(400);
      await expect(page.locator("#main-content")).toBeVisible();
    }
  });
});
