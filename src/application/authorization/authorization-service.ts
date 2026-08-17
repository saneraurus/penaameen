import {
  type ActorId,
  type CorrelationId,
  type ResourceId,
} from "@/domain/common/identifiers";
import { fail, succeed, type Result } from "@/domain/common/result";

export type Actor =
  | { readonly kind: "public" }
  | { readonly kind: "guest"; readonly sessionId: ResourceId }
  | { readonly kind: "customer"; readonly customerId: ActorId }
  | {
      readonly kind: "staff";
      readonly staffId: ActorId;
      readonly capabilities: ReadonlySet<string>;
    }
  | { readonly kind: "system"; readonly operation: string };

export type AuthorizationDecision =
  | { readonly allowed: true }
  | {
      readonly allowed: false;
      readonly code: "AUTHENTICATION_REQUIRED" | "AUTHORIZATION_DENIED";
      readonly correlationId: CorrelationId;
    };

export type OwnershipRequirement = {
  readonly ownerId: ActorId;
};

export function authorizeCustomerOwnership(
  actor: Actor,
  requirement: OwnershipRequirement,
  correlationId: CorrelationId,
): AuthorizationDecision {
  if (actor.kind !== "customer") {
    return {
      allowed: false,
      code: "AUTHENTICATION_REQUIRED",
      correlationId,
    };
  }

  if (actor.customerId !== requirement.ownerId) {
    return {
      allowed: false,
      code: "AUTHORIZATION_DENIED",
      correlationId,
    };
  }

  return { allowed: true };
}

export function authorizeStaffCapability(
  actor: Actor,
  capability: string,
  correlationId: CorrelationId,
): AuthorizationDecision {
  if (actor.kind !== "staff") {
    return {
      allowed: false,
      code: "AUTHENTICATION_REQUIRED",
      correlationId,
    };
  }

  if (!actor.capabilities.has(capability)) {
    return {
      allowed: false,
      code: "AUTHORIZATION_DENIED",
      correlationId,
    };
  }

  return { allowed: true };
}

export function requireAuthorization(
  decision: AuthorizationDecision,
): Result<true, Exclude<AuthorizationDecision, { readonly allowed: true }>> {
  if (!decision.allowed) {
    return fail(decision);
  }

  return succeed(true);
}
