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

const MOCK_STAFF: StaffMember[] = [
  {
    id: "user_ihsan_admin",
    email: "ihsanzz099@gmail.com",
    fullName: "Ihsan (Admin & Owner)",
    role: "admin",
    status: "active",
    lastActiveAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

function withCapabilities(member: StaffMember): StaffMemberWithCapabilities {
  return {
    ...member,
    capabilities: Array.from(ROLE_CAPABILITY_MAP[member.role] ?? []),
  };
}

export async function getStaffMembers(): Promise<
  StaffMemberWithCapabilities[]
> {
  return MOCK_STAFF.map(withCapabilities);
}

export async function getStaffMemberById(
  id: string,
): Promise<StaffMemberWithCapabilities | null> {
  const member = MOCK_STAFF.find((m) => m.id === id);
  return member ? withCapabilities(member) : null;
}

export async function updateStaffRole(
  id: string,
  role: ClerkOrgRole,
): Promise<StaffMemberWithCapabilities | null> {
  const member = MOCK_STAFF.find((m) => m.id === id);
  if (!member) return null;
  member.role = role;
  return withCapabilities(member);
}
