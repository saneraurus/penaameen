import { prisma } from "@/lib/prisma";
import type { ClerkOrgRole } from "@/application/auth/clerk-auth";
import { ROLE_CAPABILITY_MAP } from "@/application/auth/clerk-auth";
import { ensureDefaultAdmin, hashPassword } from "@/lib/admin/auth";

export type StaffStatus = "active" | "inactive";

export interface StaffMember {
  id: string;
  username: string;
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

export async function getStaffMembers(): Promise<
  StaffMemberWithCapabilities[]
> {
  await ensureDefaultAdmin();

  try {
    const users = await prisma.adminUser.findMany({
      orderBy: { createdAt: "asc" },
    });

    const members: StaffMember[] = users.map((user) => {
      const role = (
        user.role in ROLE_CAPABILITY_MAP ? user.role : "admin"
      ) as ClerkOrgRole;
      return {
        id: user.id,
        username: user.username,
        email: `${user.username}@admin.local`,
        fullName: user.fullName || user.username,
        role,
        status: user.isActive ? "active" : "inactive",
        lastActiveAt: user.lastActiveAt
          ? user.lastActiveAt.toISOString()
          : null,
        createdAt: user.createdAt.toISOString(),
      };
    });

    return members.map(withCapabilities);
  } catch (error) {
    console.warn(
      "[Staff] Database unavailable; serving empty staff directory:",
      error,
    );
    return [];
  }
}

export async function getStaffMemberById(
  id: string,
): Promise<StaffMemberWithCapabilities | null> {
  try {
    const user = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!user) return null;

    const role = (
      user.role in ROLE_CAPABILITY_MAP ? user.role : "admin"
    ) as ClerkOrgRole;
    return withCapabilities({
      id: user.id,
      username: user.username,
      email: `${user.username}@admin.local`,
      fullName: user.fullName || user.username,
      role,
      status: user.isActive ? "active" : "inactive",
      lastActiveAt: user.lastActiveAt ? user.lastActiveAt.toISOString() : null,
      createdAt: user.createdAt.toISOString(),
    });
  } catch (error) {
    console.warn("[Staff] Could not resolve staff member by ID:", error);
    return null;
  }
}

export async function createStaffMember(data: {
  username: string;
  fullName?: string | null;
  role: ClerkOrgRole;
  password: string;
}): Promise<StaffMemberWithCapabilities> {
  const normalizedUsername = data.username.trim().toLowerCase();

  if (!normalizedUsername || normalizedUsername.length < 3) {
    throw new Error("Username minimal 3 karakter.");
  }

  if (!data.password || data.password.length < 6) {
    throw new Error("Password minimal 6 karakter.");
  }

  const existing = await prisma.adminUser.findUnique({
    where: { username: normalizedUsername },
  });

  if (existing) {
    throw new Error(`Username '${normalizedUsername}' sudah digunakan.`);
  }

  const passwordHash = hashPassword(data.password);

  const user = await prisma.adminUser.create({
    data: {
      username: normalizedUsername,
      fullName: data.fullName?.trim() || null,
      role: data.role,
      passwordHash,
      isActive: true,
    },
  });

  return withCapabilities({
    id: user.id,
    username: user.username,
    email: `${user.username}@admin.local`,
    fullName: user.fullName || user.username,
    role: user.role as ClerkOrgRole,
    status: "active",
    lastActiveAt: null,
    createdAt: user.createdAt.toISOString(),
  });
}

export async function updateStaffRole(
  id: string,
  role: ClerkOrgRole,
): Promise<StaffMemberWithCapabilities | null> {
  try {
    const user = await prisma.adminUser.update({
      where: { id },
      data: { role },
    });

    return withCapabilities({
      id: user.id,
      username: user.username,
      email: `${user.username}@admin.local`,
      fullName: user.fullName || user.username,
      role: user.role as ClerkOrgRole,
      status: user.isActive ? "active" : "inactive",
      lastActiveAt: user.lastActiveAt ? user.lastActiveAt.toISOString() : null,
      createdAt: user.createdAt.toISOString(),
    });
  } catch (error) {
    console.warn("[Staff] Could not update staff role:", error);
    throw error;
  }
}

export async function updateStaffStatus(
  id: string,
  isActive: boolean,
): Promise<StaffMemberWithCapabilities | null> {
  try {
    const user = await prisma.adminUser.update({
      where: { id },
      data: { isActive },
    });

    return withCapabilities({
      id: user.id,
      username: user.username,
      email: `${user.username}@admin.local`,
      fullName: user.fullName || user.username,
      role: user.role as ClerkOrgRole,
      status: user.isActive ? "active" : "inactive",
      lastActiveAt: user.lastActiveAt ? user.lastActiveAt.toISOString() : null,
      createdAt: user.createdAt.toISOString(),
    });
  } catch (error) {
    console.warn("[Staff] Could not update staff status:", error);
    throw error;
  }
}

export async function updateStaffPassword(
  id: string,
  newPassword: string,
): Promise<void> {
  if (!newPassword || newPassword.length < 6) {
    throw new Error("Password minimal 6 karakter.");
  }

  const passwordHash = hashPassword(newPassword);

  await prisma.adminUser.update({
    where: { id },
    data: { passwordHash },
  });
}

export async function deleteStaffMember(id: string): Promise<void> {
  const user = await prisma.adminUser.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("Pengguna tidak ditemukan.");
  }

  // Prevent deleting the last active administrator
  if (user.role === "admin") {
    const adminCount = await prisma.adminUser.count({
      where: { role: "admin", isActive: true },
    });
    if (adminCount <= 1) {
      throw new Error(
        "Tidak dapat menghapus satu-satunya akun Administrator yang aktif.",
      );
    }
  }

  await prisma.adminUser.delete({
    where: { id },
  });
}
