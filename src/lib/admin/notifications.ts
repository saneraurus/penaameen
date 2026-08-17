import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export type NotificationSeverity = "info" | "warning" | "critical";

export interface AdminNotification {
  id: string;
  type: string;
  severity: NotificationSeverity;
  title: string;
  message?: string | undefined;
  targetType?: string | undefined;
  targetId?: string | undefined;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationInput {
  type: string;
  severity: NotificationSeverity;
  title: string;
  message?: string;
  targetType?: string;
  targetId?: string;
}

const NOTIFICATIONS_FILE = path.join(
  process.cwd(),
  "src/data/notifications.json",
);

function loadFileNotifications(): AdminNotification[] {
  try {
    if (fs.existsSync(NOTIFICATIONS_FILE)) {
      const raw = fs.readFileSync(NOTIFICATIONS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as AdminNotification[];
    }
  } catch (e) {
    console.warn("Could not read notifications.json:", e);
  }
  return [];
}

function saveFileNotifications(list: AdminNotification[]): void {
  try {
    const dir = path.dirname(NOTIFICATIONS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      NOTIFICATIONS_FILE,
      JSON.stringify(list, null, 2),
      "utf-8",
    );
  } catch (e) {
    console.warn("Could not write notifications.json:", e);
  }
}

let prismaUnavailable = false;

export async function createNotification(
  input: NotificationInput,
): Promise<AdminNotification> {
  if (!prismaUnavailable) {
    try {
      const db = await prisma.notification.create({
        data: {
          type: input.type,
          severity: input.severity,
          title: input.title,
          message: input.message ?? null,
          targetType: input.targetType ?? null,
          targetId: input.targetId ?? null,
        },
      });
      return {
        id: db.id,
        type: db.type,
        severity: db.severity as NotificationSeverity,
        title: db.title,
        message: db.message ?? undefined,
        targetType: db.targetType ?? undefined,
        targetId: db.targetId ?? undefined,
        readAt: db.readAt ? db.readAt.toISOString() : null,
        createdAt: db.createdAt.toISOString(),
      };
    } catch {
      prismaUnavailable = true;
    }
  }

  const notification: AdminNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: input.type,
    severity: input.severity,
    title: input.title,
    message: input.message,
    targetType: input.targetType,
    targetId: input.targetId,
    readAt: null,
    createdAt: new Date().toISOString(),
  };
  const list = loadFileNotifications();
  list.unshift(notification);
  saveFileNotifications(list);
  return notification;
}

export async function getNotifications(options: {
  page: number;
  perPage: number;
  unreadOnly?: boolean;
}): Promise<{ notifications: AdminNotification[]; total: number }> {
  const { page, perPage, unreadOnly } = options;

  if (!prismaUnavailable) {
    try {
      const where = unreadOnly ? { readAt: null } : {};
      const [rows, total] = await Promise.all([
        prisma.notification.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * perPage,
          take: perPage,
        }),
        prisma.notification.count({ where }),
      ]);
      return {
        notifications: rows.map((r) => ({
          id: r.id,
          type: r.type,
          severity: r.severity as NotificationSeverity,
          title: r.title,
          message: r.message ?? undefined,
          targetType: r.targetType ?? undefined,
          targetId: r.targetId ?? undefined,
          readAt: r.readAt ? r.readAt.toISOString() : null,
          createdAt: r.createdAt.toISOString(),
        })),
        total,
      };
    } catch {
      prismaUnavailable = true;
    }
  }

  let list = loadFileNotifications();
  if (unreadOnly) list = list.filter((n) => n.readAt === null);
  list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const total = list.length;
  const start = (page - 1) * perPage;
  return { notifications: list.slice(start, start + perPage), total };
}

export async function getUnreadNotificationCount(): Promise<number> {
  if (!prismaUnavailable) {
    try {
      return await prisma.notification.count({ where: { readAt: null } });
    } catch {
      prismaUnavailable = true;
    }
  }
  return loadFileNotifications().filter((n) => n.readAt === null).length;
}

export async function markNotificationRead(
  id: string,
): Promise<AdminNotification | null> {
  if (!prismaUnavailable) {
    try {
      const db = await prisma.notification.update({
        where: { id },
        data: { readAt: new Date() },
      });
      return {
        id: db.id,
        type: db.type,
        severity: db.severity as NotificationSeverity,
        title: db.title,
        message: db.message ?? undefined,
        targetType: db.targetType ?? undefined,
        targetId: db.targetId ?? undefined,
        readAt: db.readAt ? db.readAt.toISOString() : null,
        createdAt: db.createdAt.toISOString(),
      };
    } catch {
      prismaUnavailable = true;
    }
  }

  const list = loadFileNotifications();
  const found = list.find((n) => n.id === id);
  if (!found) return null;
  found.readAt = new Date().toISOString();
  saveFileNotifications(list);
  return found;
}

export async function markAllNotificationsRead(): Promise<number> {
  if (!prismaUnavailable) {
    try {
      const result = await prisma.notification.updateMany({
        where: { readAt: null },
        data: { readAt: new Date() },
      });
      return result.count;
    } catch {
      prismaUnavailable = true;
    }
  }

  const list = loadFileNotifications();
  let count = 0;
  for (const n of list) {
    if (n.readAt === null) {
      n.readAt = new Date().toISOString();
      count += 1;
    }
  }
  saveFileNotifications(list);
  return count;
}
