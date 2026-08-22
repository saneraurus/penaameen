"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/admin", group: "Operasi" },
  { name: "Products", href: "/admin/products", group: "Katalog" },
  { name: "Orders", href: "/admin/orders", group: "Operasi" },
  { name: "Customers", href: "/admin/customers", group: "Operasi" },
  { name: "Payments", href: "/admin/payments", group: "Keuangan" },
  { name: "Fulfillment", href: "/admin/fulfillment", group: "Operasi" },
  { name: "Media", href: "/admin/media", group: "Katalog" },
  { name: "Redirects", href: "/admin/seo/redirects", group: "Konten" },
  { name: "Analytics", href: "/admin/analytics", group: "Keuangan" },
  { name: "Notifications", href: "/admin/notifications", group: "Sistem" },
  { name: "Audit Log", href: "/admin/audit", group: "Sistem" },
  {
    name: "Emergency Controls",
    href: "/admin/system-controls",
    group: "Sistem",
  },
  { name: "API Access", href: "/admin/api-access", group: "Sistem" },
  { name: "Settings", href: "/admin/settings/access", group: "Sistem" },
] as const;

const groupOrder = [
  "Operasi",
  "Katalog",
  "Keuangan",
  "Konten",
  "Sistem",
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActiveHref = (href: string) =>
    pathname === href || (href !== "/admin" && pathname.startsWith(href));

  const activeItem = navigation.find((item) => isActiveHref(item.href));

  const navList = (
    <nav aria-label="Admin navigation" className="space-y-7">
      {groupOrder.map((group) => {
        const items = navigation.filter((item) => item.group === group);
        if (items.length === 0) return null;

        return (
          <div key={group}>
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
              {group}
            </p>
            <ul className="mt-2.5 space-y-0.5">
              {items.map((item) => {
                const isActive = isActiveHref(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative flex items-center rounded-md px-3 py-2.5 text-sm transition-colors ${
                        isActive
                          ? "bg-white/10 font-medium text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-accent-400"
                        />
                      )}
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile operations bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-white/10 bg-[#0b1310] px-4 py-3 text-white lg:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <span className="relative block h-7 w-24 shrink-0 brightness-0 invert">
            <Image
              src="/images/logo.png"
              alt="Penerbit Pena Ameen"
              fill
              className="object-contain object-left"
              unoptimized
            />
          </span>
          <span className="truncate text-xs text-white/50">
            {activeItem?.name ?? "Admin"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <UserButton />
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="admin-mobile-nav"
            className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-white/80 transition-colors hover:bg-white/10"
          >
            {isOpen ? "Tutup" : "Menu"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          id="admin-mobile-nav"
          className="animate-fade-in sticky top-[3.25rem] z-30 max-h-[70vh] overflow-y-auto border-b border-white/10 bg-[#0b1310] px-4 py-5 text-white lg:hidden"
        >
          {navList}
        </div>
      )}

      {/* Desktop rail */}
      <aside className="admin-rail sticky top-0 hidden h-screen w-64 shrink-0 flex-col lg:flex">
        <div className="px-5 py-6">
          <div className="flex items-center justify-between gap-3">
            <span className="relative block h-8 w-32 brightness-0 invert">
              <Image
                src="/images/logo.png"
                alt="Penerbit Pena Ameen"
                fill
                className="object-contain object-left"
                unoptimized
              />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-400">
              Admin
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-6">{navList}</div>

        <div className="border-t border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <UserButton />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white">
                Admin Session
              </p>
              <p className="truncate text-[11px] text-white/45">PENA AMEEN</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
