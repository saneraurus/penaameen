"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  subtotal: string;
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
  subtotal: string;
  shippingCost: string;
  total: string;
  createdAt: string;
  shippingAddress: {
    recipientName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  shippingMethod: string | null;
  items: OrderItem[];
  statusHistory: StatusHistory[];
}

const statusLabels: Record<string, string> = {
  PENDING_PAYMENT: "Menunggu Pembayaran",
  PAID: "Dibayar",
  PROCESSING: "Diproses",
  SHIPPED: "Dikirim",
  DELIVERED: "Terkirim",
  CANCELLED: "Dibatalkan",
  REFUNDED: "Dikembalikan",
};

function OrderDetailInner() {
  const params = useParams<{ id: string }>();
  const { isSignedIn, isLoaded } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn || !params.id) return;
    async function load() {
      try {
        const res = await fetch(`/api/orders/${params.id}`).then((r) => r.json());
        if (res.error) {
          setError(res.error);
          return;
        }
        setOrder(res.order);
      } catch {
        setError("Gagal memuat pesanan");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [isSignedIn, params.id]);

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error ?? "Pesanan tidak ditemukan"}</p>
          <Link href="/orders" className="text-primary-600 hover:underline">← Kembali ke Pesanan</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-50">
      <div className="container px-4 mx-auto py-12">
        <Link href="/orders" className="text-supporting-600 hover:text-primary-600">← Kembali ke Pesanan</Link>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-3xl font-serif text-primary-600">{order.orderNumber}</h1>
          <span className="px-4 py-1.5 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
            {statusLabels[order.status] ?? order.status}
          </span>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-primary-600">Item Pesanan</h2>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-supporting-200">
                <div className="flex-1">
                  <p className="font-medium">{item.product?.name ?? "Produk"}</p>
                  <p className="text-sm text-supporting-600">
                    {item.quantity} × Rp{Number(item.price).toLocaleString()}
                  </p>
                </div>
                <p className="font-semibold">Rp{Number(item.subtotal).toLocaleString()}</p>
              </div>
            ))}

            <div className="mt-6 p-4 bg-white rounded-xl border border-supporting-200">
              <h2 className="text-xl font-semibold text-primary-600 mb-3">Alamat Pengiriman</h2>
              <p className="font-medium">{order.shippingAddress.recipientName} • {order.shippingAddress.phone}</p>
              <p className="text-supporting-600">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}, {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
              </p>
              {order.shippingMethod && (
                <p className="mt-2 text-sm text-supporting-600">Kurir: {order.shippingMethod}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white rounded-xl border border-supporting-200">
              <h2 className="text-lg font-semibold text-primary-600 mb-3">Ringkasan</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-supporting-600">Subtotal</span><span>Rp{Number(order.subtotal).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-supporting-600">Ongkir</span><span>Rp{Number(order.shippingCost).toLocaleString()}</span></div>
                <div className="flex justify-between font-semibold pt-2 border-t"><span>Total</span><span>Rp{Number(order.total).toLocaleString()}</span></div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-supporting-200">
              <h2 className="text-lg font-semibold text-primary-600 mb-3">Status</h2>
              <ol className="space-y-3">
                {order.statusHistory.map((h) => (
                  <li key={h.id} className="flex gap-3">
                    <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary-600" />
                    <div>
                      <p className="text-sm font-medium">{statusLabels[h.status] ?? h.status}</p>
                      <p className="text-xs text-supporting-500">
                        {new Date(h.createdAt).toLocaleString("id-ID")}
                      </p>
                      {h.note && <p className="text-xs text-supporting-600">{h.note}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
    </div>}>
      <OrderDetailInner />
    </Suspense>
  );
}
