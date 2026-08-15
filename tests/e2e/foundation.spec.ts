import { expect, test } from "@playwright/test";

test("renders the accessible foundation home route", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Pena Ameen" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Shop foundation" }),
  ).toBeVisible();
});
