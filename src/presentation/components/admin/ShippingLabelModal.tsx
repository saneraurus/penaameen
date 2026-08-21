"use client";

import type { AdminOrder } from "@/lib/admin/orders";

interface ShippingLabelModalProps {
  order: AdminOrder;
  isOpen: boolean;
  onClose: () => void;
  onPrinted?: () => void;
}

export function ShippingLabelModal({
  order,
  isOpen,
  onClose,
  onPrinted,
}: ShippingLabelModalProps) {
  if (!isOpen) return null;

  const fulfillmentEvent = order.fulfillmentHistory?.find(
    (e) => e.type === "shipped",
  );
  const trackingNumber = fulfillmentEvent?.trackingNumber || null;
  const carrier = fulfillmentEvent?.carrier || null;

  const handlePrint = () => {
    if (!trackingNumber) return;
    window.print();
    onPrinted?.();
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }

          .print-label,
          .print-label * {
            visibility: visible !important;
          }

          .print-label {
            position: absolute !important;
            inset: 0 !important;
            max-width: none !important;
            border: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div className="print-label bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200">
          <div className="print:hidden p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-xl">🖨️</span>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Cetak Label Resi Pengiriman
                </h3>
                <p className="text-[11px] text-gray-500">
                  Order #{order.orderNumber}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 text-sm font-bold transition-all cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="p-6">
            {trackingNumber ? (
              <div className="space-y-3">
                <div className="border-2 border-gray-900 rounded-xl p-5 space-y-3 text-gray-900">
                  <div className="flex items-start justify-between gap-4 border-b border-gray-300 pb-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold">
                        PENA AMEEN
                      </p>
                      <p className="text-xs font-semibold">Label Pengiriman</p>
                    </div>
                    <p className="font-mono text-sm font-bold">
                      {order.orderNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-500">
                      Kepada
                    </p>
                    <p className="font-bold">
                      {order.shippingAddress?.name || order.customerName}
                    </p>
                    <p className="text-sm whitespace-pre-line">
                      {order.shippingAddress?.address1 || ""}
                      {order.shippingAddress?.city
                        ? `\n${order.shippingAddress.city}`
                        : ""}
                      {order.shippingAddress?.province
                        ? `, ${order.shippingAddress.province}`
                        : ""}
                      {order.shippingAddress?.postalCode
                        ? ` ${order.shippingAddress.postalCode}`
                        : ""}
                    </p>
                    <p className="text-sm">
                      Telp: {order.shippingAddress?.phone || "-"}
                    </p>
                  </div>
                  <div className="border-t border-gray-300 pt-3 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-500">
                        Kurir
                      </p>
                      <p className="font-bold">{carrier || "-"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-gray-500">
                        Nomor Resi
                      </p>
                      <p className="font-mono text-lg font-black">
                        {trackingNumber}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  Nomor resi terverifikasi:{" "}
                  <span className="font-mono font-bold">{trackingNumber}</span>
                </p>
                {carrier ? (
                  <p className="text-xs text-gray-500">Kurir: {carrier}</p>
                ) : null}
                <p className="text-xs text-gray-500">
                  Label resmi dari ekspedisi akan tersedia melalui integrasi
                  shipping provider (fase Integrasi).
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-900">
                  Belum ada nomor resi untuk pesanan ini.
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Resi hanya muncul dari data pengiriman yang terverifikasi
                  (integrasi ekspedisi). Label cetak otomatis dan nomor resi
                  tidak dibuat secara otomatis agar tidak ada informasi
                  pengiriman palsu.
                </p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end print:hidden">
            <div className="flex gap-2">
              {trackingNumber && (
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 bg-primary-600 text-white text-xs font-semibold rounded-xl hover:bg-primary-700 transition-all cursor-pointer"
                >
                  🖨️ Cetak Label
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
