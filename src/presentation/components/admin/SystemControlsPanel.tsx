"use client";

import { useEffect, useState } from "react";
import type { SystemControlState } from "@/lib/admin/system-controls";

export function SystemControlsPanel() {
  const [controls, setControls] = useState<SystemControlState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/system-controls");
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setControls(data.controls ?? []);
      } catch {
        setError("Gagal memuat kontrol sistem");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleToggle(control: SystemControlState) {
    const nextValue = !control.value;
    const actionLabel = nextValue ? "MENGAKTIFKAN" : "MENONAKTIFKAN";

    const ok = window.confirm(
      `${actionLabel} "${control.label}"?\n\nIni adalah kontrol darurat yang memengaruhi operasi produksi. Semua perubahan dicatat di audit log.`,
    );
    if (!ok) return;

    setBusyKey(control.key);
    setError(null);
    try {
      const res = await fetch("/api/admin/system-controls", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: control.key,
          value: nextValue,
          confirm: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal mengubah kontrol");
        return;
      }
      setControls((prev) =>
        prev.map((c) => (c.key === control.key ? data.control : c)),
      );
    } catch {
      setError("Gagal mengubah kontrol sistem");
    } finally {
      setBusyKey(null);
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center text-xs text-supporting-500">
        Memuat...
      </div>
    );
  }

  if (error && controls.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-red-700">{error}</div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="admin-panel border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">
          {error}
        </div>
      )}

      {controls.map((control) => (
        <div
          key={control.key}
          className="admin-panel flex items-center justify-between gap-4 p-5"
        >
          <div>
            <h3 className="text-sm font-medium text-supporting-900">
              {control.label}
            </h3>
            <p className="text-xs text-supporting-500 mt-0.5 font-mono">
              {control.key}
            </p>
            {control.updatedAt && (
              <p className="mt-1 text-[11px] text-supporting-400">
                Diubah: {new Date(control.updatedAt).toLocaleString("id-ID")}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleToggle(control)}
            disabled={busyKey === control.key}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold tracking-tight transition-colors cursor-pointer disabled:opacity-50 ${
              control.value
                ? "border border-red-200 bg-red-50 text-red-800 hover:bg-red-100"
                : "border border-supporting-300 bg-supporting-50 text-supporting-800 hover:bg-supporting-100"
            }`}
          >
            {busyKey === control.key
              ? "Memproses..."
              : control.value
                ? "AKTIF — Klik untuk Nonaktifkan"
                : "Nonaktif — Klik untuk Aktifkan"}
          </button>
        </div>
      ))}

      <p className="text-[11px] text-supporting-400">
        Kontrol darurat membutuhkan izin khusus (system:control) dan konfirmasi
        eksplisit. Setiap perubahan tercatat di audit log.
      </p>
    </div>
  );
}
