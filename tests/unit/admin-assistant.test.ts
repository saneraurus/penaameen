import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    product: {
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
    },
    user: {
      count: vi.fn().mockResolvedValue(0),
    },
    notification: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    auditLog: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
  default: {},
}));

import { buildLiveAdminKnowledge } from "@/lib/assistant/admin-knowledge";

describe("Admin Assistant Live Knowledge", () => {
  it("generates a structured snapshot of database state without crashing", async () => {
    const knowledge = await buildLiveAdminKnowledge();

    expect(typeof knowledge).toBe("string");
    expect(knowledge).toContain("LIVE DATABASE SNAPSHOT");
  });
});
