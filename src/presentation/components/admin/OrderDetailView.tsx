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
      <div className="admin-panel p-5">
        <div>
          <span className="inline-flex rounded-lg border border-primary-200 bg-primary-50 px-2.5 py-1 text-[11px] font-bold text-primary-800 tracking-tight">
            {order.orderNumber}
          </span>
          <h2 className="mt-2 text-lg font-semibold text-supporting-900">
            Pesanan dari {order.customerName}
          </h2>
          <p className="text-xs text-supporting-500">{order.customerEmail}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowPrintModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-950 px-4 py-2.5 text-xs font-semibold text-background-100 tracking-tight transition-colors hover:bg-primary-900 cursor-pointer"
          >
            <span aria-hidden="true">🖨️</span>
            <span>Print Resi Pengiriman</span>
          </button>

          {order.fulfillmentStatus !== "fulfilled" &&
            order.fulfillmentStatus !== "shipped" && (
              <button
                type="button"
                onClick={() => handleUpdateStatus("mark_fulfilled")}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-800 px-4 py-2.5 text-xs font-semibold text-background-100 tracking-tight transition-colors hover:bg-primary-950 cursor-pointer disabled:opacity-50"
              >
                ✓ Tandai Sedang Dikemas
              </button>
            )}

          {order.fulfillmentStatus !== "shipped" && (
            <button
              type="button"
              onClick={() => handleUpdateStatus("mark_shipped")}
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 rounded-lg bg-supporting-800 px-4 py-2.5 text-xs font-semibold text-background-100 tracking-tight transition-colors hover:bg-supporting-900 cursor-pointer disabled:opacity-50"
            >
              🚚 Tandai Sudah Dikirim
            </button>
          )}

          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 rounded-lg border border-supporting-300 px-4 py-2.5 text-xs font-semibold text-supporting-800 tracking-tight transition-colors hover:bg-supporting-50"
          >
            ← Kembali
          </Link>
        </div>
      </div>

      {/* Grid Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Products in this single order */}
        <div className="lg:col-span-2 space-y-6">
          <div className="admin-panel overflow-hidden">
            <div className="border-b border-supporting-200 px-5 py-4">
              <h3 className="text-sm font-medium text-supporting-900 flex items-center gap-2">
                <span aria-hidden="true">📚</span>
                <span>
                  Daftar Produk ({order.items?.length || 1} Macam Produk)
                </span>
              </h3>
            </div>

            <div className="divide-y divide-supporting-100">
              {order.items?.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-supporting-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-supporting-100 border border-supporting-200 text-xl">
                      📖
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-supporting-900">
                        {item.productName}
                      </div>
                      <div className="text-[11px] text-supporting-500 mt-0.5">
                        Harga Satuan:{" "}
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
              ))}
            </div>

            {/* Total Calculation Summary */}
            <div className="border-t border-supporting-200 px-5 py-4 space-y-2 text-xs">
              <div className="flex justify-between text-supporting-600">
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
              <div className="flex justify-between border-t border-supporting-200 pt-2 text-sm font-bold text-supporting-900">
                <span>Total Akhir</span>
                <span className="font-mono text-primary-800">
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
          <div className="admin-panel space-y-4 p-5 text-xs">
            <h3 className="text-sm font-medium text-supporting-900 flex items-center gap-2">
              <span aria-hidden="true">📍</span>
              <span>Informasi Pengiriman</span>
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-supporting-400 font-semibold uppercase block">
                  Kurir Ekspedisi
                </span>
                <span className="font-bold text-supporting-900 text-xs">
                  {carrier || "-"}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-supporting-400 font-semibold uppercase block">
                  Nomor Resi
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs font-bold text-primary-800 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded-md">
                    {trackingNumber || "-"}
                  </span>
                </div>
              </div>

              <div className="border-t border-supporting-200 pt-3">
                <span className="text-[10px] text-supporting-400 font-semibold uppercase block">
                  Alamat Lengkap Tujuan
                </span>
                <div className="font-bold text-supporting-900 mt-1">
                  {order.shippingAddress?.name || order.customerName}
                </div>
                <div className="font-mono text-supporting-600">
                  {order.shippingAddress?.phone || "-"}
                </div>
                <div className="text-supporting-700 mt-1 leading-relaxed text-[11px]">
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
