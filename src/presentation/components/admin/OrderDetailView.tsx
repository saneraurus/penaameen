"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AdminOrder } from "@/lib/admin/orders";
import { ShippingLabelModal } from "@/presentation/components/admin/ShippingLabelModal";

interface OrderDetailViewProps {
  order: AdminOrder;
}

export function OrderDetailView({ order: initialOrder }: OrderDetailViewProps) {
  const router = useRouter();
  const [order, setOrder] = useState<AdminOrder>(initialOrder);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async (transition: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/transition`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transition }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrder(data.order || order);
        router.refresh();
      }
    } catch {
      alert("Gagal mengupdate status pesanan.");
    } finally {
      setIsUpdating(false);
    }
  };

  const carrier = order.fulfillmentHistory?.[0]?.carrier || null;
  const trackingNumber = order.fulfillmentHistory?.[0]?.trackingNumber || null;

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-200">
            {order.orderNumber}
          </span>
          <h2 className="text-lg font-bold text-gray-900 mt-2">
            Pesanan dari {order.customerName}
          </h2>
          <p className="text-xs text-gray-500">{order.customerEmail}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowPrintModal(true)}
            className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>🖨️</span>
            <span>Print Resi Pengiriman</span>
          </button>

          {order.fulfillmentStatus !== "fulfilled" &&
            order.fulfillmentStatus !== "shipped" && (
              <button
                type="button"
                onClick={() => handleUpdateStatus("mark_fulfilled")}
                disabled={isUpdating}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                ✓ Tandai Sedang Dikemas
              </button>
            )}

          {order.fulfillmentStatus !== "shipped" && (
            <button
              type="button"
              onClick={() => handleUpdateStatus("mark_shipped")}
              disabled={isUpdating}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              🚚 Tandai Sudah Dikirim
            </button>
          )}

          <Link
            href="/admin/orders"
            className="px-4 py-2.5 border border-gray-300 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-all"
          >
            ← Kembali
          </Link>
        </div>
      </div>

      {/* Grid Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Products in this single order */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span>📚</span>
              <span>
                Daftar Produk ({order.items?.length || 1} Macam Produk)
              </span>
            </h3>

            <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
              {order.items?.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-xl shrink-0">
                      📖
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-gray-900">
                        {item.productName}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        Harga Satuan:{" "}
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
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-bold font-mono rounded-lg">
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
              ))}
            </div>

            {/* Total Calculation Summary */}
            <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal Produk</span>
                <span className="font-mono">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(
                    order.items?.reduce((s, i) => s + i.totalPrice, 0) ||
                      order.totalAmount,
                  )}
                </span>
              </div>
              <div className="flex justify-between font-bold text-sm text-gray-900 pt-2 border-t border-gray-100">
                <span>Total Akhir</span>
                <span className="font-mono text-primary-700">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Shipping Address */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span>📍</span>
              <span>Informasi Pengiriman</span>
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-gray-400 font-semibold uppercase block">
                  Kurir Ekspedisi
                </span>
                <span className="font-bold text-gray-900 text-xs">
                  {carrier || "-"}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 font-semibold uppercase block">
                  Nomor Resi
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono font-bold text-xs text-primary-700 bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
                    {trackingNumber || "-"}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <span className="text-[10px] text-gray-400 font-semibold uppercase block">
                  Alamat Lengkap Tujuan
                </span>
                <div className="font-bold text-gray-900 mt-1">
                  {order.shippingAddress?.name || order.customerName}
                </div>
                <div className="text-gray-600 font-mono">
                  {order.shippingAddress?.phone || "-"}
                </div>
                <div className="text-gray-700 mt-1 leading-relaxed">
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

      {/* Shipping Label Print Modal */}
      {showPrintModal && (
        <ShippingLabelModal
          order={order}
          isOpen={showPrintModal}
          onClose={() => setShowPrintModal(false)}
          onPrinted={() => {
            setOrder((prev) => ({
              ...prev,
              status: "processing",
              fulfillmentStatus: "fulfilled",
            }));
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
