"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-supporting-50 pt-12">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-2xl font-serif text-primary-600 mb-4">
              PENA AMEEN
            </h3>
            <p className="text-supporting-600">
              Pendamping belajar membaca, menulis, dan mengaji untuk anak, orang
              tua, guru, dan siapa saja yang ingin terus belajar.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-supporting-900 mb-4">Navigasi</h4>
            <nav className="space-y-2">
              <Link
                href="/"
                className="text-supporting-600 hover:text-primary-600"
              >
                Beranda
              </Link>
              <Link
                href="/tentang"
                className="text-supporting-600 hover:text-primary-600"
              >
                Tentang Kami
              </Link>
              <Link
                href="/metode"
                className="text-supporting-600 hover:text-primary-600"
              >
                Program / Metode
              </Link>
              <Link
                href="/produk"
                className="text-supporting-600 hover:text-primary-600"
              >
                Produk
              </Link>
              <Link
                href="/cabang"
                className="text-supporting-600 hover:text-primary-600"
              >
                Cabang
              </Link>
              <Link
                href="/artikel"
                className="text-supporting-600 hover:text-primary-600"
              >
                Artikel
              </Link>
              <Link
                href="/kontak"
                className="text-supporting-600 hover:text-primary-600"
              >
                Kontak
              </Link>
            </nav>
          </div>
          <div>
            <h4 className="font-serif text-supporting-900 mb-4">
              Kategori Produk
            </h4>
            <nav className="space-y-2">
              <Link
                href="#"
                className="text-supporting-600 hover:text-primary-600"
              >
                ACM
              </Link>
              <Link
                href="#"
                className="text-supporting-600 hover:text-primary-600"
              >
                Al-Barqy
              </Link>
              <Link
                href="#"
                className="text-supporting-600 hover:text-primary-600"
              >
                Anak-Anak
              </Link>
              <Link
                href="#"
                className="text-supporting-600 hover:text-primary-600"
              >
                Flashcard
              </Link>
              <Link
                href="#"
                className="text-supporting-600 hover:text-primary-600"
              >
                Buku
              </Link>
              <Link
                href="#"
                className="text-supporting-600 hover:text-primary-600"
              >
                Paket Belajar
              </Link>
              <Link
                href="#"
                className="text-supporting-600 hover:text-primary-600"
              >
                Aktivitas
              </Link>
              <Link
                href="#"
                className="text-supporting-600 hover:text-primary-600"
              >
                CD / Media Pembelajaran
              </Link>
              <Link
                href="#"
                className="text-supporting-600 hover:text-primary-600"
              >
                Lainnya
              </Link>
            </nav>
          </div>
          <div>
            <h4 className="font-serif text-supporting-900 mb-4">Legal</h4>
            <nav className="space-y-2">
              <Link
                href="#"
                className="text-supporting-600 hover:text-primary-600"
              >
                Kebijakan Privasi
              </Link>
              <Link
                href="#"
                className="text-supporting-600 hover:text-primary-600"
              >
                Syarat & Ketentuan
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-supporting-200 text-center text-supporting-500 text-sm">
          &copy; {new Date().getFullYear()} PENA AMEEN. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
