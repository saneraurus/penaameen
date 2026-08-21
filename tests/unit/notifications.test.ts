import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    notification: {
      create: () => Promise.reject(new Error("db unavailable")),
      findMany: () => Promise.reject(new Error("db unavailable")),
      count: () => Promise.reject(new Error("db unavailable")),
      update: () => Promise.reject(new Error("db unavailable")),
      updateMany: () => Promise.reject(new Error("db unavailable")),
    },
  },
}));

import {
  createNotification,
  getNotificationStoreHealth,
} from "@/lib/admin/notifications";

describe("notification center fail-closed behavior", () => {
  it("rejects writes instead of using a file fallback when database is unavailable", async () => {
    await expect(
      createNotification({
        type: "order.paid",
        severity: "info",
        title: "Paid",
      }),
    ).rejects.toThrow("NOTIFICATION_STORE_UNAVAILABLE");
    expect(getNotificationStoreHealth()).toMatchObject({
      state: "degraded",
      writable: false,
    });
  });
});
