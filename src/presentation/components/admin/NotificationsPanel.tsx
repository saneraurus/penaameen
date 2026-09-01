"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AdminNotification } from "@/lib/admin/notifications";

const severityStyles: Record<string, string> = {
  info: "border-primary-200 bg-primary-50 text-primary-800",
  warning: "border-accent-200 bg-accent-50 text-accent-800",
  critical: "border-red-200 bg-red-50 text-red-800",
};

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/notifications?perPage=100");
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setNotifications(data.notifications ?? []);
        setTotal(data.total ?? 0);
      } catch {
        setError("Gagal memuat notifikasi");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleMarkRead(id: string) {
    await fetch(`/api/admin/notifications/${id}/read`, { method: "POST" });
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, readAt: new Date().toISOString() } : n,
      ),
    );
  }

  async function handleMarkAllRead() {
    await fetch("/api/admin/notifications/read-all", { method: "POST" });
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, readAt: new Date().toISOString() })),
    );
  }

  const unreadCount = notifications.filter((n) => n.readAt === null).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-supporting-500">
          {unreadCount} belum dibaca dari {total} total
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="text-xs font-semibold text-primary-800 hover:text-accent-700 cursor-pointer"
          >
            Tandai semua dibaca
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-supporting-500">
          Memuat notifikasi...
        </div>
      ) : error ? (
        <div className="py-12 text-center text-xs text-red-700">{error}</div>
      ) : notifications.length === 0 ? (
        <div className="py-16 text-center text-xs text-supporting-500">
          Belum ada notifikasi.
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`admin-panel p-4 ${
                n.readAt === null
                  ? "border-primary-200"
                  : "border-supporting-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${severityStyles[n.severity] ?? severityStyles.info}`}
                    >
                      {n.severity}
                    </span>
                    <span className="text-[10px] text-supporting-400">
                      {new Date(n.createdAt).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <h4 className="mt-1.5 text-sm font-medium text-supporting-900">
                    {n.title}
                  </h4>
                  {n.message ? (
                    <p className="mt-0.5 text-xs text-supporting-600">
                      {n.message}
                    </p>
                  ) : null}
                  {n.targetType && n.targetId ? (
                    <div className="mt-2">
                      <Link
                        href={`/admin/${n.targetType}s/${n.targetId}`}
                        className="text-xs font-semibold text-primary-800 hover:text-accent-700"
                      >
                        Lihat {n.targetType} →{" "}
                        <span className="font-mono">{n.targetId}</span>
                      </Link>
                    </div>
                  ) : null}
                </div>
                {n.readAt === null && (
                  <button
                    type="button"
                    onClick={() => handleMarkRead(n.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-supporting-300 px-2.5 py-1 text-[11px] font-semibold text-supporting-700 tracking-tight shrink-0 cursor-pointer transition-colors hover:bg-supporting-50"
                  >
                    Tandai dibaca
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
