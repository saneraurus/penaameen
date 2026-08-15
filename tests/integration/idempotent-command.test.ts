import { describe, expect, it } from "vitest";

import { runIdempotentCommand } from "@/application/idempotency/idempotent-command";
import { InMemoryIdempotencyStore } from "../doubles/in-memory-idempotency-store";

describe("idempotent command boundary", () => {
  it("runs a claimed command once and records success", async () => {
    const store = new InMemoryIdempotencyStore();
    let executionCount = 0;

    const result = await runIdempotentCommand(
      "checkout-foundation",
      store,
      async () => {
        executionCount += 1;
        return "accepted";
      },
    );

    expect(result).toEqual({ ok: true, value: "accepted" });
    expect(executionCount).toBe(1);
    expect(store.wasMarkedSucceeded("checkout-foundation")).toBe(true);
  });

  it("prevents a duplicate claimed command", async () => {
    const store = new InMemoryIdempotencyStore();

    await runIdempotentCommand("duplicate", store, async () => "first");
    const duplicate = await runIdempotentCommand(
      "duplicate",
      store,
      async () => "second",
    );

    expect(duplicate).toMatchObject({
      ok: false,
      error: { code: "IDEMPOTENCY_CONFLICT" },
    });
  });
});
