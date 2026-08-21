import { prisma } from "@/lib/prisma";

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

let prismaUnavailable = false;

export function getNotificationStoreHealth() {
  return {
    state: prismaUnavailable ? ("degraded" as const) : ("database" as const),
    writable: !prismaUnavailable,
    detail: prismaUnavailable
      ? "Notification database unavailable; new notifications are rejected instead of written to local files."
      : "Notifications are persisted in PostgreSQL.",
  };
}

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

  throw new Error("NOTIFICATION_STORE_UNAVAILABLE");
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

  return { notifications: [], total: 0 };
}

export async function getUnreadNotificationCount(): Promise<number> {
  if (!prismaUnavailable) {
    try {
      return await prisma.notification.count({ where: { readAt: null } });
    } catch {
      prismaUnavailable = true;
    }
  }
  return 0;
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

  return null;
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

  return 0;
}
