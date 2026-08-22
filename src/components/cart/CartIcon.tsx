"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

export function CartIcon() {
  const { itemCount, isLoading } = useCart();
  const [bumping, setBumping] = useState(false);

  useEffect(() => {
    if (itemCount === 0) return;
    setBumping(true);
    const timer = setTimeout(() => setBumping(false), 400);
    return () => clearTimeout(timer);
  }, [itemCount]);

  if (isLoading) {
    return (
      <Link
        id="header-cart-icon"
        href="/keranjang"
        aria-label="Keranjang"
        className="flex h-11 w-11 items-center justify-center rounded-full text-supporting-600 transition-colors hover:bg-background-200 hover:text-primary-900"
      >
        <svg
          className="h-5 w-5 animate-pulse"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      </Link>
    );
  }

  return (
    <Link
      id="header-cart-icon"
      href="/checkout/address"
      aria-label={
        itemCount > 0 ? `Keranjang, ${itemCount} item` : "Keranjang, kosong"
      }
      className={`relative flex h-11 w-11 items-center justify-center rounded-full text-supporting-600 transition-all duration-300 hover:bg-background-200 hover:text-primary-900 ${
        bumping ? "scale-110 text-primary-900" : "scale-100"
      }`}
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {itemCount > 0 && (
        <span
          className={`absolute right-1 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-accent-600 text-[10px] font-semibold text-white transition-transform duration-300 ${
            bumping ? "scale-115" : "scale-100"
          }`}
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
