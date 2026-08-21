import { expect, test } from "@playwright/test";

test.describe("commerce boundary behavior", () => {
  test("does not create authoritative orders from local history sync", async ({
    request,
  }) => {
    const response = await request.post("/api/orders/sync", {
      data: {
        orders: [
          {
            orderNumber: "PA-E2E-FABRICATED",
            status: "PAID",
            total: 1,
          },
        ],
      },
    });

    expect(response.status()).toBe(410);
    expect((await response.json()).error).toMatch(/bukan sumber order resmi/i);
  });

  test("fails closed when shipping weight cannot be resolved", async ({
    request,
  }) => {
    const response = await request.post("/api/shipping/rates", {
      data: {
        destination: { city: "Surabaya", province: "Jawa Timur" },
        items: [],
      },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).error).toMatch(/Berat pesanan/i);
  });
});
