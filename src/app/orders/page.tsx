"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  subtotal: string;
  product: { name: string; image: string } | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: string;
  createdAt: string;
  items: OrderItem[];
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

export default function OrdersPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect_url=" + encodeURIComponent("/orders"));
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!isSignedIn) return;
    async function load() {
      try {
        const res = await fetch("/api/orders").then((r) => r.json());
        setOrders(res.orders ?? []);
      } catch {
        setError("Gagal memuat pesanan");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [isSignedIn]);

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-50">
      <div className="container px-4 mx-auto py-12">
        <h1 className="text-3xl font-serif text-primary-600 mb-8">Pesanan Saya</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-supporting-600 mb-4">Anda belum memiliki pesanan.</p>
            <Link href="/produk" className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block p-6 bg-white rounded-2xl border border-supporting-200 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-primary-600">{order.orderNumber}</p>
                    <p className="text-sm text-supporting-500">
                      {new Date(order.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Rp{Number(order.total).toLocaleString()}</p>
                    <span className="inline-block mt-1 px-3 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-supporting-600">
                  {order.items.length} item • {order.items.map((i) => i.product?.name).join(", ")}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
