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
      className="inline-flex items-center gap-1 p-1 bg-supporting-50 border border-supporting-200 rounded-lg"
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
            className={`px-3.5 py-1.5 text-xs font-semibold tracking-tight rounded-md transition-colors ${
              isActive
                ? "bg-white text-primary-800 border border-supporting-200 shadow-xs"
                : "text-supporting-600 hover:text-supporting-800"
            }`}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
