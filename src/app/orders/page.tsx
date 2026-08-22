"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import {
  ActionLink,
  EmptyState,
  SceneIndex,
  SectionHeading,
  Shell,
  Skeleton,
} from "@/components/ui/primitives";

interface OrderItem {
  id: string;
  quantity: number;
  price: string | number;
  subtotal: string | number;
  product: { name: string; image: string } | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal?: string | number;
  shippingCost?: string | number;
  total: string | number;
  createdAt: string;
  trackingNumber?: string;
  shippingMethod?: string;
  shippingAddress?: {
    recipientName: string;
    city: string;
    province?: string;
    addressLine1?: string;
    phone?: string;
  };
  items: OrderItem[];
}

/** Normalized order state. Text always carries the meaning. */
const statusConfig: Record<string, { label: string; accent: string }> = {
  PENDING_PAYMENT: {
    label: "Menunggu Pembayaran",
    accent: "bg-accent-500",
  },
  PAID: {
    label: "Pembayaran Terverifikasi",
    accent: "bg-primary-500",
  },
  PROCESSING: {
    label: "Sedang Dikemas di Gudang",
    accent: "bg-primary-600",
  },
  SHIPPED: {
    label: "Dalam Pengiriman",
    accent: "bg-primary-700",
  },
  DELIVERED: {
    label: "Pesanan Selesai",
    accent: "bg-primary-800",
  },
  CANCELLED: {
    label: "Dibatalkan",
    accent: "bg-red-500",
  },
};

export default function OrdersPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [expandedOrderIds, setExpandedOrderIds] = useState<
    Record<string, boolean>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedOrderIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect_url=" + encodeURIComponent("/orders"));
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!isSignedIn) return;

    async function loadOrders() {
      // Only the server is authoritative for order history.
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          const apiOrders = data.orders ?? [];
          if (apiOrders.length > 0) {
            setOrders(apiOrders);
            localStorage.setItem(
              "penaameen_orders_history",
              JSON.stringify(apiOrders),
            );
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Fallback below
      }

      setOrders([]);
      setIsLoading(false);
    }

    loadOrders();
    const interval = setInterval(loadOrders, 4000);
    window.addEventListener("focus", loadOrders);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", loadOrders);
    };
  }, [isSignedIn]);

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "UNPAID") return order.status === "PENDING_PAYMENT";
    if (activeFilter === "PACKING")
      return order.status === "PROCESSING" || order.status === "PAID";
    if (activeFilter === "SHIPPED") return order.status === "SHIPPED";
    if (activeFilter === "COMPLETED") return order.status === "DELIVERED";
    return true;
  });

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-background-50">
        <Shell className="py-16 sm:py-24">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-6 h-12 w-80" />
          <div className="mt-14 space-y-5">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <p className="sr-only" role="status">
            Memuat daftar pesanan Anda...
          </p>
        </Shell>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-50 pb-20">
      {/* Masthead */}
      <header className="border-b border-supporting-200 bg-white">
        <Shell className="py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs text-supporting-500">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-primary-900"
                >
                  Beranda
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-supporting-800">Akun Saya</li>
            </ol>
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <SceneIndex index="01" label="Pesanan" />
              <SectionHeading level={1} className="mt-5">
                Pesanan Saya &amp; Tracking Resi
              </SectionHeading>
              <p className="mt-5 text-sm leading-relaxed text-supporting-600">
                Lacak status pengiriman buku dan paket belajar Pena Ameen Anda
                secara real-time.
              </p>
            </div>

            <ActionLink href="/produk" tone="outline">
              + Belanja Produk Lain
            </ActionLink>
          </div>

          {/* Filters */}
          <div className="scrollbar-none mt-10 flex items-center gap-6 overflow-x-auto pb-1">
            {[
              { id: "ALL", label: `Semua (${orders.length})` },
              { id: "UNPAID", label: "Belum Bayar" },
              { id: "PACKING", label: "Sedang Dikemas" },
              { id: "SHIPPED", label: "Dalam Pengiriman" },
              { id: "COMPLETED", label: "Selesai" },
            ].map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  aria-pressed={isActive}
                  className={`relative whitespace-nowrap py-2 text-sm transition-colors ${
                    isActive
                      ? "text-primary-900"
                      : "text-supporting-500 hover:text-primary-900"
                  }`}
                >
                  {tab.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 h-px origin-left bg-accent-600 transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </Shell>
      </header>

      <main>
        <Shell className="py-12 sm:py-16">
          {error && (
            <p role="alert" className="mb-6 text-sm text-red-700">
              {error}
            </p>
          )}

          {filteredOrders.length === 0 ? (
            <EmptyState
              title="Tidak Ada Pesanan Ditemukan"
              description={
                activeFilter === "ALL"
                  ? "Anda belum pernah membuat pesanan di Pena Ameen."
                  : "Tidak ada pesanan pada kategori filter ini."
              }
              action={
                <ActionLink href="/produk" tone="ink">
                  Mulai Belanja Sekarang
                </ActionLink>
              }
            />
          ) : (
            <div className="mx-auto max-w-4xl">
              <ul className="border-t border-supporting-200">
                {filteredOrders.map((order) => {
                  const cfg = statusConfig[order.status] || {
                    label: order.status,
                    accent: "bg-supporting-400",
                  };

                  const isExpanded = expandedOrderIds[order.id];
                  const uniqueItemsCount = order.items?.length || 1;
                  const totalPieces =
                    order.items?.reduce(
                      (s, i) => s + (Number(i.quantity) || 1),
                      0,
                    ) || 1;

                  return (
                    <li
                      key={order.id}
                      className="border-b border-supporting-200 py-8"
                    >
                      {/* Header */}
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <span className="block font-mono text-sm font-medium text-supporting-900">
                            {order.orderNumber}
                          </span>
                          <span className="mt-1 block text-[11px] text-supporting-400">
                            {new Date(order.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          {order.trackingNumber &&
                            order.status !== "PENDING_PAYMENT" && (
                              <span className="font-mono text-[11px] text-supporting-500">
                                Resi: {order.trackingNumber}
                              </span>
                            )}
                          <span className="inline-flex items-center gap-2 text-xs font-medium text-supporting-800">
                            <span
                              aria-hidden="true"
                              className={`h-1.5 w-1.5 rounded-full ${cfg.accent}`}
                            />
                            {cfg.label}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <ul className="mt-6 space-y-3">
                        {order.items?.map((item, idx) => {
                          if (!isExpanded && idx > 0) return null;

                          return (
                            <li
                              key={item.id || idx}
                              className="flex items-center justify-between gap-4"
                            >
                              <div className="min-w-0">
                                <p className="truncate text-sm text-supporting-900">
                                  {item.product?.name || "Produk Pena Ameen"}
                                </p>
                                <p className="mt-0.5 text-[11px] text-supporting-500">
                                  {item.quantity} unit · Rp
                                  {Number(item.price || 0).toLocaleString(
                                    "id-ID",
                                  )}
                                </p>
                              </div>
                              <span className="shrink-0 font-mono text-xs text-supporting-700">
                                Rp
                                {Number(
                                  item.subtotal ||
                                    Number(item.price) * Number(item.quantity),
                                ).toLocaleString("id-ID")}
                              </span>
                            </li>
                          );
                        })}
                      </ul>

                      {uniqueItemsCount > 1 && (
                        <button
                          type="button"
                          onClick={() => toggleExpand(order.id)}
                          aria-expanded={Boolean(isExpanded)}
                          className="mt-4 text-xs font-medium text-primary-800 underline-offset-4 transition-colors hover:text-accent-700 hover:underline"
                        >
                          {isExpanded
                            ? "Tutup Rincian Produk"
                            : `Lihat Semua (${uniqueItemsCount} Macam Produk, ${totalPieces} Item Total)`}
                        </button>
                      )}

                      {/* Footer */}
                      <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-supporting-100 pt-5">
                        <p className="text-xs text-supporting-500">
                          Total Tagihan:{" "}
                          <strong className="font-mono text-sm text-supporting-900">
                            Rp{Number(order.total).toLocaleString("id-ID")}
                          </strong>
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                          {order.status === "PENDING_PAYMENT" ? (
                            <>
                              <Link
                                href={`/orders/${order.id}`}
                                className="inline-flex min-h-10 items-center rounded-full bg-accent-600 px-5 text-xs font-medium text-white transition-colors hover:bg-accent-700"
                              >
                                Bayar Sekarang
                              </Link>
                              <Link
                                href={`/orders/${order.id}`}
                                className="inline-flex min-h-10 items-center rounded-full border border-supporting-300 px-4 text-xs font-medium text-supporting-700 transition-colors hover:border-primary-700 hover:text-primary-900"
                              >
                                Detail
                              </Link>
                            </>
                          ) : (
                            <Link
                              href={`/orders/${order.id}`}
                              className="group inline-flex items-center gap-2 text-xs font-medium text-primary-800 transition-colors hover:text-accent-700"
                            >
                              <span className="border-b border-current pb-0.5">
                                Lacak Pesanan &amp; Invoice
                              </span>
                              <span
                                aria-hidden="true"
                                className="transition-transform duration-200 group-hover:translate-x-1"
                              >
                                →
                              </span>
                            </Link>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </Shell>
      </main>
    </div>
  );
}
