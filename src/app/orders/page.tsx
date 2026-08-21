"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

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

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; icon: string }
> = {
  PENDING_PAYMENT: {
    label: "Menunggu Pembayaran",
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    icon: "⏳",
  },
  PAID: {
    label: "Pembayaran Terverifikasi",
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    icon: "💳",
  },
  PROCESSING: {
    label: "Sedang Dikemas di Gudang",
    bg: "bg-indigo-50 border-indigo-200",
    text: "text-indigo-700",
    icon: "📦",
  },
  SHIPPED: {
    label: "Dalam Pengiriman",
    bg: "bg-purple-50 border-purple-200",
    text: "text-purple-700",
    icon: "🚚",
  },
  DELIVERED: {
    label: "Pesanan Selesai",
    bg: "bg-emerald-50 border-emerald-300",
    text: "text-emerald-800",
    icon: "✅",
  },
  CANCELLED: {
    label: "Dibatalkan",
    bg: "bg-red-50 border-red-200",
    text: "text-red-700",
    icon: "✕",
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
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto" />
          <p className="text-supporting-600 text-xs font-semibold">
            Memuat daftar pesanan Anda...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-50 pb-20">
      {/* Top Section */}
      <section className="bg-white border-b border-supporting-200/80 py-8 shadow-2xs">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-supporting-500 mb-1.5 font-medium">
                <Link href="/" className="hover:text-primary-600">
                  Beranda
                </Link>
                <span>/</span>
                <span className="text-primary-800 font-semibold">
                  Akun Saya
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary-950">
                Pesanan Saya & Tracking Resi
              </h1>
              <p className="text-xs text-supporting-500 mt-1">
                Lacak status pengiriman buku dan paket belajar Pena Ameen Anda
                secara real-time.
              </p>
            </div>

            <Link
              href="/produk"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-xl text-xs font-semibold border border-primary-200/80 transition-colors self-start"
            >
              <span>+ Belanja Produk Lain</span>
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none text-xs">
            {[
              { id: "ALL", label: `Semua (${orders.length})` },
              { id: "UNPAID", label: "Belum Bayar" },
              { id: "PACKING", label: "Sedang Dikemas" },
              { id: "SHIPPED", label: "Dalam Pengiriman" },
              { id: "COMPLETED", label: "Selesai" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeFilter === tab.id
                    ? "bg-primary-600 text-white shadow-xs"
                    : "bg-supporting-100/80 text-supporting-600 hover:bg-supporting-200/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container px-4 mx-auto py-8">
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {filteredOrders.length === 0 ? (
          <div className="max-w-md mx-auto py-16 text-center bg-white rounded-3xl border border-supporting-200 p-8 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-supporting-100 flex items-center justify-center mx-auto mb-4 text-2xl text-supporting-400">
              📦
            </div>
            <h3 className="text-lg font-serif font-bold text-primary-950 mb-1">
              Tidak Ada Pesanan Ditemukan
            </h3>
            <p className="text-supporting-500 text-xs mb-6 leading-relaxed">
              {activeFilter === "ALL"
                ? "Anda belum pernah membuat pesanan di Pena Ameen."
                : "Tidak ada pesanan pada kategori filter ini."}
            </p>
            <Link
              href="/produk"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-primary-900/10"
            >
              Mulai Belanja Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {filteredOrders.map((order) => {
              const cfg = statusConfig[order.status] || {
                label: order.status,
                bg: "bg-supporting-100",
                text: "text-supporting-700",
                icon: "📦",
              };

              const isExpanded = expandedOrderIds[order.id];
              const uniqueItemsCount = order.items?.length || 1;
              const totalPieces =
                order.items?.reduce(
                  (s, i) => s + (Number(i.quantity) || 1),
                  0,
                ) || 1;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-supporting-200/80 p-5 md:p-6 shadow-2xs hover:shadow-md transition-all duration-200"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-supporting-100">
                    <div className="flex items-center gap-3">
                      <span className="text-base">{cfg.icon}</span>
                      <div>
                        <span className="text-xs font-mono font-bold text-primary-950 block">
                          {order.orderNumber}
                        </span>
                        <span className="text-[11px] text-supporting-400">
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
                    </div>

                    <div className="flex items-center gap-2">
                      {order.trackingNumber &&
                        order.status !== "PENDING_PAYMENT" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary-50 text-primary-700 border border-primary-100">
                            Resi: {order.trackingNumber}
                          </span>
                        )}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.text}`}
                      >
                        {cfg.label}
                      </span>
                    </div>
                  </div>

                  {/* Body Content (Summary or Expanded) */}
                  <div className="py-4 space-y-3">
                    {/* Items List */}
                    <div className="divide-y divide-supporting-100">
                      {order.items?.map((item, idx) => {
                        // If not expanded and not first item, hide on collapsed mode
                        if (!isExpanded && idx > 0) return null;

                        return (
                          <div
                            key={item.id || idx}
                            className="py-2.5 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-12 h-12 rounded-xl bg-supporting-100 flex items-center justify-center text-xl shrink-0 border border-supporting-200">
                                📖
                              </div>
                              <div className="truncate">
                                <h4 className="text-xs font-bold text-primary-950 truncate">
                                  {item.product?.name || "Produk Pena Ameen"}
                                </h4>
                                <p className="text-[11px] text-supporting-500 mt-0.5">
                                  {item.quantity} unit • Rp
                                  {Number(item.price || 0).toLocaleString(
                                    "id-ID",
                                  )}
                                </p>
                              </div>
                            </div>

                            <span className="text-xs font-mono font-bold text-primary-800 shrink-0">
                              Rp
                              {Number(
                                item.subtotal ||
                                  Number(item.price) * Number(item.quantity),
                              ).toLocaleString("id-ID")}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Toggle Dropdown Button for Multi-Items */}
                    {uniqueItemsCount > 1 && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(order.id)}
                        className="text-xs font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1.5 pt-1 cursor-pointer"
                      >
                        <span>
                          {isExpanded
                            ? "▴ Tutup Rincian Produk"
                            : `▾ Lihat Semua (${uniqueItemsCount} Macam Produk, ${totalPieces} Item Total)`}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Footer Actions & Summary */}
                  <div className="pt-3.5 border-t border-supporting-100/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[11px] text-supporting-500">
                      <span>Total Tagihan: </span>
                      <strong className="text-sm font-mono text-primary-900 font-bold">
                        Rp{Number(order.total).toLocaleString("id-ID")}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status === "PENDING_PAYMENT" ? (
                        <>
                          <Link
                            href={`/orders/${order.id}`}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                          >
                            <span>💳</span>
                            <span>Bayar Sekarang</span>
                          </Link>
                          <Link
                            href={`/orders/${order.id}`}
                            className="px-3 py-2 border border-supporting-200 hover:bg-supporting-50 text-supporting-700 rounded-xl text-xs font-semibold transition-all"
                          >
                            Detail
                          </Link>
                        </>
                      ) : (
                        <Link
                          href={`/orders/${order.id}`}
                          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <span>Lacak Pesanan & Invoice</span>
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
