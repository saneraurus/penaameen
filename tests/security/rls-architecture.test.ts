import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const migration = readFileSync(
  resolve(
    process.cwd(),
    "prisma/migrations/20260822_rls_policies/migration.sql",
  ),
  "utf8",
);
const rlsContext = readFileSync(
  resolve(process.cwd(), "src/middleware/rls-context.ts"),
  "utf8",
);

describe("RLS architecture contract", () => {
  it("uses transaction-local Clerk context and forces RLS", () => {
    expect(rlsContext).toContain('SET LOCAL "app.current_clerk_id"');
    expect(rlsContext).toContain('SET LOCAL "app.actor_kind"');
    expect(migration).toContain(
      "current_setting('app.current_clerk_id', true)",
    );
    expect(migration).toContain('ALTER TABLE "User" FORCE ROW LEVEL SECURITY');
    expect(migration).toContain('ALTER TABLE "Order" FORCE ROW LEVEL SECURITY');
    expect(migration).toContain("current_app_is_system()");
  });

  it("protects customer aggregates and their child records", () => {
    for (const table of [
      "User",
      "Address",
      "Cart",
      "CartItem",
      "Order",
      "OrderItem",
      "OrderStatusHistory",
      "ChatSession",
      "ChatMessage",
    ]) {
      expect(migration).toContain(
        `ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY`,
      );
      expect(migration).toContain(
        `ALTER TABLE "${table}" FORCE ROW LEVEL SECURITY`,
      );
    }
  });
});
