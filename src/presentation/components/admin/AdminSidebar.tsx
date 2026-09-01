"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, UserCircle2 } from "lucide-react";
import type { StaffActor, ClerkOrgRole } from "@/application/auth/clerk-auth";

const ROLE_LABELS: Record<ClerkOrgRole, string> = {
  admin: "Administrator",
  product_manager: "Product Manager",
  order_manager: "Order Manager",
  fulfillment_manager: "Fulfillment Manager",
  content_manager: "Content Manager",
  seo_manager: "SEO Manager",
  customer_support: "Customer Support",
};

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

export function AdminSidebar({ staff }: { staff?: StaffActor | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActiveHref = (href: string) =>
    pathname === href || (href !== "/admin" && pathname.startsWith(href));

  const activeItem = navigation.find((item) => isActiveHref(item.href));

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  }

  const displayName =
    staff?.fullName || staff?.email?.replace(/@admin\.local$/, "") || "Admin";
  const roleName = staff?.orgRole
    ? ROLE_LABELS[staff.orgRole]
    : "Administrator";

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
      <div className="admin-rail sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-white lg:hidden">
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
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Keluar"
            aria-label="Keluar"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-white/15 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
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
          className="admin-rail animate-fade-in sticky top-[3.25rem] z-30 max-h-[70vh] overflow-y-auto border-b border-white/10 px-4 py-5 text-white lg:hidden"
        >
          {navList}
        </div>
      )}

      {/* Desktop rail */}
      <aside className="admin-rail hidden h-full min-h-0 w-64 shrink-0 flex-col lg:flex">
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

        <div className="flex-1 overflow-y-auto px-2 pb-6 scrollbar-none">
          {navList}
        </div>

        <div className="border-t border-white/10 px-4 py-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-400/20 text-accent-300">
                <UserCircle2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white">
                  {displayName}
                </p>
                <p className="truncate text-[10px] text-white/50">{roleName}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              title="Keluar"
              aria-label="Keluar dari sesi admin"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-colors hover:border-red-400/40 hover:bg-red-500/20 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
