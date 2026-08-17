import { describe, expect, it } from "vitest";

import {
  authorizeCustomerOwnership,
  authorizeStaffCapability,
} from "@/application/authorization/authorization-service";
import {
  createActorId,
  createCorrelationId,
} from "@/domain/common/identifiers";

describe("authorization foundation", () => {
  const correlationId = createCorrelationId("authorization-test");

  it("allows a customer to access only their owned resource", () => {
    const ownerId = createActorId("customer-a");

    expect(
      authorizeCustomerOwnership(
        { kind: "customer", customerId: ownerId },
        { ownerId },
        correlationId,
      ),
    ).toEqual({ allowed: true });
  });

  it("denies a customer access to another customer resource", () => {
    expect(
      authorizeCustomerOwnership(
        { kind: "customer", customerId: createActorId("customer-a") },
        { ownerId: createActorId("customer-b") },
        correlationId,
      ),
    ).toMatchObject({
      allowed: false,
      code: "AUTHORIZATION_DENIED",
    });
  });

  it("does not grant a staff action without the required capability", () => {
    expect(
      authorizeStaffCapability(
        {
          kind: "staff",
          staffId: createActorId("staff-a"),
          capabilities: new Set(["catalog:read"]),
        },
        "inventory:adjust",
        correlationId,
      ),
    ).toMatchObject({
      allowed: false,
      code: "AUTHORIZATION_DENIED",
    });
  });
});
