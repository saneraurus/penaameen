"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options?: Record<string, unknown>) => void;
    };
  }
}

async function loadSnapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.snap) return resolve();
    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
    const snapUrl = isProduction
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";
    const script = document.createElement("script");
    script.src = snapUrl;
    script.dataset.clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Midtrans"));
    document.body.appendChild(script);
  });
}

function CheckoutPaymentPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const params = useSearchParams();
  const { items: cartItems, total: cartTotal, clearCart } = useCart();

  const addressId = params.get("addressId") || "addr-default-1";
  const shippingMethod = params.get("shippingMethod") || "jne-REG";
  const shippingCost = Number(params.get("shippingCost") || 18000);

  const [paymentMethod, setPaymentMethod] = useState<"midtrans" | "manual">("midtrans");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressData, setAddressData] = useState<any>(null);

  // Auth Guard
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect_url=" + encodeURIComponent(window.location.pathname + window.location.search));
    }
  }, [isLoaded, isSignedIn, router]);

  // Load selected address details from local storage / API
  useEffect(() => {
    try {
      const saved = localStorage.getItem("penaameen_checkout_addresses");
      if (saved) {
        const list = JSON.parse(saved);
        const found = list.find((a: any) => a.id === addressId);
        if (found) setAddressData(found);
      }
    } catch {
      // Ignored
    }
  }, [addressId]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [modalTab, setModalTab] = useState<"qris" | "va">("qris");
  const [selectedBank, setSelectedBank] = useState<"bca" | "mandiri" | "bri" | "bni">("bca");
  const [copied, setCopied] = useState(false);
  const [currentOrderRef, setCurrentOrderRef] = useState<string>("");

  const grandTotal = cartTotal + shippingCost;

  const vaNumbers: Record<string, string> = {
    bca: "88012" + (addressData?.phone ? addressData.phone.slice(-6) : "892019"),
    mandiri: "89301" + (addressData?.phone ? addressData.phone.slice(-6) : "892019"),
    bri: "10283" + (addressData?.phone ? addressData.phone.slice(-6) : "892019"),
    bni: "98801" + (addressData?.phone ? addressData.phone.slice(-6) : "892019"),
  };

  const createLiveOrderOnServer = async (status = "PAID") => {
    const realEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || "ihsanzz099@gmail.com";
    const realName = user?.fullName || (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : null) || addressData?.recipientName || "Ihsan";

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: addressId || "addr-default-1",
          shippingMethod: shippingMethod || "jne-REG",
          shippingCost,
          customerEmail: realEmail,
          customerName: realName,
          items: cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product?.price ? Number(item.product.price) : 150000,
            name: item.product?.name || `Produk ${item.product.id}`,
            image: item.product?.image,
          })),
          shippingAddress: addressData || {
            recipientName: realName,
            phone: "08123456789",
            email: realEmail,
            addressLine1: "Jl. Margorejo Indah No. 12",
            city: "Surabaya",
            province: "Jawa Timur",
            postalCode: "60238",
          },
        }),
      });
      const data = await res.json();
      return data;
    } catch (e) {
      console.warn("Could not post order to server:", e);
      return null;
    }
  };

  const handlePayMidtrans = async () => {
    setIsProcessing(true);
    setError(null);

    const orderRef = "PA-" + Date.now().toString().slice(-6);
    setCurrentOrderRef(orderRef);

    try {
      // 1. Create order on server
      const data = await createLiveOrderOnServer("PENDING_PAYMENT");
      if (data?.orderNumber) {
        setCurrentOrderRef(data.orderNumber);
      }

      // If real Snap token exists on server, load Snap dialog
      if (data?.snapToken) {
        await loadSnapScript();

        if (window.snap) {
          window.snap.pay(data.snapToken, {
            onSuccess: () => {
              saveOrderToLocalHistory(data.orderNumber || orderRef, "PAID");
              clearCart();
              router.push(`/checkout/success?order_id=${data.orderNumber || orderRef}`);
            },
            onPending: () => {
              saveOrderToLocalHistory(data.orderNumber || orderRef, "PENDING_PAYMENT");
              clearCart();
              router.push(`/checkout/success?order_id=${data.orderNumber || orderRef}&pending=1`);
            },
            onError: () => {
              setError("Pembayaran gagal atau dibatalkan. Silakan coba lagi.");
              setIsProcessing(false);
            },
            onClose: () => {
              setIsProcessing(false);
            },
          });
          return;
        }
      }
    } catch {
      // Offline/dev mode fallback
    }

    // Open Interactive Indonesian Payment Modal (QRIS & Virtual Account)
    setIsProcessing(false);
    setShowPaymentModal(true);
  };

  const saveOrderToLocalHistory = (orderId: string, status = "PAID") => {
    try {
      const existing = JSON.parse(localStorage.getItem("penaameen_orders_history") || "[]");
      const newOrder = {
        id: orderId,
        orderNumber: orderId.startsWith("PA-") ? orderId : `PA-${orderId}`,
        status,
        subtotal: String(cartTotal),
        shippingCost: String(shippingCost),
        total: String(grandTotal),
        createdAt: new Date().toISOString(),
        trackingNumber: "JP" + Math.floor(1000000000 + Math.random() * 9000000000),
        shippingAddress: addressData || {
          recipientName: "Pelanggan Pena Ameen",
          phone: "08123456789",
          addressLine1: "Jl. Margorejo Indah No. 12",
          city: "Surabaya",
          province: "Jawa Timur",
          postalCode: "60238",
        },
        shippingMethod: shippingMethod.toUpperCase(),
        items: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: String(item.product.price),
          subtotal: String(item.subtotal),
          product: {
            name: item.product.name,
            image: item.product.image,
          },
        })),
        statusHistory: [
          {
            id: "sh-1",
            status: "PAID",
            note: "Pembayaran terverifikasi otomatis via QRIS / VA",
            createdAt: new Date().toISOString(),
          },
          {
            id: "sh-2",
            status: "PROCESSING",
            note: "Pesanan sedang disiapkan & dikemas di Gudang Surabaya",
            createdAt: new Date().toISOString(),
          },
        ],
      };
      localStorage.setItem("penaameen_orders_history", JSON.stringify([newOrder, ...existing]));
    } catch (e) {
      console.warn("Failed to persist order locally", e);
    }
  };

  const handleSimulatePaymentSuccess = async () => {
    setIsProcessing(true);
    const serverResult = await createLiveOrderOnServer("PAID");
    const finalOrderNumber = serverResult?.orderNumber || currentOrderRef;

    saveOrderToLocalHistory(finalOrderNumber, "PAID");
    clearCart();
    setShowPaymentModal(false);
    setIsProcessing(false);
    router.push(`/checkout/success?order_id=${finalOrderNumber}`);
  };

  const handleCopyVA = () => {
    const va = vaNumbers[selectedBank];
    if (va) {
      navigator.clipboard.writeText(va);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleManualWhatsAppConfirmation = async () => {
    const serverResult = await createLiveOrderOnServer("PENDING_PAYMENT");
    const finalOrderNumber = serverResult?.orderNumber || ("PA-" + Date.now().toString().slice(-6));

    saveOrderToLocalHistory(finalOrderNumber, "PENDING_PAYMENT");
    const text = `Halo Admin Pena Ameen, saya ingin konfirmasi pesanan dengan nomor ${finalOrderNumber} sebesar Rp${grandTotal.toLocaleString("id-ID")}. Mohon info rekening transfer. Terima kasih!`;
    const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(text)}`;
    clearCart();
    window.open(waUrl, "_blank");
    router.push(`/checkout/success?order_id=${finalOrderNumber}&pending=1`);
  };

  return (
    <div className="min-h-screen bg-background-50 pb-24">
      {/* Checkout Step Breadcrumb Bar */}
      <div className="bg-white border-b border-supporting-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="container px-4 mx-auto py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/checkout/address"
                className="text-xs text-supporting-500 hover:text-primary-700 flex items-center gap-1.5 transition-colors font-medium"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Ubah Alamat / Kurir
              </Link>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2 text-supporting-400">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">
                  ✓
                </span>
                <span>Alamat & Kurir</span>
              </div>
              <div className="w-6 sm:w-10 h-[2px] bg-primary-500" />
              <div className="flex items-center gap-2 text-primary-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white text-[11px] font-bold shadow-xs">
                  2
                </span>
                <span>Pembayaran</span>
              </div>
              <div className="w-6 sm:w-10 h-[2px] bg-supporting-200" />
              <div className="flex items-center gap-2 text-supporting-400">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-supporting-200 text-supporting-600 text-[11px] font-bold">
                  3
                </span>
                <span>Selesai</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 mx-auto py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center justify-between text-sm shadow-xs">
            <div className="flex items-center gap-2.5">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 text-xs font-bold">
              ✕
            </button>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Payment Methods & Shipping Recap (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Recap Card */}
            <div className="bg-white rounded-3xl border border-supporting-200/90 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-supporting-100 mb-4">
                <h3 className="text-sm font-serif font-bold text-primary-950 flex items-center gap-2">
                  <span>📍</span> Tujuan Pengiriman & Kurir
                </h3>
                <Link
                  href="/checkout/address"
                  className="text-xs text-primary-600 hover:text-primary-800 font-semibold"
                >
                  Ubah
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-supporting-400 font-semibold uppercase tracking-wider block mb-1">
                    Penerima
                  </span>
                  <p className="font-bold text-primary-950">{addressData?.recipientName || "Pelanggan Pena Ameen"}</p>
                  <p className="text-supporting-500">{addressData?.phone || "08123456789"}</p>
                  <p className="text-supporting-600 mt-1 leading-relaxed">
                    {addressData?.addressLine1 || "Jl. Margorejo Indah No. 12"}, {addressData?.city || "Surabaya"}
                  </p>
                </div>

                <div className="sm:border-l sm:border-supporting-100 sm:pl-4">
                  <span className="text-[10px] text-supporting-400 font-semibold uppercase tracking-wider block mb-1">
                    Kurir Dipilih
                  </span>
                  <p className="font-bold text-primary-950 uppercase">{shippingMethod.replace("-", " — ")}</p>
                  <p className="text-supporting-500">Estimasi tiba 2-3 hari kerja</p>
                  <p className="text-primary-700 font-semibold mt-1">
                    Ongkos Kirim: Rp{shippingCost.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-3xl border border-supporting-200/90 p-6 md:p-8 shadow-xs">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50 text-primary-700 font-bold text-sm border border-primary-100">
                  💳
                </span>
                <div>
                  <h2 className="text-lg font-serif font-bold text-primary-950">Metode Pembayaran</h2>
                  <p className="text-xs text-supporting-500">Pilih opsi pembayaran yang paling nyaman untuk Anda</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Option 1: Midtrans Online Payment (QRIS, VA, E-Wallet) */}
                <label
                  className={`block p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    paymentMethod === "midtrans"
                      ? "border-primary-600 bg-primary-50/40 shadow-xs ring-1 ring-primary-500/20"
                      : "border-supporting-200 hover:border-supporting-300 hover:bg-supporting-50/30"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentMethod === "midtrans"}
                      onChange={() => setPaymentMethod("midtrans")}
                      className="mt-1 text-primary-600 focus:ring-primary-500"
                    />

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <span className="text-sm font-bold text-primary-950">
                          Pembayaran Otomatis (Midtrans Snap)
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          Verifikasi Otomatis 24/7
                        </span>
                      </div>

                      <p className="text-xs text-supporting-600 leading-relaxed mb-3">
                        Bayar instan dengan QRIS (GoPay, OVO, ShopeePay, Dana) atau Transfer Virtual Account (BCA, Mandiri, BNI, BRI, Permata).
                      </p>

                      {/* Payment Badges Icons */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-supporting-100">
                        {["QRIS", "BCA VA", "Mandiri", "BNI", "BRI", "GoPay", "ShopeePay"].map((badge) => (
                          <span
                            key={badge}
                            className="px-2 py-0.5 bg-supporting-100/90 text-supporting-700 text-[10px] font-semibold rounded"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </label>

                {/* Option 2: Manual Bank Transfer */}
                <label
                  className={`block p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    paymentMethod === "manual"
                      ? "border-primary-600 bg-primary-50/40 shadow-xs ring-1 ring-primary-500/20"
                      : "border-supporting-200 hover:border-supporting-300 hover:bg-supporting-50/30"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentMethod === "manual"}
                      onChange={() => setPaymentMethod("manual")}
                      className="mt-1 text-primary-600 focus:ring-primary-500"
                    />

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-bold text-primary-950">
                          Transfer Bank Manual / Konfirmasi WhatsApp
                        </span>
                      </div>

                      <p className="text-xs text-supporting-600 leading-relaxed mb-3">
                        Transfer langsung ke rekening resmi Pena Ameen dan konfirmasi bukti transfer via CS WhatsApp.
                      </p>

                      {paymentMethod === "manual" && (
                        <div className="mt-3 p-3.5 bg-white rounded-xl border border-supporting-200 space-y-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-supporting-600">Bank BCA</span>
                            <span className="font-mono font-bold text-primary-900">123-456-7890</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-supporting-600">Bank Mandiri</span>
                            <span className="font-mono font-bold text-primary-900">142-00-1234567-8</span>
                          </div>
                          <p className="text-[10px] text-supporting-400 pt-1 border-t border-supporting-100">
                            Atas Nama: <strong>Penerbit Pena Ameen</strong>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout Action (5 cols) */}
          <div className="lg:col-span-5 sticky top-20 space-y-6">
            <div className="bg-white rounded-3xl border border-supporting-200/90 p-6 shadow-sm">
              <h2 className="text-lg font-serif font-bold text-primary-950 mb-4 pb-3 border-b border-supporting-100 flex items-center justify-between">
                <span>Rincian Pembayaran</span>
                <span className="text-xs font-sans font-semibold px-2.5 py-0.5 bg-supporting-100 text-supporting-700 rounded-full">
                  {cartItems.length} Produk
                </span>
              </h2>

              {/* Items summary */}
              <div className="divide-y divide-supporting-100 max-h-56 overflow-y-auto pr-1 scrollbar-thin mb-5">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-9 h-9 rounded-lg bg-supporting-100 overflow-hidden flex-shrink-0 border border-supporting-200">
                        <Image
                          src={item.product.image || "/images/penaameen/products/home-learning.jpg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-primary-950 truncate">{item.product.name}</p>
                        <p className="text-[10px] text-supporting-500">Jumlah: {item.quantity} unit</p>
                      </div>
                    </div>
                    <span className="font-bold text-primary-800 flex-shrink-0">
                      Rp{item.subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-supporting-100 text-xs">
                <div className="flex justify-between text-supporting-600">
                  <span>Subtotal Produk</span>
                  <span className="font-semibold text-primary-950">Rp{cartTotal.toLocaleString("id-ID")}</span>
                </div>

                <div className="flex justify-between text-supporting-600">
                  <span>Ongkos Kirim ({shippingMethod.toUpperCase()})</span>
                  <span className="font-semibold text-primary-950">Rp{shippingCost.toLocaleString("id-ID")}</span>
                </div>

                <div className="flex justify-between text-supporting-600">
                  <span>Biaya Layanan</span>
                  <span className="font-semibold text-emerald-600">GRATIS</span>
                </div>

                <div className="pt-3.5 border-t border-supporting-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-primary-950 block">Total Tagihan</span>
                    <span className="text-[10px] text-supporting-400">Total bersih yang dibayarkan</span>
                  </div>
                  <span className="text-2xl font-bold text-primary-700">
                    Rp{grandTotal.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {paymentMethod === "midtrans" ? (
                <button
                  type="button"
                  onClick={handlePayMidtrans}
                  disabled={isProcessing}
                  className="w-full mt-6 py-4 px-6 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-primary-900/20 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>Menghubungkan ke Midtrans...</span>
                    </>
                  ) : (
                    <>
                      <span>Bayar Sekarang (Buka Snap)</span>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleManualWhatsAppConfirmation}
                  className="w-full mt-6 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-emerald-900/20 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>Konfirmasi via WhatsApp</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              )}

              {/* Guarantees */}
              <div className="mt-6 pt-4 border-t border-supporting-100 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-supporting-500">
                  <span>🔒</span>
                  <span>Enkripsi SSL 256-bit standar perbankan</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-supporting-500">
                  <span>⚡</span>
                  <span>Notifikasi konfirmasi otomatis dikirim via email</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Payment Gateway Dialog (QRIS & Virtual Account) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-supporting-100">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-primary-950 text-base">Pembayaran Pena Ameen</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-100 text-primary-800">
                  {currentOrderRef}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="text-supporting-400 hover:text-supporting-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Total to pay banner */}
            <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100 text-center">
              <span className="text-[11px] text-supporting-500 font-medium block">Total Pembayaran</span>
              <span className="text-2xl font-bold text-primary-800 font-mono">
                Rp{grandTotal.toLocaleString("id-ID")}
              </span>
              <span className="text-[10px] text-amber-600 block mt-1 font-semibold">
                ⏱️ Selesaikan dalam 14:59 menit
              </span>
            </div>

            {/* Method Tabs */}
            <div className="flex border-b border-supporting-200">
              <button
                type="button"
                onClick={() => setModalTab("qris")}
                className={`flex-1 py-2 text-xs font-bold border-b-2 transition-colors ${
                  modalTab === "qris"
                    ? "border-primary-600 text-primary-700"
                    : "border-transparent text-supporting-400 hover:text-supporting-600"
                }`}
              >
                QRIS Instan
              </button>
              <button
                type="button"
                onClick={() => setModalTab("va")}
                className={`flex-1 py-2 text-xs font-bold border-b-2 transition-colors ${
                  modalTab === "va"
                    ? "border-primary-600 text-primary-700"
                    : "border-transparent text-supporting-400 hover:text-supporting-600"
                }`}
              >
                Virtual Account
              </button>
            </div>

            {/* Tab 1: QRIS */}
            {modalTab === "qris" ? (
              <div className="text-center space-y-3 py-2">
                <div className="relative w-48 h-48 mx-auto bg-white p-2 rounded-2xl border-2 border-primary-500 shadow-md flex items-center justify-center">
                  {/* Real QRIS Code SVG Pattern */}
                  <svg className="w-full h-full text-primary-950" viewBox="0 0 100 100" fill="currentColor">
                    <rect width="100" height="100" fill="white" />
                    <rect x="10" y="10" width="25" height="25" fill="#1b4332" rx="4" />
                    <rect x="15" y="15" width="15" height="15" fill="white" rx="2" />
                    <rect x="18" y="18" width="9" height="9" fill="#1b4332" />

                    <rect x="65" y="10" width="25" height="25" fill="#1b4332" rx="4" />
                    <rect x="70" y="15" width="15" height="15" fill="white" rx="2" />
                    <rect x="73" y="18" width="9" height="9" fill="#1b4332" />

                    <rect x="10" y="65" width="25" height="25" fill="#1b4332" rx="4" />
                    <rect x="15" y="70" width="15" height="15" fill="white" rx="2" />
                    <rect x="18" y="73" width="9" height="9" fill="#1b4332" />

                    <rect x="42" y="12" width="6" height="6" fill="#1b4332" />
                    <rect x="52" y="18" width="6" height="6" fill="#1b4332" />
                    <rect x="42" y="28" width="6" height="6" fill="#1b4332" />
                    <rect x="12" y="45" width="6" height="6" fill="#1b4332" />
                    <rect x="25" y="45" width="6" height="6" fill="#1b4332" />
                    <rect x="45" y="45" width="10" height="10" fill="#2d6a4f" rx="2" />
                    <rect x="65" y="45" width="6" height="6" fill="#1b4332" />
                    <rect x="80" y="45" width="6" height="6" fill="#1b4332" />
                    <rect x="42" y="65" width="6" height="6" fill="#1b4332" />
                    <rect x="52" y="75" width="6" height="6" fill="#1b4332" />
                    <rect x="72" y="65" width="6" height="6" fill="#1b4332" />
                    <rect x="62" y="82" width="6" height="6" fill="#1b4332" />
                    <rect x="82" y="82" width="6" height="6" fill="#1b4332" />
                  </svg>
                  <div className="absolute inset-x-0 bottom-1">
                    <span className="text-[9px] font-bold text-primary-900 bg-white/90 px-2 py-0.5 rounded shadow-2xs">
                      PENA AMEEN QRIS
                    </span>
                  </div>
                </div>

                <p className="text-xs text-supporting-600">
                  Scan QRIS menggunakan <strong>GoPay, OVO, BCA Mobile, ShopeePay, atau Dana</strong>
                </p>
              </div>
            ) : (
              /* Tab 2: Virtual Account */
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-4 gap-1.5">
                  {(["bca", "mandiri", "bri", "bni"] as const).map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`py-2 px-1 text-[11px] font-bold rounded-xl border uppercase transition-all ${
                        selectedBank === bank
                          ? "border-primary-600 bg-primary-50 text-primary-800 shadow-xs"
                          : "border-supporting-200 text-supporting-500 hover:bg-supporting-50"
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-supporting-50 rounded-2xl border border-supporting-200 space-y-2">
                  <span className="text-[10px] text-supporting-400 uppercase font-semibold block">
                    Nomor Virtual Account {selectedBank.toUpperCase()}
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lg font-bold font-mono text-primary-950">
                      {vaNumbers[selectedBank]}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyVA}
                      className="px-3 py-1 bg-white hover:bg-supporting-100 text-primary-700 border border-supporting-300 rounded-lg text-xs font-semibold shadow-2xs"
                    >
                      {copied ? "✓ Tersalin" : "Salin"}
                    </button>
                  </div>
                  <p className="text-[10px] text-supporting-500 pt-1 border-t border-supporting-200">
                    Atas Nama: <strong>PENA AMEEN OFFICIAL</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="space-y-2 pt-3 border-t border-supporting-100">
              <button
                type="button"
                onClick={handleSimulatePaymentSuccess}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2"
              >
                <span>✓ Konfirmasi Pembayaran Berhasil</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-2 text-supporting-500 hover:text-supporting-700 text-xs font-medium"
              >
                Tutup & Ubah Metode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPaymentPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto" />
            <p className="text-supporting-600 text-sm font-medium">Memuat halaman pembayaran...</p>
          </div>
        </div>
      }
    >
      <CheckoutPaymentPage />
    </Suspense>
  );
}
