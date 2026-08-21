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
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        Analytics provider, consent mechanism, retention, KPI targets, and
        reporting ownership are not selected. Business metrics remain `UNKNOWN`.
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(analytics.kpis).map(([key, value]) => (
          <div
            key={key}
            className="rounded-2xl border border-gray-200 bg-white p-5"
          >
            <p className="text-xs uppercase text-gray-500">{key}</p>
            <p className="mt-2 font-mono text-2xl">
              {value.state.toUpperCase()}
            </p>
            <p className="mt-2 text-xs text-gray-500">{value.detail}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Customers", analytics.operational.commerce.customerCount],
          ["Paid orders", analytics.operational.commerce.paidOrderCount],
          ["Zero stock", analytics.operational.commerce.zeroStockCount],
          [
            "Critical alerts",
            analytics.operational.notifications.criticalUnreadCount,
          ],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-2xl border border-gray-200 bg-white p-5"
          >
            <p className="text-xs uppercase text-gray-500">{label}</p>
            <p className="mt-2 font-mono text-2xl">{value}</p>
            <p className="mt-1 text-xs text-gray-500">
              Authoritative operational source
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="font-semibold">Orders Created, Last 7 Days</h2>
        <div className="mt-4 grid grid-cols-7 gap-2">
          {analytics.operational.commerce.orderTrend7d.map((item) => (
            <div
              key={item.date}
              className="rounded-xl bg-gray-50 p-3 text-center"
            >
              <p className="text-[10px] text-gray-500">{item.date.slice(5)}</p>
              <p className="mt-2 font-mono text-lg font-semibold">
                {item.orders}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="font-semibold">Operational Sources</h2>
        <p className="mt-2 text-sm text-gray-600">
          Content, gallery, redirects, and notifications are shown from
          first-party health sources. They are not marketing analytics.
        </p>
        <pre className="mt-4 overflow-auto rounded-xl bg-gray-950 p-4 text-xs text-gray-100">
          {JSON.stringify(analytics.operational, null, 2)}
        </pre>
      </div>
    </div>
  );
}
