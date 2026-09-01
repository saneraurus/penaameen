"use client";

import { useState } from "react";
import { DataTable } from "@/presentation/components/admin/DataTable";
import type { StaffMemberWithCapabilities } from "@/lib/admin/staff";
import type { ClerkOrgRole } from "@/application/auth/clerk-auth";
import {
  UserPlus,
  Key,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  X,
} from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  active: "border-primary-200 bg-primary-50 text-primary-800",
  inactive: "border-red-200 bg-red-50 text-red-800",
};

const ROLE_LABELS: Record<ClerkOrgRole, string> = {
  admin: "Administrator",
  product_manager: "Product Manager",
  order_manager: "Order Manager",
  fulfillment_manager: "Fulfillment Manager",
  content_manager: "Content Manager",
  seo_manager: "SEO Manager",
  customer_support: "Customer Support",
};

const ALL_ROLES: ClerkOrgRole[] = [
  "admin",
  "product_manager",
  "order_manager",
  "fulfillment_manager",
  "content_manager",
  "seo_manager",
  "customer_support",
];

function formatRelative(iso: string | null): string {
  if (!iso) return "Belum pernah aktif";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `${mins}m lalu`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}j lalu`;
  const days = Math.round(hrs / 24);
  return `${days}h lalu`;
}

export function StaffAccessManager({
  initialMembers,
}: {
  initialMembers: StaffMemberWithCapabilities[];
}) {
  const [members, setMembers] =
    useState<StaffMemberWithCapabilities[]>(initialMembers);
  const [selected, setSelected] = useState<StaffMemberWithCapabilities | null>(
    null,
  );
  const [roleDraft, setRoleDraft] = useState<ClerkOrgRole | "">("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New Staff Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newRole, setNewRole] = useState<ClerkOrgRole>("admin");
  const [newPassword, setNewPassword] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Reset Password State
  const [newPasswordDraft, setNewPasswordDraft] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  function openDrawer(member: StaffMemberWithCapabilities) {
    setSelected(member);
    setRoleDraft(member.role);
    setError(null);
    setSuccessMessage(null);
    setNewPasswordDraft("");
  }

  async function handleCreateStaff(e: React.FormEvent) {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword) {
      setAddError("Mohon isi username dan password.");
      return;
    }

    setIsCreating(true);
    setAddError(null);

    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername.trim(),
          fullName: newFullName.trim() || null,
          role: newRole,
          password: newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mendaftarkan staf");
      }

      setMembers((prev) => [...prev, data.data]);
      setIsAddModalOpen(false);
      setNewUsername("");
      setNewFullName("");
      setNewPassword("");
      setNewRole("admin");
    } catch (err) {
      setAddError(
        err instanceof Error ? err.message : "Gagal mendaftarkan staf",
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function saveRole() {
    if (!selected || !roleDraft || roleDraft === selected.role) return;
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await fetch(`/api/admin/staff/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: roleDraft }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      const data = (await res.json()) as { data: StaffMemberWithCapabilities };
      setMembers((prev) =>
        prev.map((m) => (m.id === data.data.id ? data.data : m)),
      );
      setSelected(data.data);
      setSuccessMessage("Peran berhasil diperbarui.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui peran");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus() {
    if (!selected) return;
    const nextStatus = selected.status !== "active";
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await fetch(`/api/admin/staff/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextStatus }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Gagal mengubah status pengguna");
      }
      const data = (await res.json()) as { data: StaffMemberWithCapabilities };
      setMembers((prev) =>
        prev.map((m) => (m.id === data.data.id ? data.data : m)),
      );
      setSelected(data.data);
      setSuccessMessage(
        `Status pengguna diubah menjadi ${nextStatus ? "Aktif" : "Nonaktif"}.`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengubah status");
    } finally {
      setSaving(false);
    }
  }

  async function handleResetPassword() {
    if (!selected || !newPasswordDraft || newPasswordDraft.length < 6) {
      setError("Password baru minimal 6 karakter.");
      return;
    }
    setIsResettingPassword(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await fetch(`/api/admin/staff/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPasswordDraft }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Gagal mereset kata sandi");
      }
      setNewPasswordDraft("");
      setSuccessMessage("Kata sandi berhasil diperbarui.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mereset kata sandi");
    } finally {
      setIsResettingPassword(false);
    }
  }

  async function handleDeleteStaff() {
    if (!selected) return;
    if (!confirm(`Yakin ingin menghapus pengguna '${selected.username}'?`)) {
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/staff/${selected.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Gagal menghapus pengguna");
      }
      setMembers((prev) => prev.filter((m) => m.id !== selected.id));
      setSelected(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus pengguna");
    } finally {
      setSaving(false);
    }
  }

  const columns = [
    {
      key: "fullName",
      header: "Nama & Username",
      className: "w-56",
      render: (m: StaffMemberWithCapabilities) => (
        <div>
          <div className="text-sm font-semibold text-supporting-900">
            {m.fullName ?? m.username}
          </div>
          <div className="text-xs font-mono text-supporting-500">
            @{m.username}
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Peran / Role",
      className: "w-44",
      render: (m: StaffMemberWithCapabilities) => (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-supporting-700">
          <Shield className="h-3.5 w-3.5 text-accent-500" />
          {ROLE_LABELS[m.role]}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "w-32",
      render: (m: StaffMemberWithCapabilities) => (
        <span
          className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${STATUS_STYLES[m.status] ?? "border-supporting-200 bg-supporting-50 text-supporting-600"}`}
        >
          {m.status === "active" ? "Aktif" : "Nonaktif"}
        </span>
      ),
    },
    {
      key: "lastActiveAt",
      header: "Aktivitas Terakhir",
      className: "w-36",
      render: (m: StaffMemberWithCapabilities) => (
        <span className="text-xs text-supporting-500">
          {formatRelative(m.lastActiveAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      className: "w-24",
      render: (m: StaffMemberWithCapabilities) => (
        <button
          type="button"
          onClick={() => openDrawer(m)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-supporting-300 px-3 py-1.5 text-xs font-semibold text-supporting-800 tracking-tight transition-colors hover:bg-supporting-50"
        >
          Kelola
        </button>
      ),
    },
  ] as import("@/presentation/components/admin/DataTable").Column<StaffMemberWithCapabilities>[];

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setIsAddModalOpen(true);
            setAddError(null);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-950 px-4 py-2.5 text-xs font-semibold text-background-100 shadow-sm transition-all hover:bg-primary-900 active:scale-[0.98]"
        >
          <UserPlus className="h-4 w-4 text-accent-400" />
          Tambah Staf / Admin
        </button>
      </div>

      <div className="admin-panel overflow-hidden">
        <DataTable
          columns={columns}
          data={members}
          keyAccessor={(m) => m.id}
          emptyMessage="Tidak ada staf ditemukan"
        />
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="admin-panel w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-supporting-200 pb-4">
              <h3 className="text-base font-semibold text-supporting-900 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-accent-500" />
                Tambah Pengguna Staf / Admin
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-supporting-400 hover:text-supporting-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {addError && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                {addError}
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-supporting-600">
                  Username
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="contoh: ihsan / editor1"
                  required
                  autoCapitalize="none"
                  className="mt-1.5 block w-full rounded-xl border border-supporting-300 px-3.5 py-2.5 text-sm text-supporting-900 focus:border-primary-800 focus:outline-none focus:ring-1 focus:ring-primary-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-supporting-600">
                  Nama Lengkap (Opsional)
                </label>
                <input
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="contoh: Ihsan Fauzi"
                  className="mt-1.5 block w-full rounded-xl border border-supporting-300 px-3.5 py-2.5 text-sm text-supporting-900 focus:border-primary-800 focus:outline-none focus:ring-1 focus:ring-primary-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-supporting-600">
                  Peran / Hak Akses
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as ClerkOrgRole)}
                  className="mt-1.5 block w-full rounded-xl border border-supporting-300 px-3.5 py-2.5 text-sm text-supporting-900 focus:border-primary-800 focus:outline-none focus:ring-1 focus:ring-primary-800"
                >
                  {ALL_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-supporting-600">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
                  className="mt-1.5 block w-full rounded-xl border border-supporting-300 px-3.5 py-2.5 text-sm text-supporting-900 focus:border-primary-800 focus:outline-none focus:ring-1 focus:ring-primary-800"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-supporting-300 px-4 py-2.5 text-xs font-medium text-supporting-700 hover:bg-supporting-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-950 px-5 py-2.5 text-xs font-semibold text-background-100 hover:bg-primary-900 disabled:opacity-50"
                >
                  {isCreating ? "Menyimpan..." : "Daftarkan Pengguna"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail & Manage Drawer */}
      {selected && (
        <div
          className="fixed inset-0 z-40 flex justify-end bg-black/40"
          onClick={() => setSelected(null)}
        >
          <div
            className="admin-panel w-full max-w-md h-full overflow-y-auto rounded-none shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-supporting-200 p-6">
              <div>
                <h2 className="text-lg font-semibold text-supporting-900">
                  {selected.fullName ?? selected.username}
                </h2>
                <p className="font-mono text-xs text-supporting-500">
                  @{selected.username}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-supporting-400 hover:text-supporting-800 text-2xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {successMessage && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
                  {successMessage}
                </div>
              )}
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-800">
                  {error}
                </div>
              )}

              {/* Profile info */}
              <section>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-supporting-400 mb-3">
                  Informasi Akun
                </h3>
                <dl className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-supporting-500">Status</dt>
                    <dd className="font-semibold text-supporting-900">
                      {selected.status === "active" ? "Aktif" : "Nonaktif"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-supporting-500">Aktivitas Terakhir</dt>
                    <dd className="text-supporting-900">
                      {formatRelative(selected.lastActiveAt)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-supporting-500">Dibuat Pada</dt>
                    <dd className="text-supporting-900">
                      {new Date(selected.createdAt).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={toggleStatus}
                    disabled={saving}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors ${
                      selected.status === "active"
                        ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {selected.status === "active" ? (
                      <>
                        <UserX className="h-4 w-4" /> Nonaktifkan Akun
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4" /> Aktifkan Akun
                      </>
                    )}
                  </button>
                </div>
              </section>

              {/* Role Setting */}
              <section className="border-t border-supporting-200 pt-5">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-supporting-400 mb-3">
                  Peran / Role
                </h3>
                <select
                  value={roleDraft}
                  onChange={(e) => setRoleDraft(e.target.value as ClerkOrgRole)}
                  className="w-full rounded-xl border border-supporting-300 bg-supporting-50 px-3.5 py-2 text-xs font-semibold text-supporting-800 tracking-tight focus:border-primary-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-800 transition-colors"
                >
                  {ALL_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={saveRole}
                  disabled={saving || !roleDraft || roleDraft === selected.role}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary-950 px-4 py-2.5 text-xs font-semibold text-background-100 tracking-tight transition-colors hover:bg-primary-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Menyimpan..." : "Simpan Peran"}
                </button>
              </section>

              {/* Reset Password */}
              <section className="border-t border-supporting-200 pt-5">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-supporting-400 mb-3 flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-accent-500" />
                  Reset Kata Sandi
                </h3>
                <div className="space-y-2">
                  <input
                    type="password"
                    placeholder="Kata sandi baru (min. 6 karakter)"
                    value={newPasswordDraft}
                    onChange={(e) => setNewPasswordDraft(e.target.value)}
                    className="w-full rounded-xl border border-supporting-300 px-3.5 py-2 text-xs text-supporting-900 focus:border-primary-800 focus:outline-none focus:ring-1 focus:ring-primary-800"
                  />
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={
                      isResettingPassword || newPasswordDraft.length < 6
                    }
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-supporting-300 bg-supporting-50 px-4 py-2 text-xs font-semibold text-supporting-800 hover:bg-supporting-100 disabled:opacity-50"
                  >
                    {isResettingPassword ? "Memproses..." : "Ganti Kata Sandi"}
                  </button>
                </div>
              </section>

              {/* Capabilities List */}
              <section className="border-t border-supporting-200 pt-5">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-supporting-400 mb-3">
                  Capabilities ({selected.capabilities.length})
                </h3>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                  {selected.capabilities.length === 0 ? (
                    <span className="text-xs text-supporting-500">
                      Tidak ada capabilities
                    </span>
                  ) : (
                    selected.capabilities.map((cap) => (
                      <span
                        key={cap}
                        className="inline-flex rounded-md border border-supporting-200 bg-supporting-50 px-2 py-1 text-[10px] font-mono text-supporting-700"
                      >
                        {cap}
                      </span>
                    ))
                  )}
                </div>
              </section>

              {/* Delete Account */}
              <section className="border-t border-supporting-200 pt-5">
                <button
                  type="button"
                  onClick={handleDeleteStaff}
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/50 px-4 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-100/70"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus Pengguna
                </button>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
