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
}: ShippingLabelModalProps) {
  if (!isOpen) return null;

  const fulfillmentEvent = order.fulfillmentHistory?.find(
    (e) => e.type === "shipped",
  );
  const trackingNumber = fulfillmentEvent?.trackingNumber || null;
  const carrier = fulfillmentEvent?.carrier || null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
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
              <p className="text-sm text-gray-700">
                Nomor resi terverifikasi:{" "}
                <span className="font-mono font-bold">{trackingNumber}</span>
              </p>
              {carrier ? (
                <p className="text-xs text-gray-500">
                  Kurir: {carrier}
                </p>
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
                (integrasi ekspedisi). Label cetak otomatis dan nomor resi tidak
                dibuat secara otomatis agar tidak ada informasi pengiriman palsu.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end print:hidden">
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
  );
}