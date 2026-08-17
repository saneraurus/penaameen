"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OrderTransition } from "@/lib/admin/orders";

const TRANSITION_LABELS: Record<OrderTransition, string> = {
  mark_paid: "Mark Paid",
  mark_processing: "Mark Processing",
  mark_completed: "Mark Completed",
  cancel: "Cancel Order",
  refund: "Refund",
  mark_fulfilled: "Mark Fulfilled",
  mark_shipped: "Mark Shipped",
  mark_delivered: "Mark Delivered",
};

export interface OrderActionButtonProps {
  orderId: string;
  transition: OrderTransition;
  variant?: "primary" | "danger" | "default";
}

export function OrderActionButton({
  orderId,
  transition,
  variant = "default",
}: OrderActionButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const variantClasses = {
    primary: "bg-primary-600 text-white hover:bg-primary-700",
    danger: "border border-red-300 text-red-600 hover:bg-red-50",
    default: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  };

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/transition`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transition }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="inline-flex flex-col gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]}`}
      >
        {loading ? "Working..." : TRANSITION_LABELS[transition]}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

export { TRANSITION_LABELS };
