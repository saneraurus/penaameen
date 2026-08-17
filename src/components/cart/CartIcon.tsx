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
        href="/checkout/address"
        className="relative rounded-xl p-2 text-supporting-500 transition-colors hover:bg-supporting-100/80 hover:text-primary-700"
      >
        <svg
          className="h-5 w-5 animate-pulse"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
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
      className={`relative rounded-xl p-2 text-supporting-500 transition-all duration-300 hover:bg-supporting-100/80 hover:text-primary-700 ${
        bumping ? "scale-125 text-primary-600" : "scale-100"
      }`}
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {itemCount > 0 && (
        <span
          className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center text-xs font-bold text-white bg-primary-600 rounded-full transition-transform duration-300 ${
            bumping ? "scale-125 bg-primary-700 shadow-md" : "scale-100"
          }`}
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
