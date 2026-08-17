import { clerkClient } from "@clerk/nextjs/server";
import type { ClerkOrgRole } from "@/application/auth/clerk-auth";
import { ROLE_CAPABILITY_MAP } from "@/application/auth/clerk-auth";

export type StaffStatus = "active" | "invited" | "revoked";

export interface StaffMember {
  id: string;
  email: string;
  fullName: string | null;
  role: ClerkOrgRole;
  status: StaffStatus;
  lastActiveAt: string | null;
  createdAt: string;
}

export interface StaffMemberWithCapabilities extends StaffMember {
  capabilities: string[];
}

export const STAFF_ROLES: readonly ClerkOrgRole[] = [
  "admin",
  "product_manager",
  "order_manager",
  "fulfillment_manager",
  "content_manager",
  "seo_manager",
  "customer_support",
];

function withCapabilities(member: StaffMember): StaffMemberWithCapabilities {
  return {
    ...member,
    capabilities: Array.from(ROLE_CAPABILITY_MAP[member.role] ?? []),
  };
}

function configuredAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function resolveStaffRole(
  email: string,
  privateRole?: unknown,
  publicRole?: unknown,
  memberships?: Array<{ role: string }>,
): ClerkOrgRole | null {
  if (email && configuredAdminEmails().includes(email.toLowerCase())) {
    return "admin";
  }

  const candidates = [
    privateRole,
    publicRole,
    ...(memberships ?? []).map((m) => m.role.replace(/^org:/, "")),
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate in ROLE_CAPABILITY_MAP) {
      return candidate as ClerkOrgRole;
    }
  }
  return null;
}

export async function getStaffMembers(): Promise<
  StaffMemberWithCapabilities[]
> {
  let users;
  try {
    const client = await clerkClient();
    users = await client.users.getUserList({ limit: 100 });
  } catch (error) {
    console.warn(
      "[Staff] Clerk API unavailable; serving empty staff directory:",
      error,
    );
    return [];
  }

  const members: StaffMember[] = [];

  for (const user of users.data) {
    const email =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress ??
      user.emailAddresses[0]?.emailAddress ??
      "";

    let memberships: Array<{ role: string }> = [];
    try {
      const client = await clerkClient();
      const list = await client.users.getOrganizationMembershipList({
        userId: user.id,
      });
      memberships = list.data.map((m) => ({ role: m.role }));
    } catch {
      // membership resolution is best-effort
    }

    const role = resolveStaffRole(
      email,
      user.privateMetadata?.role,
      user.publicMetadata?.role,
      memberships,
    );

    if (!role) continue;

    members.push({
      id: user.id,
      email,
      fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || null,
      role,
      status: "active",
      lastActiveAt: user.lastActiveAt
        ? new Date(user.lastActiveAt).toISOString()
        : null,
      createdAt: new Date(user.createdAt).toISOString(),
    });
  }

  return members.map(withCapabilities);
}

export async function getStaffMemberById(
  id: string,
): Promise<StaffMemberWithCapabilities | null> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(id);

    const email =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress ??
      user.emailAddresses[0]?.emailAddress ??
      "";

    let memberships: Array<{ role: string }> = [];
    try {
      const list = await client.users.getOrganizationMembershipList({
        userId: user.id,
      });
      memberships = list.data.map((m) => ({ role: m.role }));
    } catch {
      // best-effort
    }

    const role = resolveStaffRole(
      email,
      user.privateMetadata?.role,
      user.publicMetadata?.role,
      memberships,
    );

    if (!role) return null;

    return withCapabilities({
      id: user.id,
      email,
      fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || null,
      role,
      status: "active",
      lastActiveAt: user.lastActiveAt
        ? new Date(user.lastActiveAt).toISOString()
        : null,
      createdAt: new Date(user.createdAt).toISOString(),
    });
  } catch (error) {
    console.warn("[Staff] Could not resolve staff member:", error);
    return null;
  }
}

export async function updateStaffRole(
  id: string,
  role: ClerkOrgRole,
): Promise<StaffMemberWithCapabilities | null> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(id);

    const email =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress ??
      user.emailAddresses[0]?.emailAddress ??
      "";

    if (email && configuredAdminEmails().includes(email.toLowerCase())) {
      throw new Error(
        "This user is protected by the ADMIN_EMAILS allowlist; change the role via environment configuration.",
      );
    }

    // privateMetadata replaces the whole object on update: merge existing keys.
    await client.users.updateUser(id, {
      privateMetadata: {
        ...(user.privateMetadata ?? {}),
        role,
      },
    });

    return withCapabilities({
      id: user.id,
      email,
      fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || null,
      role,
      status: "active",
      lastActiveAt: user.lastActiveAt
        ? new Date(user.lastActiveAt).toISOString()
        : null,
      createdAt: new Date(user.createdAt).toISOString(),
    });
  } catch (error) {
    console.warn("[Staff] Could not update staff role:", error);
    throw error;
  }
}
