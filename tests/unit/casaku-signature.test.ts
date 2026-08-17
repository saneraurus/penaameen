import { createHmac } from "crypto";
import { describe, expect, it } from "vitest";

import {
  parseCasakuWebhookPayload,
  verifyCasakuWebhookSignature,
} from "@/lib/payment/casaku";

const SECRET =
  "cashify_[REDACTED]";

const SAMPLE_PAYLOAD = JSON.stringify({
  transactionId: "CSK-123",
  amount: 150333,
  status: "paid",
  packageName: "DANA",
  appName: "dana",
});

function sign(rawBody: string): string {
  return createHmac("sha256", SECRET).update(rawBody).digest("hex");
}

describe("verifyCasakuWebhookSignature", () => {
  it("accepts a valid HMAC-SHA256 signature", () => {
    const signature = sign(SAMPLE_PAYLOAD);
    expect(
      verifyCasakuWebhookSignature(SAMPLE_PAYLOAD, signature, SECRET),
    ).toBe(true);
  });

  it("rejects a tampered body", () => {
    const signature = sign(SAMPLE_PAYLOAD);
    const tampered = SAMPLE_PAYLOAD.replace("150333", "150000");
    expect(verifyCasakuWebhookSignature(tampered, signature, SECRET)).toBe(
      false,
    );
  });

  it("rejects a signature computed with a different secret", () => {
    const signature = sign(SAMPLE_PAYLOAD);
    expect(
      verifyCasakuWebhookSignature(
        SAMPLE_PAYLOAD,
        signature,
        "wrong-secret-value",
      ),
    ).toBe(false);
  });

  it("rejects missing or empty signature", () => {
    expect(
      verifyCasakuWebhookSignature(SAMPLE_PAYLOAD, undefined, SECRET),
    ).toBe(false);
    expect(verifyCasakuWebhookSignature(SAMPLE_PAYLOAD, "", SECRET)).toBe(
      false,
    );
  });

  it("rejects non-hex garbage without throwing", () => {
    expect(
      verifyCasakuWebhookSignature(SAMPLE_PAYLOAD, "not-hex-!!!", SECRET),
    ).toBe(false);
  });
});

describe("parseCasakuWebhookPayload", () => {
  it("parses a valid paid payload", () => {
    const payload = parseCasakuWebhookPayload(SAMPLE_PAYLOAD);
    expect(payload).toMatchObject({
      transactionId: "CSK-123",
      amount: 150333,
      status: "paid",
      packageName: "DANA",
    });
  });

  it("rejects a payload without transactionId", () => {
    expect(() =>
      parseCasakuWebhookPayload(
        JSON.stringify({ amount: 100, status: "paid" }),
      ),
    ).toThrow();
  });

  it("rejects a non-numeric amount", () => {
    expect(() =>
      parseCasakuWebhookPayload(
        JSON.stringify({
          transactionId: "CSK-1",
          amount: "100",
          status: "paid",
        }),
      ),
    ).toThrow();
  });

  it("rejects an unsupported status", () => {
    expect(() =>
      parseCasakuWebhookPayload(
        JSON.stringify({
          transactionId: "CSK-1",
          amount: 100,
          status: "unknown",
        }),
      ),
    ).toThrow();
  });
});
