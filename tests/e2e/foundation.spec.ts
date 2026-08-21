import { expect, test } from "@playwright/test";

test.describe("public foundation journeys", () => {
  test("renders the public home and product navigation", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Pena Ameen/i);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator('a[href="/produk"]').first()).toBeVisible();

    await page.goto("/produk");
    await expect(
      page.getByRole("heading", { name: /Katalog Produk/i }),
    ).toBeVisible();
    await expect(page.locator('a[href="/keranjang"]').first()).toBeVisible();
  });

  test("keeps public utility routes reachable", async ({ page }) => {
    for (const route of ["/keranjang", "/galeri-kegiatan", "/kontak"]) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBeLessThan(400);
      await expect(page.locator("#main-content")).toBeVisible();
    }
  });
});
