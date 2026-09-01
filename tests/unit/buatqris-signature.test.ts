import { createHmac } from "crypto";
import { describe, expect, it } from "vitest";

import {
  parseBuatQrisWebhookPayload,
  verifyBuatQrisWebhookSignature,
} from "@/lib/payment/buatqris";

const SECRET = "mock_test_secret_key_12345";

const SAMPLE_PAYLOAD = JSON.stringify({
  event: "payment.success",
  transaction_id: "BQ-TRX-12345",
  amount: 150000,
  total_amount: 150024,
  status: "success",
});

function sign(rawBody: string): string {
  return createHmac("sha256", SECRET).update(rawBody).digest("hex");
}

describe("verifyBuatQrisWebhookSignature", () => {
  it("accepts a valid HMAC-SHA256 signature", () => {
    const signature = sign(SAMPLE_PAYLOAD);
    expect(
      verifyBuatQrisWebhookSignature(SAMPLE_PAYLOAD, signature, SECRET),
    ).toBe(true);
  });

  it("rejects a tampered body", () => {
    const signature = sign(SAMPLE_PAYLOAD);
    const tampered = SAMPLE_PAYLOAD.replace("150000", "140000");
    expect(verifyBuatQrisWebhookSignature(tampered, signature, SECRET)).toBe(
      false,
    );
  });

  it("rejects a signature computed with a different secret", () => {
    const signature = sign(SAMPLE_PAYLOAD);
    expect(
      verifyBuatQrisWebhookSignature(
        SAMPLE_PAYLOAD,
        signature,
        "wrong-secret-value",
      ),
    ).toBe(false);
  });

  it("rejects missing or empty signature", () => {
    expect(
      verifyBuatQrisWebhookSignature(SAMPLE_PAYLOAD, undefined, SECRET),
    ).toBe(false);
    expect(verifyBuatQrisWebhookSignature(SAMPLE_PAYLOAD, "", SECRET)).toBe(
      false,
    );
  });

  it("rejects non-hex garbage without throwing", () => {
    expect(
      verifyBuatQrisWebhookSignature(SAMPLE_PAYLOAD, "not-hex-!!!", SECRET),
    ).toBe(false);
  });
});

describe("parseBuatQrisWebhookPayload", () => {
  it("parses a valid payment.success payload", () => {
    const payload = parseBuatQrisWebhookPayload(SAMPLE_PAYLOAD);
    expect(payload).toMatchObject({
      transactionId: "BQ-TRX-12345",
      amount: 150000,
      totalAmount: 150024,
      status: "success",
    });
  });

  it("parses transaction_id and event from headers if not in body", () => {
    const raw = JSON.stringify({ amount: 50000 });
    const payload = parseBuatQrisWebhookPayload(
      raw,
      "payment.success",
      "DELIVERY-TRX-777",
    );
    expect(payload.transactionId).toBe("DELIVERY-TRX-777");
    expect(payload.status).toBe("success");
  });

  it("rejects a payload without transactionId", () => {
    expect(() =>
      parseBuatQrisWebhookPayload(JSON.stringify({ amount: 100 })),
    ).toThrow();
  });

  it("rejects invalid JSON", () => {
    expect(() => parseBuatQrisWebhookPayload("not-json-content")).toThrow();
  });
});
