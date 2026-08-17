"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

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
    const script = document.createElement("script");
    script.src = "https://app.midtrans.com/snap/snap.js";
    script.dataset.clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Midtrans"));
    document.body.appendChild(script);
  });
}

function CheckoutPaymentPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const addressId = params.get("addressId");
  const shippingMethod = params.get("shippingMethod");
  const shippingCost = params.get("shippingCost");

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect_url=" + encodeURIComponent(window.location.pathname + window.location.search));
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!isSignedIn) return;
    if (!addressId || !shippingMethod || !shippingCost) {
      setError("Data checkout tidak lengkap. Kembali ke langkah alamat.");
      setStatus("error");
      return;
    }

    let active = true;
    async function startPayment() {
      setStatus("loading");
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            addressId,
            shippingMethod,
            shippingCost: Number(shippingCost),
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Gagal membuat pesanan");
          setStatus("error");
          return;
        }

        if (!active) return;

        const token = data.snapToken as string;
        if (!token) {
          setError("Token pembayaran tidak diterima");
          setStatus("error");
          return;
        }

        await loadSnapScript();

        if (!window.snap) {
          setError("Gagal memuat Midtrans. Coba lagi.");
          setStatus("error");
          return;
        }

        window.snap.pay(token, {
          onSuccess: () => router.push(`/checkout/success?order_id=${data.orderId}`),
          onPending: () => router.push(`/checkout/success?order_id=${data.orderId}&pending=1`),
          onError: () => setError("Pembayaran gagal. Silakan coba lagi."),
          onClose: () => setError("Anda menutup pembayaran sebelum menyelesaikan."),
        });
      } catch {
        setError("Terjadi kesalahan. Silakan coba lagi.");
        setStatus("error");
      }
    }
    startPayment();
    return () => {
      active = false;
    };
  }, [isSignedIn, addressId, shippingMethod, shippingCost, router]);

  return (
    <div className="min-h-screen bg-background-50 flex items-center justify-center">
      <div className="container px-4 text-center py-12">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto mb-4" />
            <p className="text-supporting-600">Menyiapkan pembayaran...</p>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-2xl font-serif text-primary-600 mb-4">Tidak dapat melanjutkan</h1>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <Link href="/checkout/address" className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700">
                Kembali ke Alamat
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 border border-supporting-300 rounded-xl hover:bg-supporting-50"
              >
                Coba Lagi
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPaymentPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
    </div>}>
      <CheckoutPaymentPage />
    </Suspense>
  );
}
