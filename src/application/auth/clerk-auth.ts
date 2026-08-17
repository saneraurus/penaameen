import { auth } from "@clerk/nextjs/server";
import { type ActorId, type CorrelationId } from "@/domain/common/identifiers";
import { createCorrelationId } from "@/domain/common/identifiers";

export type ClerkOrgRole =
  | "admin"
  | "product_manager"
  | "order_manager"
  | "fulfillment_manager"
  | "content_manager"
  | "seo_manager"
  | "customer_support";

export const ROLE_CAPABILITY_MAP: Readonly<Record<ClerkOrgRole, ReadonlySet<string>>> = {
  admin: new Set([
    "catalog:read",
    "catalog:write",
    "catalog:publish",
    "catalog:archive",
    "inventory:read",
    "inventory:write",
    "media:read",
    "media:write",
    "seo:read",
    "seo:write",
    "orders:read",
    "orders:write",
    "orders:transition",
    "payments:read",
    "payments:refund",
    "fulfillment:read",
    "fulfillment:write",
    "fulfillment:shipment_create",
    "fulfillment:label_print",
    "customers:read",
    "customers:write",
    "content:read",
    "content:write",
    "content:publish",
    "taxonomy:read",
    "taxonomy:write",
    "branches:read",
    "branches:write",
    "events:read",
    "events:write",
    "promotions:read",
    "promotions:write",
    "analytics:read",
    "settings:read",
    "settings:write",
    "access:read",
    "access:write",
    "audit:read",
  ]),
  product_manager: new Set([
    "catalog:read",
    "catalog:write",
    "catalog:publish",
    "catalog:archive",
    "inventory:read",
    "inventory:write",
    "media:read",
    "media:write",
    "seo:read",
    "seo:write",
  ]),
  order_manager: new Set([
    "orders:read",
    "orders:write",
    "orders:transition",
    "payments:read",
    "fulfillment:read",
    "customers:read",
  ]),
  fulfillment_manager: new Set([
    "orders:read",
    "fulfillment:read",
    "fulfillment:write",
    "fulfillment:shipment_create",
    "fulfillment:label_print",
  ]),
  content_manager: new Set([
    "content:read",
    "content:write",
    "content:publish",
    "taxonomy:read",
    "taxonomy:write",
    "media:read",
    "media:write",
    "seo:read",
    "seo:write",
  ]),
  seo_manager: new Set([
    "seo:read",
    "seo:write",
    "catalog:read",
    "content:read",
    "taxonomy:read",
  ]),
  customer_support: new Set([
    "orders:read",
    "customers:read",
    "fulfillment:read",
  ]),
};

export type StaffActor = {
  readonly kind: "staff";
  readonly staffId: ActorId;
  readonly capabilities: ReadonlySet<string>;
  readonly email: string;
  readonly fullName: string | null;
  readonly orgRole: ClerkOrgRole;
};

export async function getStaffActor(): Promise<StaffActor | null> {
  const { userId, orgRole, sessionClaims } = await auth();

  if (!userId || !orgRole) {
    return null;
  }

  const role = orgRole as ClerkOrgRole;
  const capabilities = ROLE_CAPABILITY_MAP[role] ?? new Set();

  return {
    kind: "staff",
    staffId: userId as ActorId,
    capabilities,
    email: (sessionClaims?.email as string) ?? "",
    fullName: (sessionClaims?.fullName as string) ?? null,
    orgRole: role,
  };
}

export async function requireStaffActor(
  requiredCapability?: string,
): Promise<StaffActor> {
  const actor = await getStaffActor();

  if (!actor) {
    const correlationId = createCorrelationId("auth");
    throw new Error(
      JSON.stringify({
        code: "AUTHENTICATION_REQUIRED",
        correlationId,
        message: "Staff authentication required",
      }),
    );
  }

  if (requiredCapability && !actor.capabilities.has(requiredCapability)) {
    const correlationId = createCorrelationId("auth");
    throw new Error(
      JSON.stringify({
        code: "AUTHORIZATION_DENIED",
        correlationId,
        message: `Capability required: ${requiredCapability}`,
      }),
    );
  }

  return actor;
}

export function toAuthorizationActor(staffActor: StaffActor): {
  readonly kind: "staff";
  readonly staffId: ActorId;
  readonly capabilities: ReadonlySet<string>;
} {
  return {
    kind: "staff",
    staffId: staffActor.staffId,
    capabilities: staffActor.capabilities,
  };
}

export function hasCapability(actor: StaffActor, capability: string): boolean {
  return actor.capabilities.has(capability);
}

export function createCorrelationIdFromAuth(): CorrelationId {
  return createCorrelationId("auth");
}