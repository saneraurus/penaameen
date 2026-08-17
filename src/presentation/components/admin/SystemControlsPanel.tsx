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
    return <div className="py-12 text-center text-sm text-gray-500">Memuat...</div>;
  }

  if (error && controls.length === 0) {
    return <div className="py-12 text-center text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {controls.map((control) => (
        <div
          key={control.key}
          className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center justify-between gap-4"
        >
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {control.label}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 font-mono">
              {control.key}
            </p>
            {control.updatedAt && (
              <p className="text-[11px] text-gray-400 mt-1">
                Diubah: {new Date(control.updatedAt).toLocaleString("id-ID")}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleToggle(control)}
            disabled={busyKey === control.key}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 ${
              control.value
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
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

      <p className="text-[11px] text-gray-400">
        Kontrol darurat membutuhkan izin khusus (system:control) dan konfirmasi
        eksplisit. Setiap perubahan tercatat di audit log.
      </p>
    </div>
  );
}