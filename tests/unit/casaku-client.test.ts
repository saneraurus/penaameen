import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CasakuClient,
  CasakuError,
  CASAKU_DEFAULT_BASE_URL,
} from "@/lib/payment/casaku";

const CONFIG = {
  licenseKey: "test-license-key",
  qrId: "1364518e-748e-4538-85e0-ddba89a3b4f9",
  packageIds: ["id.dana", "com.gojek.gopaymerchant"],
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

describe("CasakuClient.generateQris", () => {
  it("sends the dynamic QRIS v2 contract with license key header", async () => {
    const fetchMock = stubFetch({
      body: {
        status: 200,
        message: "success",
        data: {
          transactionId: "CSK-123",
          qr_string: "00020101021126630012COM.CASAKU",
          originalAmount: 150000,
          totalAmount: 150333,
          uniqueNominal: 333,
          useUniqueCode: true,
          packageIds: ["id.dana", "com.gojek.gopaymerchant"],
          expiredInMinutes: 15,
          status: "pending",
          payment_url: "https://go.casaku.id/pay?trx=CSK-123",
        },
      },
    });

    const client = new CasakuClient(CONFIG);
    const result = await client.generateQris({ amount: 150000 });

    expect(result.transactionId).toBe("CSK-123");
    expect(result.totalAmount).toBe(150333);
    expect(result.uniqueNominal).toBe(333);
    expect(result.qrString).toBe("00020101021126630012COM.CASAKU");
    expect(result.paymentUrl).toBe("https://go.casaku.id/pay?trx=CSK-123");

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(`${CASAKU_DEFAULT_BASE_URL}/api/generate/v2/qris`);
    expect(init.method).toBe("POST");
    const headers = init.headers as Record<string, string>;
    expect(headers["x-license-key"]).toBe("test-license-key");

    const sent = JSON.parse(String(init.body));
    expect(sent).toMatchObject({
      qr_id: CONFIG.qrId,
      amount: 150000,
      useUniqueCode: true,
      qrType: "dynamic",
      paymentMethod: "qris",
      useQris: true,
      expiredInMinutes: 15,
      prefix: "PA",
    });
    expect(sent.packageIds).toEqual(["id.dana", "com.gojek.gopaymerchant"]);
  });

  it("defaults packageIds to dana when none configured", async () => {
    const fetchMock = stubFetch({
      body: {
        status: 200,
        data: {
          transactionId: "CSK-1",
          originalAmount: 10000,
          totalAmount: 10000,
          uniqueNominal: 0,
          useUniqueCode: false,
          packageIds: ["id.dana"],
          expiredInMinutes: 15,
          status: "pending",
        },
      },
    });

    const client = new CasakuClient({
      licenseKey: "k",
      qrId: "q",
    });
    await client.generateQris({ amount: 10000 });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const sent = JSON.parse(String(init.body));
    expect(sent.packageIds).toEqual(["id.dana"]);
  });

  it("throws CasakuError carrying the API status on non-200", async () => {
    stubFetch({
      ok: false,
      status: 403,
      body: {
        status: 403,
        message: "Silakan langganan di https://casaku.id/pricing",
      },
    });

    const client = new CasakuClient(CONFIG);
    const error = await client.generateQris({ amount: 1000 }).catch((e) => e);

    expect(error).toBeInstanceOf(CasakuError);
    expect((error as CasakuError).status).toBe(403);
    expect((error as CasakuError).message).toContain("langganan");
  });

  it("throws CasakuError on network failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("connect ECONNREFUSED")),
    );

    const client = new CasakuClient(CONFIG);
    const error = await client.generateQris({ amount: 1000 }).catch((e) => e);

    expect(error).toBeInstanceOf(CasakuError);
  });
});

describe("CasakuClient.checkStatus", () => {
  it("maps the check-status response", async () => {
    const fetchMock = stubFetch({
      body: {
        status: 200,
        data: {
          transactionId: "CSK-123",
          amount: 150333,
          status: "paid",
          expiredAt: "2026-08-17 10:00:00",
        },
      },
    });

    const client = new CasakuClient(CONFIG);
    const result = await client.checkStatus("CSK-123");

    expect(result).toMatchObject({
      transactionId: "CSK-123",
      amount: 150333,
      status: "paid",
    });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(`${CASAKU_DEFAULT_BASE_URL}/api/generate/check-status`);
    expect(JSON.parse(String(init.body))).toEqual({
      transactionId: "CSK-123",
    });
  });
});

describe("CasakuClient.getProfile", () => {
  it("uses GET /api/profile", async () => {
    const fetchMock = stubFetch({
      body: {
        status: 200,
        data: {
          id: "u-1",
          name: "Pena Ameen",
          email: "store@penaameen.com",
          vipstatus: true,
          maxgenerateqris: 100,
          storeName: "PENA AMEEN",
        },
      },
    });

    const client = new CasakuClient(CONFIG);
    const profile = await client.getProfile();

    expect(profile.storeName).toBe("PENA AMEEN");
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(`${CASAKU_DEFAULT_BASE_URL}/api/profile`);
    expect(init.method).toBe("GET");
  });
});
