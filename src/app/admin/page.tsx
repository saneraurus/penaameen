import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { WorkQueueCard } from "@/presentation/components/admin/WorkQueueCard";
import Link from "next/link";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getOrderStatusCounts } from "@/lib/admin/orders";

export default async function AdminDashboardPage() {
  void (await requireStaffActor("orders:read"));
  const counts = await getOrderStatusCounts();

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Dashboard"
        description="Overview of operational work queues and exceptions"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <WorkQueueCard
          title="Orders Awaiting Payment Review"
          count={counts.paymentPending}
          description="Orders with pending or unverified payments requiring manual review"
          href="/admin/orders?paymentStatus=pending"
          icon="💳"
          variant="warning"
        />
        <WorkQueueCard
          title="Ready for Fulfillment"
          count={counts.fulfillmentReady}
          description="Paid orders ready to be packed and shipped"
          href="/admin/orders?paymentStatus=paid&fulfillmentStatus=unfulfilled"
          icon="📦"
        />
        <WorkQueueCard
          title="Blocked / Exception Orders"
          count={counts.blocked}
          description="Orders with payment failures, stock issues, or other blockers"
          href="/admin/orders?status=cancelled"
          icon="⚠️"
          variant="critical"
        />
        <WorkQueueCard
          title="Low Stock Products"
          count={0}
          description="Products below configured stock threshold"
          href="/admin/products?filter=low_stock"
          icon="📉"
          variant="warning"
        />
        <WorkQueueCard
          title="SEO Warnings"
          count={0}
          description="Products or content with missing or invalid SEO metadata"
          href="/admin/seo?filter=warnings"
          icon="🔍"
        />
        <WorkQueueCard
          title="Content Drafts"
          count={0}
          description="Articles or pages in draft status awaiting review"
          href="/admin/content?filter=draft"
          icon="📝"
        />
      </div>

      <div className="mt-8">
        <AdminHeader
          title="Quick Actions"
          description="Common administrative tasks"
        />
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/admin/products/new"
            className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-1">➕</div>
            <h3 className="font-medium text-gray-900">Add New Product</h3>
            <p className="text-sm text-gray-500 mt-1">
              Create a new product listing
            </p>
          </Link>
          <Link
            href="/admin/orders"
            className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-1">🧾</div>
            <h3 className="font-medium text-gray-900">View All Orders</h3>
            <p className="text-sm text-gray-500 mt-1">
              Browse and manage orders
            </p>
          </Link>
          <Link
            href="/admin/settings/access"
            className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-1">👥</div>
            <h3 className="font-medium text-gray-900">Manage Staff</h3>
            <p className="text-sm text-gray-500 mt-1">
              Invite and configure team access
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
