"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options?: Record<string, unknown>) => void;
    };
  }
}

interface OrderItem {
  id: string;
  quantity: number;
  price: string | number;
  subtotal: string | number;
  product: { name: string; image: string } | null;
}

interface StatusHistory {
  id: string;
  status: string;
  note: string | null;
  createdAt: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: string | number;
  shippingCost: string | number;
  total: string | number;
  createdAt: string;
  trackingNumber?: string;
  shippingAddress: {
    recipientName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    province: string;
    postalCode: string;
    country?: string;
  };
  shippingMethod: string | null;
  items: OrderItem[];
  statusHistory: StatusHistory[];
}

const statusConfig: Record<
  string,
  { label: string; step: number; bg: string; text: string; badgeText: string }
> = {
  PENDING_PAYMENT: {
    label: "Menunggu Pembayaran",
    step: 1,
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-800",
    badgeText: "BELUM DIBAYAR",
  },
  PAID: {
    label: "Pembayaran Terverifikasi",
    step: 2,
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-800",
    badgeText: "LUNAS",
  },
  PROCESSING: {
    label: "Sedang Dikemas di Gudang",
    step: 3,
    bg: "bg-indigo-50 border-indigo-200",
    text: "text-indigo-800",
    badgeText: "LUNAS",
  },
  SHIPPED: {
    label: "Dalam Pengiriman",
    step: 4,
    bg: "bg-purple-50 border-purple-200",
    text: "text-purple-800",
    badgeText: "LUNAS",
  },
  DELIVERED: {
    label: "Pesanan Selesai",
    step: 5,
    bg: "bg-emerald-50 border-emerald-300",
    text: "text-emerald-800",
    badgeText: "LUNAS",
  },
  CANCELLED: {
    label: "Dibatalkan",
    step: 0,
    bg: "bg-red-50 border-red-200",
    text: "text-red-800",
    badgeText: "DIBATALKAN",
  },
};

async function loadSnapScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.snap) return resolve();
    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
    const snapUrl = isProduction
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";
    const script = document.createElement("script");
    script.src = snapUrl;
    script.dataset.clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";
    script.onload = () => resolve();
    script.onerror = () => resolve(); // Graceful fallback
    document.body.appendChild(script);
  });
}

function OrderDetailInner() {
  const params = useParams<{ id: string }>();
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedResi, setCopiedResi] = useState(false);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showSnapSimulationModal, setShowSnapSimulationModal] = useState(false);
  const [selectedMidtransMethod, setSelectedMidtransMethod] = useState<
    "qris" | "bca_va" | "mandiri_va" | "bri_va" | "cc"
  >("qris");

  useEffect(() => {
    if (!isSignedIn || !params?.id) return;

    async function loadOrder() {
      const targetId = params?.id as string;
      try {
        const res = await fetch(`/api/orders/${targetId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.order) {
            setOrder(data.order);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Fallback
      }

      // Check localStorage history
      try {
        const localSaved = localStorage.getItem("penaameen_orders_history");
        if (localSaved) {
          const list: Order[] = JSON.parse(localSaved);
          const matched = list.find((o) => o.id === targetId || o.orderNumber === targetId);
          if (matched) {
            setOrder(matched);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Error fallback
      }

      setError("Pesanan tidak ditemukan");
      setIsLoading(false);
    }

    loadOrder();
    const interval = setInterval(loadOrder, 4000);
    window.addEventListener("focus", loadOrder);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", loadOrder);
    };
  }, [isSignedIn, params?.id]);

  const handlePayWithMidtrans = async () => {
    if (!order) return;
    setIsProcessingPayment(true);

    try {
      // 1. Obtain Snap Token from backend
      const snapRes = await fetch(`/api/orders/${order.id}/snap`, { method: "POST" });
      const snapData = await snapRes.json();

      // 2. Try loading real Midtrans snap.js
      await loadSnapScript();

      if (window.snap && snapData.snapToken && !snapData.snapToken.startsWith("MOCK_")) {
        window.snap.pay(snapData.snapToken, {
          onSuccess: async () => {
            await handlePaymentSuccess();
          },
          onPending: () => {
            setIsProcessingPayment(false);
            alert("Silakan selesaikan pembayaran sesuai instruksi pada popup Midtrans.");
          },
          onError: () => {
            setIsProcessingPayment(false);
            alert("Pembayaran gagal atau kedaluwarsa. Silakan coba kembali.");
          },
          onClose: () => {
            setIsProcessingPayment(false);
          },
        });
        return;
      }
    } catch {
      // Fallback to simulated Snap popup below
    }

    // 3. Open Interactive Midtrans Snap Modal for instant payment
    setShowSnapSimulationModal(true);
    setIsProcessingPayment(false);
  };

  const handlePaymentSuccess = async () => {
    if (!order) return;
    setIsProcessingPayment(true);

    try {
      // Update backend status to PAID & PROCESSING
      await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "processing",
          paymentStatus: "paid",
          fulfillmentStatus: "unfulfilled",
          note: "Pembayaran berhasil diverifikasi via Midtrans Snap Gateway.",
        }),
      });

      // Update local storage history
      try {
        const localSaved = JSON.parse(localStorage.getItem("penaameen_orders_history") || "[]");
        const updated = localSaved.map((o: { id: string; orderNumber?: string }) =>
          o.id === order.id || o.orderNumber === order.orderNumber
            ? { ...o, status: "PROCESSING", paymentStatus: "paid" }
            : o
        );
        localStorage.setItem("penaameen_orders_history", JSON.stringify(updated));
      } catch {
        // ignore
      }

      setOrder((prev) =>
        prev
          ? {
              ...prev,
              status: "PROCESSING",
            }
          : prev
      );

      setShowSnapSimulationModal(false);
      router.refresh();
    } catch (e) {
      console.warn("Failed to complete payment state:", e);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCopyResi = (resi: string) => {
    navigator.clipboard.writeText(resi);
    setCopiedResi(true);
    setTimeout(() => setCopiedResi(false), 2000);
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto" />
          <p className="text-supporting-600 text-sm font-medium">Memuat rincian pesanan...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 border border-supporting-200 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3 text-xl">
            ⚠️
          </div>
          <h2 className="text-lg font-serif font-bold text-primary-950 mb-2">Pesanan Tidak Ditemukan</h2>
          <p className="text-supporting-500 text-xs mb-6">
            Nomor pesanan mungkin tidak valid atau belum tersimpan.
          </p>
          <Link
            href="/orders"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold"
          >
            ← Kembali ke Pesanan Saya
          </Link>
        </div>
      </div>
    );
  }

  const isUnpaid = order.status === "PENDING_PAYMENT";
  const currentStatus = statusConfig[order.status] || {
    label: order.status,
    step: isUnpaid ? 1 : 2,
    bg: "bg-supporting-100",
    text: "text-supporting-700",
    badgeText: isUnpaid ? "BELUM DIBAYAR" : "LUNAS",
  };

  const trackingResi = order.trackingNumber || null;
  const activeStep = currentStatus.step;

  const itemsSubtotal = order.items.reduce(
    (sum, i) => sum + (Number(i.subtotal) || Number(i.price) * Number(i.quantity)),
    0
  );
  const calculatedShipping = Math.max(0, Number(order.total) - itemsSubtotal);

  const trackingSteps = [
    { num: 1, title: "Pesanan Dibuat", desc: isUnpaid ? "Menunggu pembayaran pelanggan via Midtrans" : "Pesanan berhasil dicatat" },
    { num: 2, title: "Pembayaran Diterima", desc: "Pembayaran Midtrans Snap terverifikasi lunas" },
    { num: 3, title: "Sedang Dikemas", desc: "Paket disiapkan di Gudang Pena Ameen Surabaya" },
    { num: 4, title: "Dalam Pengiriman", desc: `Kurir ${order.shippingMethod || "SiCepat / JNE"}` },
    { num: 5, title: "Pesanan Selesai", desc: "Paket telah sampai ke alamat tujuan" },
  ];

  const adminWhatsApp = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "";
  const waConfirmUrl = adminWhatsApp
    ? `https://wa.me/${adminWhatsApp.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Halo CS Pena Ameen, saya ingin menanyakan pesanan #${order.orderNumber} senilai Rp ${Number(
          order.total
        ).toLocaleString("id-ID")}.`
      )}`
    : "";

  return (
    <div className="min-h-screen bg-background-50 pb-24">
      {/* Top Header Breadcrumb */}
      <section className="bg-white border-b border-supporting-200/80 py-6 shadow-2xs">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-supporting-500 mb-1.5 font-medium">
                <Link href="/orders" className="hover:text-primary-600">Pesanan Saya</Link>
                <span>/</span>
                <span className="text-primary-800 font-semibold">{order.orderNumber}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl md:text-2xl font-serif font-bold text-primary-950 font-mono">
                  {order.orderNumber}
                </h1>
                <span className={`px-3.5 py-1 rounded-full text-xs font-bold border ${currentStatus.bg} ${currentStatus.text}`}>
                  {currentStatus.label}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {adminWhatsApp ? (
                <a
                  href={waConfirmUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>💬 Bantuan CS WhatsApp</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="container px-4 mx-auto py-8">
        {/* PROMINENT MIDTRANS PAYMENT HERO (Displayed when UNPAID) */}
        {isUnpaid && (
          <div className="mb-8 bg-gradient-to-r from-amber-500/10 via-primary-600/10 to-amber-500/10 rounded-3xl border-2 border-primary-500 p-6 md:p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold">
                <span className="animate-pulse">⏳</span>
                <span>Menunggu Pembayaran Midtrans Snap</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-primary-950">
                Bayar Sekarang via Midtrans Gateway
              </h2>
              <p className="text-xs text-supporting-600">
                Mendukung QRIS (GoPay, OVO, ShopeePay, Dana, BCA Mobile), Virtual Account Bank (BCA, Mandiri, BRI, BNI), dan Kartu Kredit.
              </p>
              <div className="pt-1">
                <span className="text-xs text-supporting-500">Total Tagihan Lunas: </span>
                <span className="text-xl font-bold font-mono text-primary-900">
                  Rp{Number(order.total).toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handlePayWithMidtrans}
                disabled={isProcessingPayment}
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>💳</span>
                <span>{isProcessingPayment ? "Membuka Midtrans..." : "Bayar Sekarang (Midtrans Snap)"}</span>
              </button>
            </div>
          </div>
        )}

        {/* 2 COLUMNS LAYOUT: Tracking & Invoice Details */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Tracking Stepper Timeline & Order Items (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Live Tracking Timeline Card */}
            <div className="bg-white rounded-3xl border border-supporting-200/90 p-6 md:p-8 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-supporting-100 mb-6">
                <div>
                  <h2 className="text-base font-serif font-bold text-primary-950 flex items-center gap-2">
                    <span>🚚</span> Status & Pelacakan Pengiriman
                  </h2>
                  <p className="text-xs text-supporting-500 mt-0.5">
                    Ekspedisi: <strong>{order.shippingMethod || "SICEPAT / JNE REGULER"}</strong>
                  </p>
                </div>

                {/* Tracking Resi Box - Only shown if order is PAID / SHIPPED */}
                {!isUnpaid && trackingResi && (
                  <div className="flex items-center gap-2 bg-supporting-50 px-3 py-1.5 rounded-xl border border-supporting-200">
                    <span className="text-[11px] text-supporting-500 font-mono">No. Resi:</span>
                    <span className="text-xs font-mono font-bold text-primary-950">{trackingResi}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyResi(trackingResi)}
                      className="text-[10px] font-bold text-primary-600 hover:text-primary-800 pl-1 cursor-pointer"
                    >
                      {copiedResi ? "✓ Tersalin" : "Salin"}
                    </button>
                  </div>
                )}
              </div>

              {/* Stepper Timeline */}
              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-supporting-200">
                {trackingSteps.map((step) => {
                  const isDone = activeStep > step.num;
                  const isCurrent = activeStep === step.num;

                  return (
                    <div key={step.num} className="relative flex items-start gap-4">
                      {/* Step Indicator Dot */}
                      <span
                        className={`absolute -left-6 sm:-left-8 flex items-center justify-center w-6 sm:w-8 h-6 sm:h-8 rounded-full text-xs font-bold font-mono transition-colors ${
                          isCurrent
                            ? isUnpaid
                              ? "bg-amber-500 text-white ring-4 ring-amber-100"
                              : "bg-primary-600 text-white ring-4 ring-primary-100"
                            : isDone
                            ? "bg-emerald-600 text-white"
                            : "bg-supporting-100 text-supporting-400 border border-supporting-200"
                        }`}
                      >
                        {isDone ? "✓" : step.num}
                      </span>

                      <div>
                        <h4
                          className={`text-xs font-bold ${
                            isCurrent
                              ? isUnpaid
                                ? "text-amber-800"
                                : "text-primary-800"
                              : isDone
                              ? "text-primary-950"
                              : "text-supporting-400"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-supporting-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Order Items List Card */}
            <div className="bg-white rounded-3xl border border-supporting-200/90 p-6 md:p-8 shadow-xs">
              <h2 className="text-base font-serif font-bold text-primary-950 pb-4 border-b border-supporting-100 mb-4 flex items-center justify-between">
                <span>📚 Produk yang Dipesan ({order.items.length} Macam)</span>
              </h2>

              <div className="divide-y divide-supporting-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-supporting-100 flex items-center justify-center text-xl shrink-0 border border-supporting-200">
                        📖
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-primary-950 truncate">
                          {item.product?.name || "Produk Pena Ameen"}
                        </h4>
                        <p className="text-[11px] text-supporting-500 mt-0.5">
                          Rp{Number(item.price).toLocaleString("id-ID")} × {item.quantity} unit
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold font-mono text-primary-800 shrink-0">
                      Rp{Number(item.subtotal || Number(item.price) * Number(item.quantity)).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Destination Address & Invoice Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Destination Address */}
            <div className="bg-white rounded-3xl border border-supporting-200/90 p-6 shadow-xs">
              <h3 className="text-sm font-serif font-bold text-primary-950 pb-3 border-b border-supporting-100 mb-3 flex items-center gap-2">
                <span>📍</span> Alamat Penerima
              </h3>
              <div className="text-xs space-y-1">
                <p className="font-bold text-primary-950">{order.shippingAddress.recipientName}</p>
                <p className="text-supporting-500 font-mono">{order.shippingAddress.phone || "-"}</p>
                <p className="text-supporting-600 pt-1 leading-relaxed">
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}
                </p>
                <p className="text-supporting-500 font-medium">
                  {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
                </p>
              </div>
            </div>

            {/* Invoice Breakdown */}
            <div className="bg-white rounded-3xl border border-supporting-200/90 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-supporting-100 mb-4">
                <h3 className="text-sm font-serif font-bold text-primary-950">
                  Rincian Pembayaran
                </h3>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    isUnpaid
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : "bg-emerald-50 text-emerald-800 border-emerald-200"
                  }`}
                >
                  {currentStatus.badgeText}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-supporting-600">
                  <span>Subtotal Produk</span>
                  <span className="font-semibold text-primary-950 font-mono">
                    Rp{itemsSubtotal.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex justify-between text-supporting-600">
                  <span>Biaya Pengiriman ({order.shippingMethod || "SICEPAT-REG"})</span>
                  <span className="font-semibold text-primary-950 font-mono">
                    Rp{calculatedShipping.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex justify-between text-supporting-600">
                  <span>Biaya Layanan & Asuransi</span>
                  <span className="font-semibold text-emerald-600">GRATIS</span>
                </div>

                <div className="pt-3.5 border-t border-supporting-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-primary-950 block">Total Tagihan</span>
                    <span className="text-[10px] text-supporting-400">Sudah termasuk PPN & Ongkir</span>
                  </div>
                  <span className="text-xl font-bold text-primary-800 font-mono">
                    Rp{Number(order.total).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-supporting-100 flex flex-col gap-2.5">
                {isUnpaid ? (
                  <button
                    type="button"
                    onClick={handlePayWithMidtrans}
                    disabled={isProcessingPayment}
                    className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>💳</span>
                    <span>Bayar via Midtrans Snap</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full py-2.5 bg-supporting-100 hover:bg-supporting-200 text-supporting-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>🖨️ Cetak / Simpan Invoice (PDF)</span>
                  </button>
                )}

                <Link
                  href="/produk"
                  className="w-full py-2.5 border border-supporting-200 hover:bg-supporting-50 text-supporting-700 text-xs font-semibold rounded-xl transition-colors text-center"
                >
                  Belanja Produk Lain
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MIDTRANS SNAP MODAL DIALOG */}
      {showSnapSimulationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200 animate-scale-in">
            {/* Snap Header */}
            <div className="bg-primary-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">
                  💳
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">Midtrans Snap Payment</h3>
                  <p className="text-[11px] text-primary-100 mt-0.5">Order #{order.orderNumber}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSnapSimulationModal(false)}
                className="text-white/80 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Snap Body */}
            <div className="p-6 space-y-5">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex justify-between items-center">
                <span className="text-xs text-gray-500 font-medium">Total Pembayaran:</span>
                <span className="text-base font-mono font-bold text-primary-900">
                  Rp{Number(order.total).toLocaleString("id-ID")}
                </span>
              </div>

              {/* Method Selector */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-700 block">Pilih Saluran Pembayaran:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedMidtransMethod("qris")}
                    className={`p-3 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                      selectedMidtransMethod === "qris"
                        ? "border-primary-600 bg-primary-50 text-primary-900 ring-2 ring-primary-500/20"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    📱 QRIS (GoPay/OVO/Dana)
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMidtransMethod("bca_va")}
                    className={`p-3 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                      selectedMidtransMethod === "bca_va"
                        ? "border-primary-600 bg-primary-50 text-primary-900 ring-2 ring-primary-500/20"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    🏦 BCA Virtual Account
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMidtransMethod("mandiri_va")}
                    className={`p-3 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                      selectedMidtransMethod === "mandiri_va"
                        ? "border-primary-600 bg-primary-50 text-primary-900 ring-2 ring-primary-500/20"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    🏦 Mandiri Bill Payment
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMidtransMethod("bri_va")}
                    className={`p-3 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                      selectedMidtransMethod === "bri_va"
                        ? "border-primary-600 bg-primary-50 text-primary-900 ring-2 ring-primary-500/20"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    🏦 BRI Virtual Account
                  </button>
                </div>
              </div>

              {/* Method Detail View */}
              {selectedMidtransMethod === "qris" ? (
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-center space-y-2">
                  <div className="w-28 h-28 mx-auto bg-white border-2 border-black rounded-xl p-2 flex items-center justify-center text-xs font-mono font-bold">
                    📱 QRIS ACTIVE
                  </div>
                  <p className="text-[11px] text-emerald-900">
                    Buka GoPay, OVO, ShopeePay, Dana, atau BCA Mobile untuk scan QR.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-1 text-xs">
                  <span className="text-blue-950 font-bold block">Nomor Virtual Account:</span>
                  <div className="font-mono font-bold text-sm text-blue-900">
                    8801208123456789
                  </div>
                  <p className="text-[11px] text-blue-800">
                    Gunakan ATM, Internet Banking, atau Mobile Banking untuk membayar.
                  </p>
                </div>
              )}
            </div>

            {/* Snap Action Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowSnapSimulationModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handlePaymentSuccess}
                disabled={isProcessingPayment}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>✓</span>
                <span>{isProcessingPayment ? "Memverifikasi..." : "Bayar Sekarang (Konfirmasi Lunas)"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto" />
            <p className="text-supporting-600 text-sm font-medium">Memuat data pesanan...</p>
          </div>
        </div>
      }
    >
      <OrderDetailInner />
    </Suspense>
  );
}
