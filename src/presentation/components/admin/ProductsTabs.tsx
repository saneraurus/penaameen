"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Daftar Produk", href: "/admin/products" },
  { name: "Manage Stocks", href: "/admin/products/stocks" },
] as const;

export function ProductsTabs() {
  const pathname = usePathname();

  return (
    <div
      role="tablist"
      aria-label="Navigasi kelola produk"
      className="inline-flex items-center gap-1 p-1 bg-gray-100 border border-gray-200 rounded-xl"
    >
      {tabs.map((tab) => {
        const isActive =
          pathname === tab.href ||
          (tab.href !== "/admin/products" && pathname.startsWith(tab.href));
        return (
          <Link
            key={tab.href}
            href={tab.href}
            role="tab"
            aria-selected={isActive}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? "bg-white text-primary-700 shadow-sm border border-gray-200"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
