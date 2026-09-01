import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getOperationalAnalytics } from "@/application/analytics/operational-analytics";

export default async function AdminAnalyticsPage() {
  await requireStaffActor("analytics:read");
  const analytics = await getOperationalAnalytics();
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Analytics & Operations"
        description="Privacy-safe operational signals without invented business KPIs."
      />
      <div className="admin-panel border-accent-200 bg-accent-50 px-4 py-3 text-xs text-accent-800">
        Analytics provider, consent mechanism, retention, KPI targets, and
        reporting ownership are not selected. Business metrics remain `UNKNOWN`.
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {Object.entries(analytics.kpis).map(([key, value]) => (
          <div key={key} className="admin-panel p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-supporting-400">
              {key}
            </p>
            <p className="mt-2.5 font-mono text-lg leading-none tracking-tight text-supporting-900">
              {value.state.toUpperCase()}
            </p>
            <p className="mt-2 text-xs text-supporting-500">{value.detail}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Customers", analytics.operational.commerce.customerCount],
          ["Paid orders", analytics.operational.commerce.paidOrderCount],
          ["Zero stock", analytics.operational.commerce.zeroStockCount],
          [
            "Critical alerts",
            analytics.operational.notifications.criticalUnreadCount,
          ],
        ].map(([label, value]) => (
          <div key={String(label)} className="admin-panel p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-supporting-400">
              {label}
            </p>
            <p className="mt-2.5 font-mono text-lg leading-none tracking-tight text-supporting-900">
              {value}
            </p>
            <p className="mt-1.5 text-[11px] text-supporting-500">
              Authoritative operational source
            </p>
          </div>
        ))}
      </div>
      <div className="admin-panel overflow-hidden">
        <div className="border-b border-supporting-200 px-5 py-4">
          <h2 className="text-sm font-medium text-supporting-900">
            Orders Created, Last 7 Days
          </h2>
        </div>
        <div className="grid grid-cols-7 gap-px bg-supporting-100">
          {analytics.operational.commerce.orderTrend7d.map((item) => (
            <div
              key={item.date}
              className="flex flex-col items-center bg-white p-3 text-center"
            >
              <p className="text-[10px] text-supporting-400">
                {item.date.slice(5)}
              </p>
              <p className="mt-2 font-mono text-base font-semibold text-supporting-900">
                {item.orders}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="admin-panel p-5">
        <h2 className="text-sm font-medium text-supporting-900">
          Operational Sources
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-supporting-500">
          Content, gallery, redirects, and notifications are shown from
          first-party health sources. They are not marketing analytics.
        </p>
        <pre className="mt-4 overflow-auto rounded-lg border border-supporting-200 bg-supporting-50 p-4 text-[11px] font-mono text-supporting-700">
          {JSON.stringify(analytics.operational, null, 2)}
        </pre>
      </div>
    </div>
  );
}
