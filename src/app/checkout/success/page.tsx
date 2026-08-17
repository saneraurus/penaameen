"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: string;
  shippingAddress: {
    recipientName: string;
    addressLine1: string;
    city: string;
    province: string;
    postalCode: string;
  };
}

function SuccessPageInner() {
  const params = useSearchParams();
  const orderId = params.get("order_id");
  const pending = params.get("pending");
  const { clearCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }
    let active = true;
    async function load() {
      try {
        const res = await fetch(`/api/orders/${orderId}`).then((r) => r.json());
        if (active && res.order) setOrder(res.order);
      } catch {
        // ignore
      } finally {
        if (active) setIsLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [orderId]);

  return (
    <div className="min-h-screen bg-background-50">
      <div className="container px-4 mx-auto py-16 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-serif text-primary-600 mb-2">
          {pending ? "Menunggu Pembayaran" : "Pesanan Diterima!"}
        </h1>
        <p className="text-supporting-600 mb-8">
          {pending
            ? "Silakan selesaikan pembayaran Anda. Kami akan mengonfirmasi pesanan setelah pembayaran berhasil."
            : "Terima kasih! Pesanan Anda sedang kami proses. Konfirmasi akan dikirim ke email Anda."}
        </p>

        {isLoading ? (
          <p className="text-supporting-600">Memuat detail pesanan...</p>
        ) : order ? (
          <div className="mx-auto max-w-md rounded-2xl border border-supporting-200 bg-white p-6 text-left">
            <p className="mb-1"><span className="text-supporting-500">No. Pesanan:</span> <strong>{order.orderNumber}</strong></p>
            <p className="mb-1"><span className="text-supporting-500">Total:</span> <strong>Rp{Number(order.total).toLocaleString()}</strong></p>
            <p className="mb-1"><span className="text-supporting-500">Status:</span> {order.status}</p>
            {order.shippingAddress && (
              <p className="mt-3 text-sm text-supporting-600">
                Kirim ke: {order.shippingAddress.recipientName}, {order.shippingAddress.addressLine1}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
              </p>
            )}
          </div>
        ) : null}

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/orders" className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700">
            Lihat Pesanan Saya
          </Link>
          <Link href="/produk" className="px-6 py-3 border border-supporting-300 rounded-xl hover:bg-supporting-50">
            Lanjut Belanja
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
    </div>}>
      <SuccessPageInner />
    </Suspense>
  );
}
