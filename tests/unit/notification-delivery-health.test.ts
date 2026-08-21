import { describe, expect, it } from "vitest";
import { vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: { notification: { count: () => Promise.resolve(0) } },
}));
import { getNotificationStoreHealth } from "@/lib/admin/notifications";

describe("notification delivery boundaries", () => {
  it("does not expose file fallback as a writable production store", () => {
    const health = getNotificationStoreHealth();
    expect(["database", "degraded"]).toContain(health.state);
    expect(typeof health.writable).toBe("boolean");
  });
});
