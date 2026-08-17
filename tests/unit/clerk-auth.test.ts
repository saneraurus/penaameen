import { describe, expect, it } from "vitest";

import {
  ROLE_CAPABILITY_MAP,
  hasCapability,
  type StaffActor,
} from "@/application/auth/clerk-auth";
import { createActorId } from "@/domain/common/identifiers";

function actorFor(role: keyof typeof ROLE_CAPABILITY_MAP): StaffActor {
  return {
    kind: "staff",
    staffId: createActorId("test-staff-id"),
    capabilities: ROLE_CAPABILITY_MAP[role],
    email: "test@penaameen.com",
    fullName: "Test Staff",
    orgRole: role,
  };
}

describe("clerk-auth capability mapping", () => {
  it("admin has the broadest capability set", () => {
    const caps = ROLE_CAPABILITY_MAP.admin;
    expect(caps.has("catalog:write")).toBe(true);
    expect(caps.has("orders:transition")).toBe(true);
    expect(caps.has("access:write")).toBe(true);
    expect(caps.has("audit:read")).toBe(true);
  });

  it("product_manager cannot read orders", () => {
    const actor = actorFor("product_manager");
    expect(hasCapability(actor, "catalog:write")).toBe(true);
    expect(hasCapability(actor, "orders:read")).toBe(false);
    expect(hasCapability(actor, "access:write")).toBe(false);
  });

  it("order_manager can read orders but not manage catalog", () => {
    const actor = actorFor("order_manager");
    expect(hasCapability(actor, "orders:read")).toBe(true);
    expect(hasCapability(actor, "orders:transition")).toBe(true);
    expect(hasCapability(actor, "catalog:write")).toBe(false);
  });

  it("customer_support has only minimal capabilities", () => {
    const caps = ROLE_CAPABILITY_MAP.customer_support;
    expect(caps.has("orders:read")).toBe(true);
    expect(caps.has("customers:read")).toBe(true);
    expect(caps.has("catalog:write")).toBe(false);
    expect(caps.has("access:write")).toBe(false);
  });

  it("every role maps to a non-empty capability set", () => {
    for (const role of Object.keys(ROLE_CAPABILITY_MAP) as Array<
      keyof typeof ROLE_CAPABILITY_MAP
    >) {
      expect(ROLE_CAPABILITY_MAP[role].size).toBeGreaterThan(0);
    }
  });
});
