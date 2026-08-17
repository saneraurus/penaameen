import { auth, clerkClient } from "@clerk/nextjs/server";
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

  if (!userId) {
    return null;
  }

  let resolvedRole: ClerkOrgRole | null = null;
  let userEmail = (sessionClaims?.email as string) || "";
  let userFullName = (sessionClaims?.fullName as string) || null;

  // 1. Check configured ADMIN_EMAILS list
  const configuredAdminEmails = (process.env.ADMIN_EMAILS || "ihsanzz099@gmail.com,admin@penaameen.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (userEmail && configuredAdminEmails.includes(userEmail.toLowerCase())) {
    resolvedRole = "admin";
  }

  // 2. Check if orgRole is present in active session claims
  if (!resolvedRole && orgRole) {
    const rawRole = orgRole.replace(/^org:/, "");
    if (rawRole in ROLE_CAPABILITY_MAP) {
      resolvedRole = rawRole as ClerkOrgRole;
    }
  }

  // 3. Query Clerk for user emails, organization memberships, and invitations
  if (!resolvedRole) {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const userEmails = user.emailAddresses.map((e) => e.emailAddress.toLowerCase());

      if (!userEmail && userEmails.length > 0) {
        userEmail = userEmails[0] || "";
      }
      if (!userFullName) {
        userFullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || null;
      }

      // Check if any of the user's registered emails match ADMIN_EMAILS
      if (userEmails.some((ue) => configuredAdminEmails.includes(ue))) {
        resolvedRole = "admin";
      }

      // Check direct Clerk user metadata
      if (!resolvedRole) {
        const metaRole = (
          (user.publicMetadata?.role as string) ||
          (user.privateMetadata?.role as string) ||
          ""
        ).replace(/^org:/, "");

        if (metaRole in ROLE_CAPABILITY_MAP) {
          resolvedRole = metaRole as ClerkOrgRole;
        }
      }

      // Check direct Clerk organization memberships
      if (!resolvedRole) {
        const memberships = await client.users.getOrganizationMembershipList({
          userId,
        });

        if (memberships.data && memberships.data.length > 0) {
          for (const m of memberships.data) {
            const rawRole = (m.role || "").replace(/^org:/, "");
            if (rawRole in ROLE_CAPABILITY_MAP) {
              resolvedRole = rawRole as ClerkOrgRole;
              break;
            }
          }
        }
      }

      // Check active organization invitations in Clerk
      if (!resolvedRole) {
        const orgList = await client.organizations.getOrganizationList();
        for (const org of orgList.data || []) {
          try {
            const invitations = await client.organizations.getOrganizationInvitationList({
              organizationId: org.id,
            });

            const matchedInvite = invitations.data?.find((inv) =>
              userEmails.includes(inv.emailAddress.toLowerCase())
            );

            if (matchedInvite) {
              const rawRole = (matchedInvite.role || "admin").replace(/^org:/, "");
              resolvedRole = (rawRole in ROLE_CAPABILITY_MAP ? rawRole : "admin") as ClerkOrgRole;
              break;
            }
          } catch {
            // ignore
          }
        }
      }
    } catch (e) {
      console.warn("[Clerk Auth] Error during staff resolution for user:", userId, e);
    }
  }

  // 4. Strictly reject if user does not match any admin/staff criteria
  if (!resolvedRole) {
    return null;
  }

  const capabilities = ROLE_CAPABILITY_MAP[resolvedRole] ?? new Set();

  return {
    kind: "staff",
    staffId: userId as ActorId,
    capabilities,
    email: userEmail,
    fullName: userFullName,
    orgRole: resolvedRole,
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