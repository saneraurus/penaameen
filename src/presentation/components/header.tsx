"use client";

import Link from "next/link";
import { useState } from "react";
import { Show, UserButton } from "@clerk/nextjs";
import { CartIcon } from "@/components/cart/CartIcon";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-secondary-50/95 backdrop-blur-sm sticky top-0 z-50 border-b border-supporting-200">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-serif text-primary-600">
              PENA AMEEN
            </Link>
          </div>
          <nav className="hidden md:flex md:items-center md:gap-8">
            <Link
              href="/"
              className="text-supporting-600 hover:text-primary-600 transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="/tentang"
              className="text-supporting-600 hover:text-primary-600 transition-colors"
            >
              Tentang Kami
            </Link>
            <Link
              href="/metode"
              className="text-supporting-600 hover:text-primary-600 transition-colors"
            >
              Program / Metode
            </Link>
            <Link
              href="/produk"
              className="text-supporting-600 hover:text-primary-600 transition-colors"
            >
              Produk
            </Link>
            <Link
              href="/cabang"
              className="text-supporting-600 hover:text-primary-600 transition-colors"
            >
              Cabang
            </Link>
            <Link
              href="/artikel"
              className="text-supporting-600 hover:text-primary-600 transition-colors"
            >
              Artikel
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-supporting-500 hover:text-primary-600 md:hidden"
              aria-label="Open menu"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <CartIcon />
            <Show when="signed-in">
              <UserButton />
            </Show>
            <Show when="signed-out">
              <Link
                href="/sign-in"
                className="hidden md:inline-flex px-3.5 py-1.5 text-supporting-700 hover:text-primary-700 font-medium text-sm transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/sign-up"
                className="hidden md:inline-flex px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm transition-colors shadow-2xs"
              >
                Daftar
              </Link>
            </Show>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 border-t border-supporting-200 pt-4">
            <nav className="space-y-2">
              <Link
                href="/"
                className="block px-4 py-2 text-supporting-600 hover:text-primary-600"
              >
                Beranda
              </Link>
              <Link
                href="/tentang"
                className="block px-4 py-2 text-supporting-600 hover:text-primary-600"
              >
                Tentang Kami
              </Link>
              <Link
                href="/metode"
                className="block px-4 py-2 text-supporting-600 hover:text-primary-600"
              >
                Program / Metode
              </Link>
              <Link
                href="/produk"
                className="block px-4 py-2 text-supporting-600 hover:text-primary-600"
              >
                Produk
              </Link>
              <Link
                href="/cabang"
                className="block px-4 py-2 text-supporting-600 hover:text-primary-600"
              >
                Cabang
              </Link>
              <Link
                href="/artikel"
                className="block px-4 py-2 text-supporting-600 hover:text-primary-600"
              >
                Artikel
              </Link>
            </nav>
            <div className="mt-4 space-y-2">
              <Show when="signed-in">
                <Link
                  href="/orders"
                  className="block w-full px-4 py-2 bg-primary-600 text-white text-center rounded-md hover:bg-primary-700 transition-colors"
                >
                  Pesanan Saya
                </Link>
              </Show>
              <Show when="signed-out">
                <Link
                  href="/sign-in"
                  className="block w-full px-4 py-2 bg-primary-600 text-white text-center rounded-md hover:bg-primary-700 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/sign-up"
                  className="block w-full px-4 py-2 border border-primary-200 text-primary-600 text-center rounded-md hover:bg-primary-50"
                >
                  Daftar
                </Link>
              </Show>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}