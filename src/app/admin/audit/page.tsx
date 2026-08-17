import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getAuditStore } from "@/infrastructure/audit";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  void (await requireStaffActor("audit:read"));
  const { events, total } = await getAuditStore().list({
    page: 1,
    perPage: 100,
  });

  const outcomeStyles: Record<string, string> = {
    succeeded: "bg-emerald-50 text-emerald-700 border-emerald-200",
    denied: "bg-amber-50 text-amber-700 border-amber-200",
    failed: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-gray-50 text-gray-600 border-gray-200",
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <AdminHeader
        title="Audit Log"
        description="Catatan append-only dari semua aksi sensitif: aktor, aksi, entitas, hasil, dan korelasi"
      />

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">
              Riwayat Aksi ({total} peristiwa)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Log tidak dapat diubah dari sisi aplikasi (append-only)
            </p>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">
            Belum ada peristiwa audit tercatat.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-3 font-semibold">Waktu</th>
                  <th className="px-5 py-3 font-semibold">Aktor</th>
                  <th className="px-5 py-3 font-semibold">Aksi</th>
                  <th className="px-5 py-3 font-semibold">Target</th>
                  <th className="px-5 py-3 font-semibold">Hasil</th>
                  <th className="px-5 py-3 font-semibold">Alasan / Korelasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50/70">
                    <td className="px-5 py-3 whitespace-nowrap text-xs text-gray-500">
                      {new Date(event.occurredAt).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-xs font-semibold text-gray-900">
                        {event.actorEmail ||
                          (event.actorKind === "system" ? "Sistem" : event.actorId)}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {event.actorRole || event.actorKind}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-gray-800">
                        {event.action}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-600">
                      <span className="font-medium">{event.targetType}</span>
                      <span className="text-gray-400"> / {event.targetId}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          outcomeStyles[event.outcome] ??
                          "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        {event.outcome}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500 max-w-[260px]">
                      {event.reason ? (
                        <span className="block truncate" title={event.reason}>
                          {event.reason}
                        </span>
                      ) : null}
                      {event.correlationId ? (
                        <span className="block font-mono text-[10px] text-gray-400">
                          {event.correlationId}
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}