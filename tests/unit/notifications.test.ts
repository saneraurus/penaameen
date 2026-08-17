import { describe, expect, it, vi, beforeEach } from "vitest";

const fsMock = vi.hoisted(() => {
  const mem = new Map<string, string>();
  return {
    mem,
    fs: {
      existsSync: (p: string) => mem.has(p),
      mkdirSync: () => undefined,
      readFileSync: (p: string) => {
        if (!mem.has(p)) throw new Error("ENOENT");
        return mem.get(p);
      },
      writeFileSync: (p: string, data: string) => {
        mem.set(p, data);
      },
      appendFileSync: (p: string, data: string) => {
        mem.set(p, (mem.get(p) ?? "") + data);
      },
    },
  };
});

vi.mock("fs", () => ({ ...fsMock.fs, default: fsMock.fs }));

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
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/admin/notifications";

describe("notification center (file fallback)", () => {
  beforeEach(() => {
    fsMock.mem.clear();
  });

  it("creates a notification and lists it", async () => {
    const created = await createNotification({
      type: "order.paid",
      severity: "info",
      title: "Pesanan dibayar",
      targetType: "order",
      targetId: "order-1",
    });

    expect(created.id).toBeTruthy();
    expect(created.readAt).toBeNull();

    const result = await getNotifications({ page: 1, perPage: 10 });
    expect(result.total).toBe(1);
    expect(result.notifications[0]?.title).toBe("Pesanan dibayar");
    expect(result.notifications[0]?.targetId).toBe("order-1");
  });

  it("counts unread and marks single notification read", async () => {
    const created = await createNotification({
      type: "webhook.failed",
      severity: "critical",
      title: "Webhook gagal",
    });

    expect(await getUnreadNotificationCount()).toBe(1);

    const updated = await markNotificationRead(created.id);
    expect(updated?.readAt).not.toBeNull();
    expect(await getUnreadNotificationCount()).toBe(0);
  });

  it("marks all notifications read", async () => {
    await createNotification({ type: "a", severity: "info", title: "Satu" });
    await createNotification({ type: "b", severity: "warning", title: "Dua" });

    const count = await markAllNotificationsRead();
    expect(count).toBe(2);
    expect(await getUnreadNotificationCount()).toBe(0);
  });

  it("filters unread-only and returns null for unknown id", async () => {
    const created = await createNotification({
      type: "a",
      severity: "info",
      title: "Satu",
    });
    await createNotification({ type: "b", severity: "info", title: "Dua" });
    await markNotificationRead(created.id);

    const unread = await getNotifications({
      page: 1,
      perPage: 10,
      unreadOnly: true,
    });
    expect(unread.total).toBe(1);
    expect(unread.notifications[0]?.title).toBe("Dua");

    expect(await markNotificationRead("unknown-id")).toBeNull();
  });
});
