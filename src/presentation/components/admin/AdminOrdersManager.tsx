"use client";

import { useState } from "react";
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

export function AdminOrdersManager({
  initialOrders,
  total,
  currentPage,
  perPage,
}: AdminOrdersManagerProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<
    "ALL" | "READY_TO_PROCESS" | "UNPAID" | "PACKING" | "SHIPPED" | "COMPLETED"
  >("ALL");

  const [expandedOrderIds, setExpandedOrderIds] = useState<Record<string, boolean>>({});
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<AdminOrder | null>(null);
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderIds((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  // 1. Confirm Manual Payment (For Bank Transfers / WA confirmation)
  const handleConfirmPaid = async (orderId: string) => {
    if (!confirm("Konfirmasi bahwa pembayaran untuk pesanan ini telah diterima dan terverifikasi?")) return;

    setProcessingOrderId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "processing",
          paymentStatus: "paid",
          fulfillmentStatus: "unfulfilled",
          note: "Pembayaran dikonfirmasi manual oleh Admin. Pesanan siap dikemas di gudang.",
        }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: "processing",
                  paymentStatus: "paid",
                  fulfillmentStatus: "unfulfilled",
                }
              : o
          )
        );
        setToastMessage(`✓ Pembayaran #${orderId} berhasil dikonfirmasi! Pesanan kini siap diproses & dicetak resinya.`);
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
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "processing",
          fulfillmentStatus: "shipped",
          note: "Paket telah diserahkan kepada kurir pengiriman.",
        }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  fulfillmentStatus: "shipped",
                }
              : o
          )
        );
        setToastMessage(`🚚 Pesanan #${orderId} telah ditandai 'Dalam Pengiriman'!`);
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
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "cancelled",
          paymentStatus: "failed",
          note: "Pesanan dibatalkan oleh Admin.",
        }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: "cancelled",
                  paymentStatus: "failed",
                }
              : o
          )
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
      alert("⚠️ Perhatian: Pesanan ini belum dibayar oleh pelanggan! Resi hanya dapat dicetak untuk pesanan yang telah lunas.");
      return;
    }
    setSelectedOrderForPrint(order);
  };

  const onLabelPrinted = () => {
    if (!selectedOrderForPrint) return;
    const orderId = selectedOrderForPrint.id;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "processing",
              paymentStatus: "paid",
              fulfillmentStatus: "fulfilled",
            }
          : o
      )
    );
    setToastMessage(
      `✓ Resi dicetak! Status Pesanan #${selectedOrderForPrint.orderNumber} otomatis diubah menjadi 'Sedang Dikemas'.`
    );
    setTimeout(() => setToastMessage(null), 5000);
    router.refresh();
  };

  // Tab Filtering Logic
  const readyToProcessCount = orders.filter(
    (o) => o.paymentStatus === "paid" && o.fulfillmentStatus === "unfulfilled" && o.status !== "cancelled"
  ).length;

  const unpaidCount = orders.filter(
    (o) => o.paymentStatus === "pending" && o.status !== "cancelled"
  ).length;

  const packingCount = orders.filter(
    (o) => o.fulfillmentStatus === "fulfilled" && o.status !== "cancelled"
  ).length;

  const shippedCount = orders.filter(
    (o) => o.fulfillmentStatus === "shipped" && o.status !== "cancelled"
  ).length;

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "READY_TO_PROCESS")
      return order.paymentStatus === "paid" && order.fulfillmentStatus === "unfulfilled" && order.status !== "cancelled";
    if (activeTab === "UNPAID")
      return order.paymentStatus === "pending" && order.status !== "cancelled";
    if (activeTab === "PACKING")
      return order.fulfillmentStatus === "fulfilled" && order.status !== "cancelled";
    if (activeTab === "SHIPPED")
      return order.fulfillmentStatus === "shipped" && order.status !== "cancelled";
    if (activeTab === "COMPLETED")
      return order.status === "completed" || order.fulfillmentStatus === "delivered";
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-base">✓</span>
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Modern Workflow Status Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200 scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("ALL")}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "ALL"
              ? "bg-white text-gray-900 shadow-xs border border-gray-200"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          <span>Semua Pesanan</span>
          <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-[11px]">
            {orders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("READY_TO_PROCESS")}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "READY_TO_PROCESS"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-emerald-700 hover:bg-emerald-50"
          }`}
        >
          <span>⭐ Siap Diproses (Lunas)</span>
          {readyToProcessCount > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === "READY_TO_PROCESS"
                  ? "bg-white text-emerald-700"
                  : "bg-emerald-200 text-emerald-900"
              }`}
            >
              {readyToProcessCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("UNPAID")}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "UNPAID"
              ? "bg-amber-500 text-white shadow-xs"
              : "text-amber-800 hover:bg-amber-50"
          }`}
        >
          <span>⏳ Menunggu Pembayaran</span>
          {unpaidCount > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === "UNPAID"
                  ? "bg-white text-amber-800"
                  : "bg-amber-200 text-amber-950"
              }`}
            >
              {unpaidCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("PACKING")}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "PACKING"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-indigo-700 hover:bg-indigo-50"
          }`}
        >
          <span>📦 Sedang Dikemas</span>
          {packingCount > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === "PACKING"
                  ? "bg-white text-indigo-700"
                  : "bg-indigo-100 text-indigo-900"
              }`}
            >
              {packingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("SHIPPED")}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "SHIPPED"
              ? "bg-purple-600 text-white shadow-xs"
              : "text-purple-700 hover:bg-purple-50"
          }`}
        >
          <span>🚚 Dalam Pengiriman</span>
          {shippedCount > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === "SHIPPED"
                  ? "bg-white text-purple-700"
                  : "bg-purple-100 text-purple-900"
              }`}
            >
              {shippedCount}
            </span>
          )}
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 text-gray-500 shadow-xs">
            <div className="text-3xl mb-2">📋</div>
            <div className="font-semibold text-sm text-gray-800">
              Tidak ada pesanan pada kategori ini
            </div>
            <p className="text-xs text-gray-400 mt-1">
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

            const carrier =
              order.fulfillmentHistory?.[0]?.carrier || null;
            const trackingNumber =
              order.fulfillmentHistory?.[0]?.trackingNumber || null;

            return (
              <div
                key={order.id}
                className={`bg-white rounded-3xl border transition-all shadow-xs overflow-hidden ${
                  isUnpaid
                    ? "border-amber-200 hover:border-amber-300"
                    : isPaid && !isPacked
                    ? "border-emerald-300 ring-2 ring-emerald-500/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Header Banner for Unpaid Orders */}
                {isUnpaid && (
                  <div className="bg-amber-500/10 border-b border-amber-200/80 px-5 py-2.5 flex items-center justify-between text-xs text-amber-900 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-base">⏳</span>
                      <span>
                        <strong>Menunggu Pembayaran:</strong> Pelanggan belum menyelesaikan transfer. Jangan kemas atau kirim paket sebelum pembayaran lunas.
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      Belum Terbayar
                    </span>
                  </div>
                )}

                {/* Header Banner for Paid & Ready to Pack */}
                {isPaid && !isPacked && (
                  <div className="bg-emerald-500/10 border-b border-emerald-200/80 px-5 py-2.5 flex items-center justify-between text-xs text-emerald-900 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-base">⭐</span>
                      <span>
                        <strong>Pembayaran Terverifikasi (LUNAS):</strong> Silakan klik <strong>Print Resi</strong> untuk mencetak label pengiriman dan memulai pengemasan.
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                      ✓ Siap Diproses
                    </span>
                  </div>
                )}

                {/* Main Card Header */}
                <div className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-[280px]">
                    <button
                      type="button"
                      onClick={() => toggleExpand(order.id)}
                      className="mt-1 w-7 h-7 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700 transition-all cursor-pointer shrink-0"
                      title="Buka rincian produk"
                    >
                      {isExpanded ? "▲" : "▼"}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-gray-900">
                          {order.orderNumber}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-500 font-medium">
                          {new Date(order.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="mt-1">
                        <span className="text-sm font-bold text-gray-900">
                          Pesanan dari {order.customerName}
                        </span>
                        <span className="text-xs text-gray-500 ml-1.5 font-normal">
                          ({order.customerEmail})
                        </span>
                      </div>

                      {/* Clickable Product Dropdown Tag */}
                      <button
                        type="button"
                        onClick={() => toggleExpand(order.id)}
                        className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold cursor-pointer transition-all border border-gray-200"
                      >
                        <span>📦</span>
                        <span>
                          {uniqueProductCount} Macam Produk ({itemCount} item total)
                        </span>
                        <span className="text-[10px] text-gray-500 font-bold ml-0.5">
                          {isExpanded ? "▴ Tutup" : "▾ Rincian"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Payment Badge */}
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full border ${
                        isPaid
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : isCancelled
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {isPaid ? "✓ Lunas / Terbayar" : isCancelled ? "✕ Dibatalkan" : "⏳ Menunggu Bayar"}
                    </span>

                    {/* Fulfillment Badge */}
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full border ${
                        isShipped
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : isPacked
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : isPaid
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-gray-100 text-gray-500 border-gray-200"
                      }`}
                    >
                      {isShipped
                        ? "🚚 Dalam Pengiriman"
                        : isPacked
                        ? "📦 Sedang Dikemas"
                        : isPaid
                        ? "⭐ Siap Dikemas"
                        : "⛔ Belum Lunas"}
                    </span>

                    {/* Total Bill */}
                    <div className="text-right pl-3 pr-1">
                      <div className="text-[11px] text-gray-400 font-medium">Total Tagihan</div>
                      <div className="font-mono font-bold text-sm text-gray-900">
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
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                          title="Klik jika pelanggan telah transfer manual ke rekening bank toko"
                        >
                          <span>✓</span>
                          <span>{processingOrderId === order.id ? "Memproses..." : "Konfirmasi Lunas"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={processingOrderId === order.id}
                          className="px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
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
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <span>🖨️</span>
                        <span>Print Resi</span>
                      </button>
                    )}

                    {/* If Packed -> Allow Mark Shipped */}
                    {isPacked && !isShipped && (
                      <button
                        type="button"
                        onClick={() => handleMarkShipped(order.id)}
                        disabled={processingOrderId === order.id}
                        className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <span>🚚</span>
                        <span>Tandai Dikirim</span>
                      </button>
                    )}

                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition-all"
                    >
                      Detail →
                    </Link>
                  </div>
                </div>

                {/* EXPANDABLE ACCORDION: DETAIL PRODUK & PENGIRIMAN */}
                {isExpanded && (
                  <div className="p-5 bg-gray-50/70 border-t border-gray-100 space-y-4 animate-fade-in">
                    <div className="grid gap-6 md:grid-cols-3">
                      {/* Column 1 & 2: Items List */}
                      <div className="md:col-span-2 space-y-3">
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                          <span>📚</span>
                          <span>Rincian Produk Dipesan ({uniqueProductCount} Macam)</span>
                        </h4>

                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100 shadow-xs">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item, idx) => (
                              <div
                                key={item.id || idx}
                                className="p-3.5 flex items-center justify-between gap-3"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-11 h-11 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-xl shrink-0">
                                    📖
                                  </div>
                                  <div>
                                    <div className="font-semibold text-xs text-gray-900">
                                      {item.productName}
                                    </div>
                                    <div className="text-[11px] text-gray-500 mt-0.5">
                                      Harga:{" "}
                                      <span className="font-mono text-gray-700 font-medium">
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
                                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs font-bold font-mono rounded-lg">
                                    x{item.quantity}
                                  </span>
                                  <div className="font-mono font-bold text-xs text-gray-900 mt-1">
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
                            <div className="p-4 text-xs text-gray-500">
                              Tidak ada rincian item.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Column 3: Shipping & Tracking Details */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                          <span>📍</span>
                          <span>Tujuan & Ekspedisi</span>
                        </h4>

                        <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3 text-xs shadow-xs">
                          <div>
                            <span className="text-[10px] text-gray-400 font-semibold block">
                              Kurir Pengiriman
                            </span>
                            <span className="font-bold text-gray-900">{carrier || "-"}</span>
                          </div>

                          <div>
                            <span className="text-[10px] text-gray-400 font-semibold block">
                              Nomor Resi
                            </span>
                            {trackingNumber ? (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-mono font-bold text-xs text-primary-700 bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
                                  {trackingNumber}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(trackingNumber);
                                    alert("Nomor resi berhasil disalin!");
                                  }}
                                  className="text-[10px] text-gray-500 hover:text-gray-800 font-medium cursor-pointer"
                                >
                                  Salin
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500 font-medium block mt-0.5">
                                Belum ada resi (menunggu data pengiriman terverifikasi)
                              </span>
                            )}
                          </div>

                          <div className="pt-2 border-t border-gray-100">
                            <span className="text-[10px] text-gray-400 font-semibold block">
                              Alamat Penerima
                            </span>
                            <div className="font-semibold text-gray-800 mt-0.5">
                              {order.shippingAddress?.name || order.customerName} (
                              {order.shippingAddress?.phone || "-"})
                            </div>
                            <div className="text-gray-600 mt-0.5 leading-relaxed text-[11px]">
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
