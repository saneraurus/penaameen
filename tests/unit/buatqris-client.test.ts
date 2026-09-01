import { afterEach, describe, expect, it, vi } from "vitest";

import {
  BuatQrisClient,
  BuatQrisError,
  BUATQRIS_DEFAULT_BASE_URL,
} from "@/lib/payment/buatqris";

const CONFIG = {
  accountId: "user_test_account_id",
  secretToken: "mock_test_secret_token_buatqris_12345",
  apiBaseUrl: BUATQRIS_DEFAULT_BASE_URL,
};

function stubFetch(response: { ok?: boolean; status?: number; body: unknown }) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(response.body), {
      status: response.status ?? 200,
      headers: { "Content-Type": "application/json" },
    }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("BuatQrisClient.createQris", () => {
  it("sends api_create_qris action with credentials and amount", async () => {
    const fetchMock = stubFetch({
      body: {
        success: true,
        data: {
          transaction_id: "BQ-TRX-101",
          amount: 150000,
          total_amount: 150042,
          amount_uniq: 42,
          admin_fee: 0,
          qris_image: "https://api.buatqris.site/qr/101.png",
          qr_url: "https://api.buatqris.site/qr/101.png",
          payment_url: "https://buatqris.site/pay/101",
          expired_at: "2026-09-02 12:00:00",
          status: "pending",
        },
      },
    });

    const client = new BuatQrisClient(CONFIG);
    const result = await client.createQris({
      amount: 150000,
      description: "Order ORD-101",
    });

    expect(result.transactionId).toBe("BQ-TRX-101");
    expect(result.amount).toBe(150000);
    expect(result.totalAmount).toBe(150042);
    expect(result.amountUniq).toBe(42);
    expect(result.qrUrl).toBe("https://api.buatqris.site/qr/101.png");

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(BUATQRIS_DEFAULT_BASE_URL);
    expect(init.method).toBe("POST");

    const sent = JSON.parse(String(init.body));
    expect(sent).toMatchObject({
      action: "api_create_qris",
      account_id: CONFIG.accountId,
      secret_token: CONFIG.secretToken,
      amount: 150000,
      description: "Order ORD-101",
    });
  });

  it("throws BuatQrisError on API failure", async () => {
    stubFetch({
      ok: false,
      status: 400,
      body: {
        success: false,
        message: "Invalid account credentials",
      },
    });

    const client = new BuatQrisClient(CONFIG);
    const error = await client.createQris({ amount: 50000 }).catch((e) => e);

    expect(error).toBeInstanceOf(BuatQrisError);
    expect((error as BuatQrisError).status).toBe(400);
    expect((error as BuatQrisError).message).toContain("Invalid account");
  });

  it("throws BuatQrisError on network failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network connection error")),
    );

    const client = new BuatQrisClient(CONFIG);
    const error = await client.createQris({ amount: 50000 }).catch((e) => e);

    expect(error).toBeInstanceOf(BuatQrisError);
    expect((error as BuatQrisError).message).toContain("Network");
  });
});

describe("BuatQrisClient.checkStatus", () => {
  it("sends api_check_status action and returns status data", async () => {
    const fetchMock = stubFetch({
      body: {
        success: true,
        data: {
          transaction_id: "BQ-TRX-101",
          amount: 150000,
          total_amount: 150042,
          status: "paid",
          paid_at: "2026-09-02 11:30:00",
        },
      },
    });

    const client = new BuatQrisClient(CONFIG);
    const result = await client.checkStatus("BQ-TRX-101");

    expect(result.transactionId).toBe("BQ-TRX-101");
    expect(result.status).toBe("paid");
    expect(result.amount).toBe(150000);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(BUATQRIS_DEFAULT_BASE_URL);
    expect(init.method).toBe("POST");

    const sent = JSON.parse(String(init.body));
    expect(sent).toMatchObject({
      action: "api_check_status",
      account_id: CONFIG.accountId,
      secret_token: CONFIG.secretToken,
      transaction_id: "BQ-TRX-101",
    });
  });
});
