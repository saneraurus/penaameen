"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AdminNotification } from "@/lib/admin/notifications";

const severityStyles: Record<string, string> = {
  info: "bg-sky-50 text-sky-700 border-sky-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  critical: "bg-red-50 text-red-700 border-red-200",
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
        <div className="text-sm text-gray-500">
          {unreadCount} belum dibaca dari {total} total
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 cursor-pointer"
          >
            Tandai semua dibaca
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-gray-500">
          Memuat notifikasi...
        </div>
      ) : error ? (
        <div className="py-12 text-center text-sm text-red-600">{error}</div>
      ) : notifications.length === 0 ? (
        <div className="py-16 text-center text-sm text-gray-500">
          Belum ada notifikasi.
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-2xl border p-4 shadow-xs ${
                n.readAt === null ? "border-primary-200" : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${severityStyles[n.severity] ?? severityStyles.info}`}
                    >
                      {n.severity}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(n.createdAt).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mt-1.5">
                    {n.title}
                  </h4>
                  {n.message ? (
                    <p className="text-xs text-gray-600 mt-0.5">{n.message}</p>
                  ) : null}
                  {n.targetType && n.targetId ? (
                    <div className="mt-2">
                      <Link
                        href={`/admin/${n.targetType}s/${n.targetId}`}
                        className="text-xs font-semibold text-primary-600 hover:text-primary-700"
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
                    className="text-[11px] font-semibold text-gray-500 hover:text-gray-800 border border-gray-300 rounded-lg px-2.5 py-1 shrink-0 cursor-pointer"
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