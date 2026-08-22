"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

import {
  ActionLink,
  SceneIndex,
  SectionHeading,
  Shell,
  Skeleton,
} from "@/components/ui/primitives";

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
      <Shell className="py-20 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <SceneIndex
            index="04"
            label={pending ? "Menunggu Pembayaran" : "Pesanan Diterima"}
          />

          <SectionHeading level={1} className="mt-6">
            {pending ? "Menunggu Pembayaran" : "Pesanan Diterima!"}
          </SectionHeading>

          <p className="lede mt-6">
            {pending
              ? "Silakan selesaikan pembayaran Anda. Kami akan mengonfirmasi pesanan setelah pembayaran berhasil."
              : "Terima kasih! Pesanan Anda sedang kami proses. Konfirmasi akan dikirim ke email Anda."}
          </p>

          <div className="mt-12">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
                <p className="sr-only" role="status">
                  Memuat detail pesanan...
                </p>
              </div>
            ) : order ? (
              <dl className="border-t border-supporting-200">
                <div className="flex items-baseline justify-between gap-6 border-b border-supporting-200 py-4">
                  <dt className="text-sm text-supporting-500">No. Pesanan</dt>
                  <dd className="font-mono text-sm font-medium text-supporting-900">
                    {order.orderNumber}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 border-b border-supporting-200 py-4">
                  <dt className="text-sm text-supporting-500">Total</dt>
                  <dd className="font-serif text-xl text-supporting-900">
                    Rp{Number(order.total).toLocaleString()}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 border-b border-supporting-200 py-4">
                  <dt className="text-sm text-supporting-500">Status</dt>
                  <dd className="text-sm font-medium text-supporting-900">
                    {order.status}
                  </dd>
                </div>
                {order.shippingAddress && (
                  <div className="flex items-baseline justify-between gap-6 border-b border-supporting-200 py-4">
                    <dt className="text-sm text-supporting-500">Kirim ke</dt>
                    <dd className="max-w-sm text-right text-sm leading-relaxed text-supporting-700">
                      {order.shippingAddress.recipientName},{" "}
                      {order.shippingAddress.addressLine1},{" "}
                      {order.shippingAddress.city}{" "}
                      {order.shippingAddress.postalCode}
                    </dd>
                  </div>
                )}
              </dl>
            ) : null}
          </div>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <ActionLink href="/orders" tone="ink" size="lg">
              Lihat Pesanan Saya
            </ActionLink>
            <Link
              href="/produk"
              className="inline-flex min-h-13 items-center justify-center rounded-full border border-supporting-300 px-7 text-sm font-medium text-supporting-800 transition-colors hover:border-primary-700 hover:text-primary-900"
            >
              Lanjut Belanja
            </Link>
          </div>
        </div>
      </Shell>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background-50">
          <Shell className="py-20 sm:py-28">
            <div className="mx-auto max-w-2xl space-y-5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-12 w-72" />
              <Skeleton className="h-20 w-full" />
            </div>
          </Shell>
        </div>
      }
    >
      <SuccessPageInner />
    </Suspense>
  );
}
