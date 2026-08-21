"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: "📊" },
  { name: "Products", href: "/admin/products", icon: "📦" },
  { name: "Orders", href: "/admin/orders", icon: "🧾" },
  { name: "Customers", href: "/admin/customers", icon: "👥" },
  { name: "Payments", href: "/admin/payments", icon: "💳" },
  { name: "Fulfillment", href: "/admin/fulfillment", icon: "🚚" },
  { name: "Media", href: "/admin/media", icon: "🖼️" },
  { name: "Redirects", href: "/admin/seo/redirects", icon: "🔁" },
  { name: "Analytics", href: "/admin/analytics", icon: "📈" },
  { name: "Notifications", href: "/admin/notifications", icon: "🔔" },
  { name: "Audit Log", href: "/admin/audit", icon: "📜" },
  { name: "Emergency Controls", href: "/admin/system-controls", icon: "🛑" },
  { name: "API Access", href: "/admin/api-access", icon: "🔌" },
  { name: "Settings", href: "/admin/settings/access", icon: "⚙️" },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="relative w-40 h-10">
            <Image
              src="/images/logo.png"
              alt="Penerbit Pena Ameen"
              fill
              className="object-contain object-left"
              unoptimized
            />
          </div>
          <span className="text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-200 uppercase tracking-wider">
            Admin
          </span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserButton />
            <div className="text-xs">
              <p className="font-semibold text-gray-900 leading-tight">
                Admin Session
              </p>
              <p className="text-[11px] text-gray-500">PENA AMEEN</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
