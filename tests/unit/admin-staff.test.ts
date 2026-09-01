import { describe, expect, it, vi, beforeEach } from "vitest";

const mockAdminUsers: Array<{
  id: string;
  username: string;
  passwordHash: string;
  fullName: string | null;
  role: string;
  isActive: boolean;
  lastActiveAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}> = [];

vi.mock("@/lib/prisma", () => ({
  prisma: {
    adminUser: {
      findMany: vi.fn(async () => mockAdminUsers),
      findUnique: vi.fn(
        async ({ where }: { where: { username?: string; id?: string } }) => {
          if (where.username) {
            return (
              mockAdminUsers.find((u) => u.username === where.username) ?? null
            );
          }
          if (where.id) {
            return mockAdminUsers.find((u) => u.id === where.id) ?? null;
          }
          return null;
        },
      ),
      create: vi.fn(async ({ data }) => {
        const record = {
          id: `admin-${Date.now()}`,
          username: data.username,
          passwordHash: data.passwordHash,
          fullName: data.fullName ?? null,
          role: data.role ?? "admin",
          isActive: data.isActive ?? true,
          lastActiveAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mockAdminUsers.push(record);
        return record;
      }),
      update: vi.fn(
        async ({
          where,
          data,
        }: {
          where: { id: string };
          data: Record<string, unknown>;
        }) => {
          const user = mockAdminUsers.find((u) => u.id === where.id);
          if (!user) throw new Error("User not found");
          Object.assign(user, data, { updatedAt: new Date() });
          return user;
        },
      ),
      delete: vi.fn(async ({ where }: { where: { id: string } }) => {
        const index = mockAdminUsers.findIndex((u) => u.id === where.id);
        if (index !== -1) mockAdminUsers.splice(index, 1);
        return {};
      }),
      count: vi.fn(
        async ({ where }: { where: { role?: string; isActive?: boolean } }) => {
          return mockAdminUsers.filter((u) => {
            if (where.role && u.role !== where.role) return false;
            if (where.isActive !== undefined && u.isActive !== where.isActive)
              return false;
            return true;
          }).length;
        },
      ),
    },
  },
  default: {},
}));

import {
  getStaffMembers,
  getStaffMemberById,
  createStaffMember,
  updateStaffRole,
  updateStaffStatus,
  updateStaffPassword,
  deleteStaffMember,
} from "@/lib/admin/staff";
import { verifyPassword } from "@/lib/admin/auth";

describe("admin staff management with database backing", () => {
  beforeEach(() => {
    mockAdminUsers.length = 0;
    mockAdminUsers.push({
      id: "admin-default-1",
      username: "ihsan",
      passwordHash: "salt123:hash123",
      fullName: "Ihsan (Admin)",
      role: "admin",
      isActive: true,
      lastActiveAt: new Date(),
      createdAt: new Date("2026-08-01"),
      updatedAt: new Date("2026-08-01"),
    });
  });

  it("retrieves staff members with capability lists", async () => {
    const members = await getStaffMembers();
    expect(members).toHaveLength(1);
    expect(members[0]?.username).toBe("ihsan");
    expect(members[0]?.role).toBe("admin");
    expect(members[0]?.capabilities).toContain("access:write");
    expect(members[0]?.capabilities).toContain("catalog:write");
  });

  it("retrieves a staff member by ID", async () => {
    const member = await getStaffMemberById("admin-default-1");
    expect(member).not.toBeNull();
    expect(member?.username).toBe("ihsan");
  });

  it("creates a new staff member and hashes their password", async () => {
    const created = await createStaffMember({
      username: "editor_andi",
      fullName: "Andi Editor",
      role: "content_manager",
      password: "SecretPassword123",
    });

    expect(created.username).toBe("editor_andi");
    expect(created.role).toBe("content_manager");
    expect(created.capabilities).toContain("content:write");
    expect(created.capabilities).not.toContain("orders:write");

    const saved = mockAdminUsers.find((u) => u.username === "editor_andi");
    expect(saved).toBeDefined();
    expect(verifyPassword("SecretPassword123", saved!.passwordHash)).toBe(true);
  });

  it("rejects duplicate usernames", async () => {
    await expect(
      createStaffMember({
        username: "ihsan",
        role: "admin",
        password: "AnotherPassword123",
      }),
    ).rejects.toThrow(/sudah digunakan/i);
  });

  it("rejects short usernames or passwords", async () => {
    await expect(
      createStaffMember({
        username: "ab",
        role: "admin",
        password: "Pass1",
      }),
    ).rejects.toThrow(/minimal/i);
  });

  it("updates staff role", async () => {
    const updated = await updateStaffRole("admin-default-1", "order_manager");
    expect(updated?.role).toBe("order_manager");
    expect(updated?.capabilities).toContain("orders:write");
  });

  it("updates staff active status", async () => {
    const updated = await updateStaffStatus("admin-default-1", false);
    expect(updated?.status).toBe("inactive");
  });

  it("updates staff password", async () => {
    await updateStaffPassword("admin-default-1", "NewSecurePassword456");
    const user = mockAdminUsers.find((u) => u.id === "admin-default-1");
    expect(verifyPassword("NewSecurePassword456", user!.passwordHash)).toBe(
      true,
    );
  });

  it("prevents deleting the last active admin", async () => {
    await expect(deleteStaffMember("admin-default-1")).rejects.toThrow(
      /satu-satunya akun Administrator/i,
    );
  });

  it("allows deleting non-last admin staff", async () => {
    mockAdminUsers.push({
      id: "admin-2",
      username: "second_admin",
      passwordHash: "salt:hash",
      fullName: "Second Admin",
      role: "admin",
      isActive: true,
      lastActiveAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await deleteStaffMember("admin-2");
    expect(mockAdminUsers.find((u) => u.id === "admin-2")).toBeUndefined();
  });
});
