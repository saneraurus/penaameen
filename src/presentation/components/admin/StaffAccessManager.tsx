"use client";

import { useState } from "react";
import { DataTable } from "@/presentation/components/admin/DataTable";
import type { StaffMemberWithCapabilities } from "@/lib/admin/staff";
import type { ClerkOrgRole } from "@/application/auth/clerk-auth";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  invited: "bg-yellow-100 text-yellow-700",
  revoked: "bg-red-100 text-red-700",
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
  if (!iso) return "Never";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
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

  function openDrawer(member: StaffMemberWithCapabilities) {
    setSelected(member);
    setRoleDraft(member.role);
    setError(null);
  }

  async function saveRole() {
    if (!selected || !roleDraft || roleDraft === selected.role) return;
    setSaving(true);
    setError(null);
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role");
    } finally {
      setSaving(false);
    }
  }

  const columns = [
    {
      key: "fullName",
      header: "Name",
      className: "w-48",
      render: (m: StaffMemberWithCapabilities) => (
        <div>
          <div className="text-gray-900 font-medium">{m.fullName ?? "—"}</div>
          <div className="text-xs text-gray-500">{m.email}</div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      className: "w-44",
      render: (m: StaffMemberWithCapabilities) => (
        <span className="text-gray-700">{ROLE_LABELS[m.role]}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "w-32",
      render: (m: StaffMemberWithCapabilities) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_STYLES[m.status] ?? "bg-gray-100 text-gray-700"}`}
        >
          {m.status}
        </span>
      ),
    },
    {
      key: "lastActiveAt",
      header: "Last Active",
      className: "w-32",
      render: (m: StaffMemberWithCapabilities) => (
        <span className="text-gray-600">{formatRelative(m.lastActiveAt)}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-24",
      render: (m: StaffMemberWithCapabilities) => (
        <button
          type="button"
          onClick={() => openDrawer(m)}
          className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          View
        </button>
      ),
    },
  ] as import("@/presentation/components/admin/DataTable").Column<StaffMemberWithCapabilities>[];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={members}
          keyAccessor={(m) => m.id}
          emptyMessage="No staff members found"
        />
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-40 flex justify-end bg-black/30"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-md bg-white h-full overflow-y-auto p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selected.fullName ?? "—"}
                </h2>
                <p className="text-sm text-gray-500">{selected.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <section className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Profile
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Status</dt>
                  <dd className="text-gray-900">{selected.status}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Last active</dt>
                  <dd className="text-gray-900">
                    {formatRelative(selected.lastActiveAt)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Member ID</dt>
                  <dd className="text-gray-900 font-mono text-xs">
                    {selected.id}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Role</h3>
              <select
                value={roleDraft}
                onChange={(e) => setRoleDraft(e.target.value as ClerkOrgRole)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                className="mt-3 w-full px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Role"}
              </button>
              {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
            </section>

            <section>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Capabilities
              </h3>
              <div className="flex flex-wrap gap-2">
                {selected.capabilities.length === 0 ? (
                  <span className="text-sm text-gray-500">No capabilities</span>
                ) : (
                  selected.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full font-mono"
                    >
                      {cap}
                    </span>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
