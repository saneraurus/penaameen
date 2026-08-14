import { describe, expect, it } from "vitest";

import {
  createCorrelationId,
  createResourceId,
} from "@/domain/common/identifiers";
import {
  DeterministicPaymentProviderDouble,
  DeterministicShippingProviderDouble,
} from "../doubles/deterministic-provider-doubles";

describe("provider-neutral contract doubles", () => {
  it("uses a deterministic TEST ONLY payment double", async () => {
    const provider = new DeterministicPaymentProviderDouble();
    const result = await provider.initiate({
      orderId: createResourceId("order-test"),
      paymentAttemptId: createResourceId("attempt-test"),
      idempotencyKey: "test-idempotency",
      amount: { amountMinor: 0n, currency: "TEST" },
      correlationId: createCorrelationId("payment-contract"),
    });

    expect(result).toMatchObject({
      ok: true,
      value: {
        providerReference: "test-payment-attempt-test",
        status: "initiated",
      },
    });
  });

  it("uses a deterministic TEST ONLY shipping double", async () => {
    const provider = new DeterministicShippingProviderDouble();
    const result = await provider.createShipment({
      shipmentId: createResourceId("shipment-test"),
      orderId: createResourceId("order-test"),
      selectedRateReference: "test-rate",
      idempotencyKey: "test-idempotency",
      correlationId: createCorrelationId("shipping-contract"),
    });

    expect(result).toMatchObject({
      ok: true,
      value: { providerReference: "test-shipment-shipment-test" },
    });
  });
});
