"use client";

import { Suspense, useEffect, useRef, useState } from "react";
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

interface CheckoutAddress {
  id: string;
  recipientName?: string;
  phone?: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string | null;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

interface CasakuPaymentData {
  transactionId: string;
  qrString?: string;
  originalAmount: number;
  totalAmount: number;
  uniqueNominal: number;
  expiredInMinutes: number;
  paymentUrl?: string;
  expiresAt: string;
}

function casakuQrImageUrl(data: string): string {
  const url = new URL("https://larabert-qrgen.hf.space/v1/create-qr-code");
  url.searchParams.set("size", "300x300");
  url.searchParams.set("style", "2");
  url.searchParams.set("color", "111111");
  url.searchParams.set("data", data);
  return url.toString();
}

async function loadSnapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.snap) return resolve();
    const isProduction =
      process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
    const snapUrl = isProduction
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";
    const script = document.createElement("script");
    script.src = snapUrl;
    script.dataset.clientKey =
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";
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

  const addressId = params.get("addressId");
  const shippingMethod = params.get("shippingMethod");
  const shippingCostRaw = params.get("shippingCost");
  const shippingCost = Number(shippingCostRaw ?? 0);

  const checkoutIncomplete =
    !addressId ||
    !shippingMethod ||
    !shippingCostRaw ||
    Number.isNaN(shippingCost);

  const [paymentMethod, setPaymentMethod] = useState<
    "qris" | "midtrans" | "manual"
  >("qris");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressData, setAddressData] = useState<CheckoutAddress | null>(null);
  const [casakuData, setCasakuData] = useState<CasakuPaymentData | null>(null);
  const [qrImageFailed, setQrImageFailed] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const qrPanelRef = useRef<HTMLDivElement | null>(null);

  // Countdown timer for the active QRIS payment.
  useEffect(() => {
    if (!casakuData) return;
    const tick = () => {
      const remaining = Math.max(
        0,
        Math.floor(
          (new Date(casakuData.expiresAt).getTime() - Date.now()) / 1000,
        ),
      );
      setCountdown(remaining);
      if (remaining === 0) setCasakuData(null);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [casakuData]);

  // Auth Guard
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push(
        "/sign-in?redirect_url=" +
          encodeURIComponent(window.location.pathname + window.location.search),
      );
    }
  }, [isLoaded, isSignedIn, router]);

  // Load selected address details from local storage / user profile
  useEffect(() => {
    // 1. Check selected address directly
    try {
      const selectedSaved = localStorage.getItem(
        "penaameen_checkout_selected_address",
      );
      if (selectedSaved) {
        const parsed = JSON.parse(selectedSaved) as CheckoutAddress;
        if (parsed) {
          setAddressData(parsed);
          return;
        }
      }
    } catch {
      // Ignored
    }

    // 2. Check addresses list
    try {
      const saved = localStorage.getItem("penaameen_checkout_addresses");
      if (saved) {
        const list = JSON.parse(saved) as CheckoutAddress[];
        const found = addressId
          ? list.find((a) => a.id === addressId)
          : list[0];
        if (found) {
          setAddressData(found);
          return;
        }
      }
    } catch {
      // Ignored
    }

    // 3. Fallback to active user profile
    const dynamicName =
      user?.fullName ||
      (user?.firstName
        ? `${user.firstName} ${user.lastName || ""}`.trim()
        : "");

    setAddressData({
      id: addressId || "addr-default-1",
      recipientName: dynamicName,
      phone: "",
      addressLine1: "",
      city: "",
      province: "",
      postalCode: "",
      country: "Indonesia",
    });
  }, [addressId, user]);

  const grandTotal =
    cartTotal + (Number.isNaN(shippingCost) ? 0 : shippingCost);

  const createLiveOrderOnServer = async () => {
    const realEmail =
      user?.primaryEmailAddress?.emailAddress ||
      user?.emailAddresses?.[0]?.emailAddress ||
      "customer@penaameen.com";

    const realName =
      user?.fullName ||
      (user?.firstName
        ? `${user.firstName} ${user.lastName || ""}`.trim()
        : null) ||
      addressData?.recipientName ||
      "";

    const currentShippingMethod = shippingMethod || "JNE Express — REG";

    const finalAddress = addressData || {
      id: addressId || "addr-default-1",
      recipientName: realName,
      phone: "",
      addressLine1: "",
      city: "",
      province: "",
      postalCode: "",
      country: "Indonesia",
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: addressId || "addr-default-1",
          shippingMethod: currentShippingMethod,
          shippingCost: Number.isNaN(shippingCost) ? 8000 : shippingCost,
          customerEmail: realEmail,
          customerName: realName,
          items: cartItems.map((item) => ({
            productId: item.product.id,
            slug: item.product.slug,
            quantity: item.quantity,
            name: item.product.name,
            price: Number(item.product?.price || 378000),
            image: item.product?.image,
          })),
          shippingAddress: finalAddress,
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

    try {
      // 1. Create order on server
      const data = await createLiveOrderOnServer();
      if (!data?.orderNumber) {
        setError(
          "Pesanan gagal dibuat di server. Silakan coba lagi atau gunakan transfer manual.",
        );
        setIsProcessing(false);
        return;
      }

      // If a real Snap token exists on server, load the Snap dialog
      if (data?.snapToken) {
        await loadSnapScript();

        if (window.snap) {
          window.snap.pay(data.snapToken, {
            onSuccess: () => {
              saveOrderToLocalHistory(data.orderNumber, "PAID");
              clearCart();
              router.push(`/checkout/success?order_id=${data.orderNumber}`);
            },
            onPending: () => {
              saveOrderToLocalHistory(data.orderNumber, "PENDING_PAYMENT");
              clearCart();
              router.push(
                `/checkout/success?order_id=${data.orderNumber}&pending=1`,
              );
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

      // No snap token: do not fabricate a payment channel.
      setError(
        "Pembayaran otomatis belum tersedia saat ini. Silakan gunakan Transfer Bank Manual dan konfirmasi via WhatsApp.",
      );
      setIsProcessing(false);
    } catch {
      setError(
        "Gagal terhubung ke penyedia pembayaran. Silakan gunakan Transfer Bank Manual.",
      );
      setIsProcessing(false);
    }
  };

  const handlePayQris = async () => {
    setIsProcessing(true);
    setError(null);
    setCasakuData(null);
    setQrImageFailed(false);

    try {
      const data = await createLiveOrderOnServer();
      if (!data?.orderNumber) {
        setError(
          "Pesanan gagal dibuat di server. Silakan coba lagi atau gunakan pembayaran lain.",
        );
        setIsProcessing(false);
        return;
      }

      if (data?.casaku?.transactionId) {
        setCasakuData(data.casaku as CasakuPaymentData);
        setIsProcessing(false);
        requestAnimationFrame(() => {
          qrPanelRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
        return;
      }

      // Casaku unavailable: fall back to Midtrans Snap when possible.
      if (data?.snapToken) {
        await loadSnapScript();
        if (window.snap) {
          window.snap.pay(data.snapToken, {
            onSuccess: () => {
              saveOrderToLocalHistory(data.orderNumber, "PAID");
              clearCart();
              router.push(`/checkout/success?order_id=${data.orderNumber}`);
            },
            onPending: () => {
              saveOrderToLocalHistory(data.orderNumber, "PENDING_PAYMENT");
              clearCart();
              router.push(
                `/checkout/success?order_id=${data.orderNumber}&pending=1`,
              );
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

      setError(
        data?.casakuError
          ? `Pembayaran otomatis belum tersedia: ${data.casakuError}. Silakan gunakan Transfer Bank Manual dan konfirmasi via WhatsApp.`
          : "Pembayaran otomatis belum tersedia saat ini. Silakan gunakan Transfer Bank Manual dan konfirmasi via WhatsApp.",
      );
      setIsProcessing(false);
    } catch {
      setError(
        "Gagal terhubung ke penyedia pembayaran. Silakan gunakan Transfer Bank Manual.",
      );
      setIsProcessing(false);
    }
  };

  const handleCheckCasakuStatus = async () => {
    if (!casakuData) return;
    setCheckingPayment(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/casaku/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: casakuData.transactionId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(
          data?.error || "Gagal memeriksa status pembayaran. Coba lagi.",
        );
        setCheckingPayment(false);
        return;
      }

      if (data?.order?.status === "PAID") {
        saveOrderToLocalHistory(data.order.orderNumber, "PAID");
        clearCart();
        router.push(`/checkout/success?order_id=${data.order.orderNumber}`);
        return;
      }

      if (data?.order?.status === "CANCELLED") {
        setError(
          "Pembayaran QRIS tidak ditemukan atau dibatalkan. Silakan buat pesanan ulang.",
        );
        setCasakuData(null);
        setCheckingPayment(false);
        return;
      }

      setError("Pembayaran belum terdeteksi. Silakan scan ulang QRIS.");
      setCheckingPayment(false);
    } catch {
      setError("Gagal memeriksa status pembayaran. Coba lagi.");
      setCheckingPayment(false);
    }
  };

  const saveOrderToLocalHistory = (orderId: string, status = "PAID") => {
    try {
      const existing = JSON.parse(
        localStorage.getItem("penaameen_orders_history") || "[]",
      );
      const newOrder = {
        id: orderId,
        orderNumber: orderId.startsWith("PA-") ? orderId : `PA-${orderId}`,
        status,
        subtotal: String(cartTotal),
        shippingCost: String(shippingCost),
        total: String(grandTotal),
        createdAt: new Date().toISOString(),
        ...(addressData ? { shippingAddress: addressData } : {}),
        shippingMethod: (shippingMethod ?? "").toUpperCase(),
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
            id: `sh-${orderId}-${status.toLowerCase()}`,
            status,
            note:
              status === "PAID"
                ? "Pembayaran tercatat di server"
                : "Pesanan dicatat, menunggu verifikasi pembayaran",
            createdAt: new Date().toISOString(),
          },
        ],
      };
      localStorage.setItem(
        "penaameen_orders_history",
        JSON.stringify([newOrder, ...existing]),
      );
    } catch (e) {
      console.warn("Failed to persist order locally", e);
    }
  };

  const handleManualWhatsAppConfirmation = async () => {
    setIsProcessing(true);
    setError(null);

    const adminWhatsApp = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "";
    if (!adminWhatsApp) {
      setError(
        "Nomor WhatsApp admin belum dikonfigurasi. Silakan hubungi admin Pena Ameen untuk konfirmasi pembayaran.",
      );
      setIsProcessing(false);
      return;
    }

    const serverResult = await createLiveOrderOnServer();
    if (!serverResult?.orderNumber) {
      setError(
        "Pesanan gagal dibuat di server. Silakan coba lagi setelah beberapa saat.",
      );
      setIsProcessing(false);
      return;
    }

    saveOrderToLocalHistory(serverResult.orderNumber, "PENDING_PAYMENT");
    const text = `Halo Admin Pena Ameen, saya ingin konfirmasi pesanan dengan nomor ${serverResult.orderNumber} sebesar Rp${grandTotal.toLocaleString("id-ID")}. Mohon info rekening transfer. Terima kasih!`;
    const waUrl = `https://wa.me/${adminWhatsApp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
    clearCart();
    window.open(waUrl, "_blank");
    router.push(
      `/checkout/success?order_id=${serverResult.orderNumber}&pending=1`,
    );
  };

  if (checkoutIncomplete) {
    return (
      <div className="min-h-screen bg-background-50 pb-24">
        <div className="container px-4 mx-auto py-24 text-center">
          <div className="bg-white rounded-3xl border border-supporting-200 p-10 max-w-md mx-auto shadow-xs">
            <span className="text-3xl">🧭</span>
            <h1 className="text-lg font-serif font-bold text-primary-950 mt-3">
              Checkout Belum Lengkap
            </h1>
            <p className="text-xs text-supporting-600 mt-2">
              Silakan pilih alamat pengiriman dan kurir terlebih dahulu.
            </p>
            <Link
              href="/checkout/address"
              className="inline-block mt-5 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-2xl transition-all shadow-md"
            >
              Pilih Alamat & Kurir
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
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
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 text-xs font-bold"
            >
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
                  <p className="font-bold text-primary-950">
                    {addressData?.recipientName || "—"}
                  </p>
                  <p className="text-supporting-500">
                    {addressData?.phone || "—"}
                  </p>
                  <p className="text-supporting-600 mt-1 leading-relaxed">
                    {addressData
                      ? `${addressData.addressLine1 || ""}${
                          addressData.city ? `, ${addressData.city}` : ""
                        }`
                      : "—"}
                  </p>
                </div>

                <div className="sm:border-l sm:border-supporting-100 sm:pl-4">
                  <span className="text-[10px] text-supporting-400 font-semibold uppercase tracking-wider block mb-1">
                    Kurir Dipilih
                  </span>
                  <p className="font-bold text-primary-950 uppercase">
                    {shippingMethod.replace("-", " — ")}
                  </p>
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
                  <h2 className="text-lg font-serif font-bold text-primary-950">
                    Metode Pembayaran
                  </h2>
                  <p className="text-xs text-supporting-500">
                    Pilih opsi pembayaran yang paling nyaman untuk Anda
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Option 1: Casaku QRIS (primary) */}
                <label
                  className={`block p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    paymentMethod === "qris"
                      ? "border-primary-600 bg-primary-50/40 shadow-xs ring-1 ring-primary-500/20"
                      : "border-supporting-200 hover:border-supporting-300 hover:bg-supporting-50/30"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentMethod === "qris"}
                      onChange={() => setPaymentMethod("qris")}
                      className="mt-1 text-primary-600 focus:ring-primary-500"
                    />

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <span className="text-sm font-bold text-primary-950">
                          QRIS (Casaku)
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          Verifikasi Otomatis 24/7
                        </span>
                      </div>

                      <p className="text-xs text-supporting-600 leading-relaxed mb-3">
                        Scan QRIS dengan aplikasi mana pun (GoPay, OVO,
                        ShopeePay, Dana, Livin&apos;, BRImo, MyBCA, dan
                        lainnya). Nominal QR menyesuaikan total pesanan Anda.
                      </p>

                      {/* Payment Badges Icons */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-supporting-100">
                        {[
                          "QRIS",
                          "GoPay",
                          "OVO",
                          "ShopeePay",
                          "Dana",
                          "Livin'",
                          "BRImo",
                          "MyBCA",
                        ].map((badge) => (
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

                {/* Option 2: Midtrans Online Payment (backup) */}
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
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-supporting-100 text-supporting-600">
                          Opsi Cadangan
                        </span>
                      </div>

                      <p className="text-xs text-supporting-600 leading-relaxed mb-3">
                        Bayar instan dengan QRIS (GoPay, OVO, ShopeePay, Dana)
                        atau Transfer Virtual Account (BCA, Mandiri, BNI, BRI,
                        Permata).
                      </p>

                      {/* Payment Badges Icons */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-supporting-100">
                        {[
                          "QRIS",
                          "BCA VA",
                          "Mandiri",
                          "BNI",
                          "BRI",
                          "GoPay",
                          "ShopeePay",
                        ].map((badge) => (
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

                {/* Option 3: Manual Bank Transfer */}
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
                        Transfer langsung ke rekening resmi Pena Ameen dan
                        konfirmasi bukti transfer via CS WhatsApp. Detail
                        rekening resmi dikonfirmasi melalui WhatsApp.
                      </p>

                      {paymentMethod === "manual" && (
                        <div className="mt-3 p-3.5 bg-white rounded-xl border border-supporting-200 text-xs">
                          <p className="text-supporting-600 leading-relaxed">
                            Setelah pembayaran dibuat, pesanan dicatat sebagai
                            <strong> menunggu verifikasi</strong> hingga admin
                            mengonfirmasi transfer.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              </div>
            </div>
            {/* QRIS Payment Panel */}
            {paymentMethod === "qris" && casakuData && (
              <div
                ref={qrPanelRef}
                className="bg-white rounded-3xl border border-primary-200/80 p-6 md:p-8 shadow-xs"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50 text-primary-700 font-bold text-sm border border-primary-100">
                    🪙
                  </span>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-primary-950">
                      Scan QRIS untuk Membayar
                    </h3>
                    <p className="text-xs text-supporting-500">
                      Kode QR berlaku {casakuData.expiredInMinutes} menit ·
                      {countdown !== null && (
                        <span
                          className={
                            countdown <= 60
                              ? "text-red-600 font-bold"
                              : "text-supporting-700 font-semibold"
                          }
                        >
                          {" "}
                          sisa {Math.floor(countdown / 60)}:
                          {String(countdown % 60).padStart(2, "0")}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative w-56 h-56 rounded-2xl border border-supporting-200 bg-white p-3 shadow-sm flex-shrink-0">
                    {casakuData.qrString && !qrImageFailed ? (
                      <Image
                        src={casakuQrImageUrl(casakuData.qrString)}
                        alt="Kode QRIS Pena Ameen"
                        fill
                        sizes="224px"
                        className="object-contain rounded-xl"
                        onError={() => setQrImageFailed(true)}
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-center text-[11px] text-supporting-500 px-3">
                        Gagal memuat QR. Gunakan tombol &quot;Buka Halaman
                        Pembayaran&quot; di bawah.
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-3 text-sm">
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 mb-0.5">
                        Nominal yang Harus Dibayar
                      </p>
                      <p className="text-2xl font-bold text-emerald-800">
                        Rp{casakuData.totalAmount.toLocaleString("id-ID")}
                      </p>
                      {casakuData.uniqueNominal > 0 && (
                        <p className="text-[11px] text-emerald-700/80 mt-0.5">
                          Termasuk kode unik Rp
                          {casakuData.uniqueNominal.toLocaleString(
                            "id-ID",
                          )}{" "}
                          untuk verifikasi otomatis
                        </p>
                      )}
                    </div>

                    <ol className="list-decimal list-inside text-xs text-supporting-600 space-y-1.5 leading-relaxed">
                      <li>
                        Buka aplikasi pembayaran (GoPay, OVO, Dana, ShopeePay,
                        Livin&apos;, BRImo, MyBCA, dll.)
                      </li>
                      <li>
                        Pilih menu Scan / QRIS, lalu pindai kode di samping
                      </li>
                      <li>
                        Periksa kembali nominal — harus sesuai total di atas
                      </li>
                      <li>Konfirmasi pembayaran, lalu tekan tombol di bawah</li>
                    </ol>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleCheckCasakuStatus}
                        disabled={checkingPayment}
                        className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-2"
                      >
                        {checkingPayment ? (
                          <>
                            <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                            <span>Memeriksa...</span>
                          </>
                        ) : (
                          <span>✓ Saya Sudah Bayar</span>
                        )}
                      </button>
                      {casakuData.paymentUrl && (
                        <a
                          href={casakuData.paymentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 bg-white border border-supporting-300 hover:bg-supporting-50 text-supporting-700 text-xs font-bold rounded-xl transition-all"
                        >
                          Buka Halaman Pembayaran ↗
                        </a>
                      )}
                      {casakuData.qrString && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              casakuData.qrString as string,
                            );
                            alert("Kode QRIS berhasil disalin!");
                          }}
                          className="px-5 py-2.5 bg-white border border-supporting-300 hover:bg-supporting-50 text-supporting-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                        >
                          Salin Kode QR
                        </button>
                      )}
                    </div>

                    {countdown !== null && countdown <= 60 && (
                      <p className="text-[11px] text-red-600 font-medium">
                        QR hampir kedaluwarsa — selesaikan pembayaran sekarang,
                        atau buat QR baru dengan menekan &quot;Bayar
                        Sekarang&quot;.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
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
                  <div
                    key={item.id}
                    className="py-2.5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-9 h-9 rounded-lg bg-supporting-100 overflow-hidden flex-shrink-0 border border-supporting-200">
                        <Image
                          src={
                            item.product.image ||
                            "/images/penaameen/products/home-learning.jpg"
                          }
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-primary-950 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-[10px] text-supporting-500">
                          Jumlah: {item.quantity} unit
                        </p>
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
                  <span className="font-semibold text-primary-950">
                    Rp{cartTotal.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex justify-between text-supporting-600">
                  <span>Ongkos Kirim ({shippingMethod.toUpperCase()})</span>
                  <span className="font-semibold text-primary-950">
                    Rp{shippingCost.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="pt-3.5 border-t border-supporting-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-primary-950 block">
                      Total Tagihan
                    </span>
                    <span className="text-[10px] text-supporting-400">
                      Total bersih yang dibayarkan
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-primary-700">
                    Rp{grandTotal.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {paymentMethod === "qris" ? (
                <button
                  type="button"
                  onClick={handlePayQris}
                  disabled={isProcessing}
                  className="w-full mt-6 py-4 px-6 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-primary-900/20 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>Membuat QRIS...</span>
                    </>
                  ) : (
                    <>
                      <span>Bayar Sekarang (Buat QRIS)</span>
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </>
                  )}
                </button>
              ) : paymentMethod === "midtrans" ? (
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
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleManualWhatsAppConfirmation}
                  disabled={isProcessing}
                  className="w-full mt-6 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-emerald-900/20 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <span>Konfirmasi via WhatsApp</span>
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </>
                  )}
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
            <p className="text-supporting-600 text-sm font-medium">
              Memuat halaman pembayaran...
            </p>
          </div>
        </div>
      }
    >
      <CheckoutPaymentPage />
    </Suspense>
  );
}
