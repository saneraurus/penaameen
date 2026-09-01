"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AdminOrder } from "@/lib/admin/orders";
import { ShippingLabelModal } from "@/presentation/components/admin/ShippingLabelModal";

interface AdminOrdersManagerProps {
  initialOrders: AdminOrder[];
  total: number;
  currentPage: number;
  perPage: number;
}

export function AdminOrdersManager({ initialOrders }: AdminOrdersManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<
    "ALL" | "READY_TO_PROCESS" | "UNPAID" | "PACKING" | "SHIPPED" | "COMPLETED"
  >("ALL");

  const [expandedOrderIds, setExpandedOrderIds] = useState<
    Record<string, boolean>
  >({});
  const [selectedOrderForPrint, setSelectedOrderForPrint] =
    useState<AdminOrder | null>(null);
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(
    null,
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state when props change (from router.refresh)
  useEffect(() => {
    setOrders(initialOrders);
    setLastRefreshedAt(new Date());
  }, [initialOrders]);

  const refreshData = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  // Real-time auto-polling every 10 seconds + on tab focus
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        refreshData();
      }
    }, 10000);

    const onFocus = () => {
      if (document.visibilityState === "visible") {
        refreshData();
      }
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [refreshData]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderIds((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  // 1. Confirm Manual Payment (For Bank Transfers / WA confirmation)
  const handleConfirmPaid = async (orderId: string) => {
    if (
      !confirm(
        "Konfirmasi bahwa pembayaran untuk pesanan ini telah diterima dan terverifikasi?",
      )
    )
      return;

    setProcessingOrderId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/transition`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transition: "mark_paid",
          evidence: "Konfirmasi pembayaran manual dari staf finance",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order || o : o)),
        );
        setToastMessage(
          `✓ Pembayaran #${orderId} berhasil dikonfirmasi! Pesanan kini siap diproses & dicetak resinya.`,
        );
        setTimeout(() => setToastMessage(null), 5000);
        router.refresh();
      }
    } catch {
      alert("Gagal mengonfirmasi pembayaran.");
    } finally {
      setProcessingOrderId(null);
    }
  };

  // 2. Mark Shipped
  const handleMarkShipped = async (orderId: string) => {
    setProcessingOrderId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/transition`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transition: "mark_shipped",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order || o : o)),
        );
        setToastMessage(
          `🚚 Pesanan #${orderId} telah ditandai 'Dalam Pengiriman'!`,
        );
        setTimeout(() => setToastMessage(null), 5000);
        router.refresh();
      }
    } catch {
      alert("Gagal mengupdate pengiriman.");
    } finally {
      setProcessingOrderId(null);
    }
  };

  // 3. Cancel Order
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) return;

    setProcessingOrderId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/transition`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transition: "cancel",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order || o : o)),
        );
        setToastMessage(`Pesanan #${orderId} telah dibatalkan.`);
        setTimeout(() => setToastMessage(null), 4000);
        router.refresh();
      }
    } catch {
      alert("Gagal membatalkan pesanan.");
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handlePrintLabel = (order: AdminOrder) => {
    if (order.paymentStatus !== "paid") {
      alert(
        "⚠️ Perhatian: Pesanan ini belum dibayar oleh pelanggan! Resi hanya dapat dicetak untuk pesanan yang telah lunas.",
      );
      return;
    }
    setSelectedOrderForPrint(order);
  };

  const onLabelPrinted = () => {
    if (!selectedOrderForPrint) return;
    setToastMessage(
      `Label untuk pesanan #${selectedOrderForPrint.orderNumber} siap dicetak. Status order tidak berubah tanpa aksi fulfillment yang tervalidasi.`,
    );
    setTimeout(() => setToastMessage(null), 5000);
    router.refresh();
  };

  // Tab Filtering Logic
  const readyToProcessCount = orders.filter(
    (o) =>
      o.paymentStatus === "paid" &&
      o.fulfillmentStatus === "unfulfilled" &&
      o.status !== "cancelled",
  ).length;

  const unpaidCount = orders.filter(
    (o) => o.paymentStatus === "pending" && o.status !== "cancelled",
  ).length;

  const packingCount = orders.filter(
    (o) => o.fulfillmentStatus === "fulfilled" && o.status !== "cancelled",
  ).length;

  const shippedCount = orders.filter(
    (o) => o.fulfillmentStatus === "shipped" && o.status !== "cancelled",
  ).length;

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "READY_TO_PROCESS")
      return (
        order.paymentStatus === "paid" &&
        order.fulfillmentStatus === "unfulfilled" &&
        order.status !== "cancelled"
      );
    if (activeTab === "UNPAID")
      return order.paymentStatus === "pending" && order.status !== "cancelled";
    if (activeTab === "PACKING")
      return (
        order.fulfillmentStatus === "fulfilled" && order.status !== "cancelled"
      );
    if (activeTab === "SHIPPED")
      return (
        order.fulfillmentStatus === "shipped" && order.status !== "cancelled"
      );
    if (activeTab === "COMPLETED")
      return (
        order.status === "completed" || order.fulfillmentStatus === "delivered"
      );
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="admin-panel border-accent-200 bg-accent-50 px-4 py-3 text-xs font-semibold text-accent-800 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <span aria-hidden="true">✓</span>
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-accent-700 hover:text-primary-800 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Live Sync Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-2 text-supporting-600">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPending ? "bg-accent-500" : "bg-emerald-400"}`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${isPending ? "bg-accent-600" : "bg-emerald-500"}`}
            />
          </span>
          <span className="text-[11px] font-medium">
            {isPending
              ? "Menyinkronkan data..."
              : `Live Sync aktif • Update terakhir: ${lastRefreshedAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`}
          </span>
        </div>

        <button
          type="button"
          onClick={refreshData}
          disabled={isPending}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-supporting-700 hover:text-supporting-900 bg-supporting-100 hover:bg-supporting-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer disabled:opacity-50"
          title="Refresh data pesanan sekarang"
        >
          <span className={isPending ? "animate-spin" : ""}>🔄</span>
          <span>Refresh</span>
        </button>
      </div>

      {/* Modern Workflow Status Tabs */}
      <div className="flex overflow-x-auto gap-1.5 p-1.5 bg-supporting-50 rounded-lg border border-supporting-200 scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("ALL")}
          className={`px-3.5 py-2 rounded-lg font-semibold tracking-tight transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "ALL"
              ? "bg-white text-supporting-900 border border-supporting-200"
              : "text-supporting-600 hover:text-supporting-800 hover:bg-white"
          }`}
        >
          <span>Semua Pesanan</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              activeTab === "ALL"
                ? "bg-supporting-100 text-supporting-700"
                : "bg-supporting-100 text-supporting-600"
            }`}
          >
            {orders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("READY_TO_PROCESS")}
          className={`px-3.5 py-2 rounded-lg font-semibold tracking-tight transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "READY_TO_PROCESS"
              ? "bg-primary-950 text-background-100"
              : "text-primary-800 hover:bg-primary-50"
          }`}
        >
          <span>Siap Diproses</span>
          {readyToProcessCount > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === "READY_TO_PROCESS"
                  ? "bg-white/20 text-background-50"
                  : "bg-primary-100 text-primary-800"
              }`}
            >
              {readyToProcessCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("UNPAID")}
          className={`px-3.5 py-2 rounded-lg font-semibold tracking-tight transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "UNPAID"
              ? "bg-accent-600 text-primary-950"
              : "text-accent-800 hover:bg-accent-50"
          }`}
        >
          <span>Menunggu Bayar</span>
          {unpaidCount > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === "UNPAID"
                  ? "bg-primary-950/15 text-primary-950"
                  : "bg-accent-100 text-accent-900"
              }`}
            >
              {unpaidCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("PACKING")}
          className={`px-3.5 py-2 rounded-lg font-semibold tracking-tight transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "PACKING"
              ? "bg-primary-800 text-background-100"
              : "text-primary-800 hover:bg-primary-50"
          }`}
        >
          <span>Sedang Dikemas</span>
          {packingCount > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === "PACKING"
                  ? "bg-white/20 text-background-50"
                  : "bg-primary-100 text-primary-800"
              }`}
            >
              {packingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("SHIPPED")}
          className={`px-3.5 py-2 rounded-lg font-semibold tracking-tight transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "SHIPPED"
              ? "bg-supporting-800 text-background-100"
              : "text-supporting-700 hover:bg-supporting-100"
          }`}
        >
          <span>Dalam Pengiriman</span>
          {shippedCount > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === "SHIPPED"
                  ? "bg-white/20 text-background-50"
                  : "bg-supporting-200 text-supporting-800"
              }`}
            >
              {shippedCount}
            </span>
          )}
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="admin-panel p-12 text-center text-supporting-500">
            <div className="text-2xl mb-2" aria-hidden="true">
              📋
            </div>
            <div className="text-sm font-medium text-supporting-800">
              Tidak ada pesanan pada kategori ini
            </div>
            <p className="mt-1 text-xs text-supporting-500">
              Pilih tab status lain untuk melihat daftar pesanan.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isExpanded = expandedOrderIds[order.id];
            const isPaid = order.paymentStatus === "paid";
            const isUnpaid = order.paymentStatus === "pending";
            const isCancelled = order.status === "cancelled";
            const isPacked =
              order.fulfillmentStatus === "fulfilled" ||
              order.fulfillmentStatus === "shipped" ||
              order.fulfillmentStatus === "delivered";
            const isShipped =
              order.fulfillmentStatus === "shipped" ||
              order.fulfillmentStatus === "delivered";

            const uniqueProductCount = order.items?.length || 1;
            const itemCount =
              order.items && order.items.length > 0
                ? order.items.reduce((s, i) => s + (i.quantity || 1), 0)
                : order.itemCount || 1;

            const carrier = order.fulfillmentHistory?.[0]?.carrier || null;
            const trackingNumber =
              order.fulfillmentHistory?.[0]?.trackingNumber || null;

            return (
              <div key={order.id} className="admin-panel overflow-hidden">
                {/* Header Banner for Unpaid Orders */}
                {isUnpaid && (
                  <div className="border-b border-accent-200 bg-accent-50 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-accent-800">
                    <div className="flex items-center gap-2">
                      <span aria-hidden="true">⏳</span>
                      <span>
                        <strong>Menunggu Pembayaran:</strong> Pelanggan belum
                        menyelesaikan transfer. Jangan kemas atau kirim paket
                        sebelum pembayaran lunas.
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-accent-800 bg-accent-100 px-2 py-0.5 rounded-md">
                      Belum Terbayar
                    </span>
                  </div>
                )}

                {/* Header Banner for Paid & Ready to Pack */}
                {isPaid && !isPacked && (
                  <div className="border-b border-primary-200 bg-primary-50 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-primary-800">
                    <div className="flex items-center gap-2">
                      <span aria-hidden="true">✓</span>
                      <span>
                        <strong>Pembayaran Terverifikasi (LUNAS):</strong>{" "}
                        Silakan klik <strong>Print Resi</strong> untuk mencetak
                        label pengiriman dan memulai pengemasan.
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-primary-800 bg-primary-100 px-2.5 py-0.5 rounded-md">
                      Siap Diproses
                    </span>
                  </div>
                )}

                {/* Main Card Header */}
                <div className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-[280px]">
                    <button
                      type="button"
                      onClick={() => toggleExpand(order.id)}
                      className="mt-1 h-7 w-7 rounded-lg bg-supporting-100 hover:bg-supporting-200 flex items-center justify-center text-[10px] font-bold text-supporting-700 transition-colors cursor-pointer shrink-0"
                      title="Buka rincian produk"
                    >
                      {isExpanded ? "▲" : "▼"}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-bold text-supporting-900">
                          {order.orderNumber}
                        </span>
                        <span
                          className="text-supporting-300"
                          aria-hidden="true"
                        >
                          •
                        </span>
                        <span className="text-xs text-supporting-500 font-medium">
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

                      <div className="mt-1">
                        <span className="text-sm font-bold text-supporting-900">
                          Pesanan dari {order.customerName}
                        </span>
                        <span className="text-xs text-supporting-500 ml-1.5 font-normal">
                          ({order.customerEmail})
                        </span>
                      </div>

                      {/* Clickable Product Dropdown Tag */}
                      <button
                        type="button"
                        onClick={() => toggleExpand(order.id)}
                        className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1.5 bg-supporting-100 hover:bg-supporting-200 text-supporting-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors border border-supporting-200"
                      >
                        <span aria-hidden="true">📦</span>
                        <span>
                          {uniqueProductCount} Macam Produk ({itemCount} item
                          total)
                        </span>
                        <span className="text-[10px] text-supporting-500 font-bold ml-0.5">
                          {isExpanded ? "▴ Tutup" : "▾ Rincian"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Payment Badge */}
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                        isPaid
                          ? "border-primary-200 bg-primary-50 text-primary-800"
                          : isCancelled
                            ? "border-red-200 bg-red-50 text-red-800"
                            : "border-accent-200 bg-accent-50 text-accent-800"
                      }`}
                    >
                      {isPaid
                        ? "✓ Terbayar"
                        : isCancelled
                          ? "✕ Dibatalkan"
                          : "⏳ Menunggu Bayar"}
                    </span>

                    {/* Fulfillment Badge */}
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                        isShipped
                          ? "border-supporting-300 bg-supporting-100 text-supporting-700"
                          : isPacked
                            ? "border-primary-300 bg-primary-50 text-primary-800"
                            : isPaid
                              ? "border-primary-200 bg-primary-50 text-primary-700"
                              : "border-supporting-200 bg-supporting-50 text-supporting-500"
                      }`}
                    >
                      {isShipped
                        ? "🚚 Dikirim"
                        : isPacked
                          ? "📦 Dikemas"
                          : isPaid
                            ? "✓ Siap Dikemas"
                            : "⛔ Belum Lunas"}
                    </span>

                    {/* Total Bill */}
                    <div className="text-right pl-3 pr-1">
                      <div className="text-[10px] text-supporting-400 font-medium uppercase tracking-[0.12em]">
                        Total
                      </div>
                      <div className="font-mono text-sm font-bold text-supporting-900">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(order.totalAmount)}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* If UNPAID -> Allow Admin Manual Payment Confirmation or Cancel */}
                    {isUnpaid && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleConfirmPaid(order.id)}
                          disabled={processingOrderId === order.id}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary-950 px-4 py-2 text-xs font-semibold text-background-100 tracking-tight transition-colors hover:bg-primary-900 cursor-pointer disabled:opacity-50"
                          title="Klik jika pelanggan telah transfer manual ke rekening bank toko"
                        >
                          <span>✓</span>
                          <span>
                            {processingOrderId === order.id
                              ? "Memproses..."
                              : "Konfirmasi Lunas"}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={processingOrderId === order.id}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 tracking-tight transition-colors hover:bg-red-50 cursor-pointer disabled:opacity-50"
                        >
                          Batalkan
                        </button>
                      </>
                    )}

                    {/* If PAID -> Allow Print Resi */}
                    {isPaid && (
                      <button
                        type="button"
                        onClick={() => handlePrintLabel(order)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary-950 px-4 py-2 text-xs font-semibold text-background-100 tracking-tight transition-colors hover:bg-primary-900 cursor-pointer"
                      >
                        <span aria-hidden="true">🖨️</span>
                        <span>Print Resi</span>
                      </button>
                    )}

                    {/* If Packed -> Allow Mark Shipped */}
                    {isPacked && !isShipped && (
                      <button
                        type="button"
                        onClick={() => handleMarkShipped(order.id)}
                        disabled={processingOrderId === order.id}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-supporting-800 px-3.5 py-2 text-xs font-semibold text-background-100 tracking-tight transition-colors hover:bg-supporting-900 cursor-pointer disabled:opacity-50"
                      >
                        <span aria-hidden="true">🚚</span>
                        <span>Tandai Dikirim</span>
                      </button>
                    )}

                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-supporting-300 px-3 py-2 text-xs font-semibold text-supporting-800 tracking-tight transition-colors hover:bg-supporting-50"
                    >
                      Detail →
                    </Link>
                  </div>
                </div>

                {/* EXPANDABLE ACCORDION: DETAIL PRODUK & PENGIRIMAN */}
                {isExpanded && (
                  <div className="border-t border-supporting-200 bg-supporting-50 p-5 space-y-4 animate-fade-in">
                    <div className="grid gap-6 md:grid-cols-3">
                      {/* Column 1 & 2: Items List */}
                      <div className="md:col-span-2 space-y-3">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-supporting-700 flex items-center gap-1.5">
                          <span aria-hidden="true">📚</span>
                          <span>
                            Rincian Produk Dipesan ({uniqueProductCount} Macam)
                          </span>
                        </h4>

                        <div className="admin-panel overflow-hidden divide-y divide-supporting-100">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item, idx) => (
                              <div
                                key={item.id || idx}
                                className="flex items-center justify-between gap-3 p-3.5"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-supporting-100 border border-supporting-200 text-lg">
                                    📖
                                  </div>
                                  <div>
                                    <div className="text-xs font-semibold text-supporting-900">
                                      {item.productName}
                                    </div>
                                    <div className="text-[11px] text-supporting-500 mt-0.5">
                                      Harga:{" "}
                                      <span className="font-mono text-supporting-700 font-medium">
                                        {new Intl.NumberFormat("id-ID", {
                                          style: "currency",
                                          currency: "IDR",
                                          minimumFractionDigits: 0,
                                        }).format(item.unitPrice)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <span className="inline-flex rounded-lg bg-supporting-100 px-2.5 py-1 text-xs font-bold font-mono text-supporting-800">
                                    x{item.quantity}
                                  </span>
                                  <div className="font-mono text-xs font-bold text-supporting-900 mt-1">
                                    {new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                      minimumFractionDigits: 0,
                                    }).format(item.totalPrice)}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-xs text-supporting-500">
                              Tidak ada rincian item.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Column 3: Shipping & Tracking Details */}
                      <div className="space-y-3">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-supporting-700 flex items-center gap-1.5">
                          <span aria-hidden="true">📍</span>
                          <span>Tujuan &amp; Ekspedisi</span>
                        </h4>

                        <div className="admin-panel space-y-3 p-4 text-xs">
                          <div>
                            <span className="text-[10px] text-supporting-400 font-semibold uppercase block">
                              Kurir Pengiriman
                            </span>
                            <span className="font-bold text-supporting-900">
                              {carrier || "-"}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] text-supporting-400 font-semibold uppercase block">
                              Nomor Resi
                            </span>
                            {trackingNumber ? (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-mono text-xs font-bold text-primary-800 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded-md">
                                  {trackingNumber}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      trackingNumber,
                                    );
                                    alert("Nomor resi berhasil disalin!");
                                  }}
                                  className="text-[10px] text-supporting-500 hover:text-supporting-800 font-medium cursor-pointer"
                                >
                                  Salin
                                </button>
                              </div>
                            ) : (
                              <span className="mt-0.5 block text-xs text-supporting-500 font-medium">
                                Belum ada resi (menunggu data pengiriman
                                terverifikasi)
                              </span>
                            )}
                          </div>

                          <div className="border-t border-supporting-100 pt-3">
                            <span className="text-[10px] text-supporting-400 font-semibold uppercase block">
                              Alamat Penerima
                            </span>
                            <div className="font-bold text-supporting-900 mt-0.5">
                              {order.shippingAddress?.name ||
                                order.customerName}{" "}
                              ({order.shippingAddress?.phone || "-"})
                            </div>
                            <div className="text-supporting-600 mt-0.5 leading-relaxed text-[11px]">
                              {order.shippingAddress?.address1}
                              {order.shippingAddress?.city
                                ? `, ${order.shippingAddress.city}`
                                : ""}
                              {order.shippingAddress?.province
                                ? `, ${order.shippingAddress.province}`
                                : ""}
                              {order.shippingAddress?.postalCode
                                ? ` (${order.shippingAddress.postalCode})`
                                : ""}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Shipping Label Print Modal */}
      {selectedOrderForPrint && (
        <ShippingLabelModal
          order={selectedOrderForPrint}
          isOpen={!!selectedOrderForPrint}
          onClose={() => setSelectedOrderForPrint(null)}
          onPrinted={onLabelPrinted}
        />
      )}
    </div>
  );
}
