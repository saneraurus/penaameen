"use client";

import { useState } from "react";
import Image from "next/image";
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
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen) return null;

  const trackingNumber =
    order.fulfillmentHistory?.[0]?.trackingNumber ||
    `JP${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  const carrier = order.fulfillmentHistory?.[0]?.carrier || "SICEPAT-REG";

  const handlePrint = async () => {
    setIsUpdating(true);
    try {
      // Automatically update order status to 'Dikemas' (processing & fulfilled)
      await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "processing",
          paymentStatus: "paid",
          fulfillmentStatus: "fulfilled",
          trackingNumber,
          note: "Resi pengiriman dicetak oleh admin. Paket sedang dikemas di gudang.",
        }),
      });

      if (onPrinted) onPrinted();

      // Trigger browser print
      window.print();
    } catch (e) {
      console.warn("Could not update status on print:", e);
      window.print();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 animate-scale-in">
        {/* Modal Action Header (Hidden during print) */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl">🖨️</span>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Cetak Label Resi Pengiriman
              </h3>
              <p className="text-[11px] text-gray-500">
                Order #{order.orderNumber} • {carrier}
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

        {/* THERMAL SHIPPING LABEL CONTAINER (Styled for standard 100mm x 150mm & screen preview) */}
        <div className="p-6 bg-white print:p-0 print:m-0" id="printable-shipping-label">
          <div className="border-2 border-black p-4 rounded-xl text-black font-sans text-xs space-y-3 bg-white">
            {/* Courier Header & Barcode */}
            <div className="border-b-2 border-black pb-3 flex items-center justify-between">
              <div>
                <span className="text-xl font-black tracking-wider uppercase">
                  {carrier.includes("JNE") ? "JNE EXPRESS" : carrier.includes("SICEPAT") ? "SiCepat" : carrier.includes("JNT") ? "J&T EXPRESS" : carrier}
                </span>
                <div className="text-[10px] font-bold text-gray-700 mt-0.5">
                  STANDAR REGULER (NON-COD)
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 bg-black text-white font-black text-xs rounded uppercase">
                  LUNAS
                </span>
              </div>
            </div>

            {/* Fake SVG Barcode */}
            <div className="text-center py-1 border-b border-black">
              <div className="font-mono text-base font-black tracking-widest uppercase">
                {trackingNumber}
              </div>
              {/* Barcode Lines Graphic */}
              <div className="flex justify-center items-end h-8 gap-0.5 px-4 my-1">
                {[4, 2, 6, 3, 5, 2, 4, 6, 2, 3, 5, 4, 2, 6, 3, 2, 5, 4, 3, 6, 2, 4, 5, 2, 6, 4, 3, 5, 2, 4, 6, 3, 5, 2, 4].map(
                  (h, idx) => (
                    <div
                      key={idx}
                      className="bg-black"
                      style={{
                        width: idx % 3 === 0 ? "3px" : idx % 2 === 0 ? "2px" : "1px",
                        height: `${h * 4 + 10}px`,
                      }}
                    />
                  )
                )}
              </div>
              <div className="text-[9px] text-gray-600 font-mono">
                No. Pesanan: {order.orderNumber}
              </div>
            </div>

            {/* Penerima & Pengirim Columns */}
            <div className="grid grid-cols-2 gap-3 border-b border-black pb-3 pt-1">
              <div>
                <span className="text-[9px] font-bold uppercase text-gray-500 block mb-0.5">
                  PENERIMA:
                </span>
                <div className="font-bold text-xs">
                  {order.shippingAddress?.name || order.customerName}
                </div>
                <div className="text-[11px] font-mono text-gray-800">
                  {order.shippingAddress?.phone || "08123456789"}
                </div>
                <div className="text-[10px] text-gray-700 leading-tight mt-1">
                  {order.shippingAddress?.address1}
                  {order.shippingAddress?.city ? `, ${order.shippingAddress.city}` : ""}
                  {order.shippingAddress?.province ? `, ${order.shippingAddress.province}` : ""}
                  {order.shippingAddress?.postalCode ? ` (${order.shippingAddress.postalCode})` : ""}
                </div>
              </div>

              <div className="border-l border-gray-300 pl-3">
                <span className="text-[9px] font-bold uppercase text-gray-500 block mb-0.5">
                  PENGIRIM:
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="relative w-4 h-4 rounded overflow-hidden shrink-0">
                    <Image
                      src="/images/logo.png"
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="font-bold text-xs">Pena Ameen / Ameen Educare</div>
                </div>
                <div className="text-[11px] font-mono text-gray-800 mt-0.5">
                  0812-3456-7890
                </div>
                <div className="text-[10px] text-gray-700 leading-tight mt-1">
                  Gudang Pusat Pena Ameen, Kota Surabaya, Jawa Timur (60238)
                </div>
              </div>
            </div>

            {/* Daftar Isi Paket (Items) */}
            <div className="border-b border-black pb-2">
              <span className="text-[9px] font-bold uppercase text-gray-500 block mb-1">
                ISI PAKET ({order.items?.length || 1} MACAM PRODUK):
              </span>
              <div className="space-y-1">
                {order.items?.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="flex justify-between items-center text-[11px]"
                  >
                    <span className="font-medium truncate pr-2">
                      • {item.productName}
                    </span>
                    <span className="font-bold font-mono whitespace-nowrap">
                      x{item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center text-[10px] text-gray-600 pt-1">
              <span>Waktu Order: {new Date(order.createdAt).toLocaleDateString("id-ID")}</span>
              <span className="font-bold">PENA AMEEN STORE</span>
            </div>
          </div>
        </div>

        {/* Modal Buttons (Hidden during print) */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3 print:hidden">
          <div className="text-[11px] text-gray-500">
            ℹ️ Mencetak resi akan otomatis mengubah status pesanan menjadi{" "}
            <span className="font-bold text-indigo-700">"Dikemas"</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handlePrint}
              disabled={isUpdating}
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>🖨️</span>
              <span>{isUpdating ? "Memproses..." : "Print Resi (Otomatis Dikemas)"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
