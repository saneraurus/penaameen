"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function CartIcon() {
  const { itemCount, isLoading } = useCart();

  if (isLoading) {
    return (
      <Link href="/checkout/address" className="relative p-2 rounded-md text-supporting-500 hover:text-primary-600">
        <svg className="h-5 w-5 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      </Link>
    );
  }

  return (
    <Link href="/checkout/address" className="relative p-2 rounded-md text-supporting-500 hover:text-primary-600">
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center text-xs font-bold text-white bg-primary-600 rounded-full">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}