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
    id: "user_admin_1",
    email: "admin@penaameen.com",
    fullName: "PENA AMEEN Admin",
    role: "admin",
    status: "active",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
  },
  {
    id: "user_pm_2",
    email: "produk@penaameen.com",
    fullName: "Manajer Produk",
    role: "product_manager",
    status: "active",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
  },
  {
    id: "user_om_3",
    email: "pesanan@penaameen.com",
    fullName: "Manajer Pesanan",
    role: "order_manager",
    status: "active",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
  {
    id: "user_fm_4",
    email: "pengiriman@penaameen.com",
    fullName: "Manajer Pengiriman",
    role: "fulfillment_manager",
    status: "invited",
    lastActiveAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: "user_cm_5",
    email: "konten@penaameen.com",
    fullName: "Manajer Konten",
    role: "content_manager",
    status: "active",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
  },
  {
    id: "user_cs_6",
    email: "cs@penaameen.com",
    fullName: "Customer Support",
    role: "customer_support",
    status: "active",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
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
