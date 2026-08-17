"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, BookOpenCheck } from "lucide-react";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/tentang" },
  { label: "Metode", href: "/metode" },
  { label: "Produk", href: "/produk" },
  { label: "Cabang", href: "/cabang" },
  { label: "Galeri Kegiatan", href: "/galeri-kegiatan" },
  { label: "Artikel", href: "/artikel" },
  { label: "Kontak", href: "/kontak" },
];

const categoryLinks = [
  { label: "Metode Al-Barqy", href: "/produk?q=al-barqy" },
  { label: "Metode ACM", href: "/produk?q=acm" },
  { label: "Flashcard", href: "/produk?q=flashcard" },
  { label: "Buku & Aktivitas", href: "/produk?q=buku" },
  { label: "Paket Belajar", href: "/produk?q=paket" },
];

const supportLinks = [
  { label: "Pusat Bantuan", href: "/kontak" },
  { label: "Jaringan Cabang", href: "/cabang" },
  { label: "Wawasan & Artikel", href: "/artikel" },
  { label: "Akun Saya", href: "/sign-in" },
];

export function Footer() {
  return (
    <footer className="border-t border-supporting-200/80 bg-supporting-50">
      <div className="container px-4 mx-auto py-14">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" aria-label="PENA AMEEN" className="inline-block">
              <span className="relative block h-12 w-48">
                <Image
                  src="/images/logo.png"
                  alt="PENA AMEEN"
                  fill
                  className="object-contain object-left"
                  unoptimized
                />
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-pretty text-xs leading-relaxed text-supporting-600">
              Pendamping belajar membaca, menulis, dan mengaji untuk anak, orang
              tua, guru, serta siapa saja yang ingin terus belajar.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 font-serif text-sm font-semibold text-supporting-900">
              Navigasi
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-supporting-600 transition-colors hover:text-primary-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-4 font-serif text-sm font-semibold text-supporting-900">
              Kategori
            </h4>
            <ul className="space-y-2.5">
              {categoryLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-supporting-600 transition-colors hover:text-primary-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 font-serif text-sm font-semibold text-supporting-900">
              Bantuan
            </h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-supporting-600 transition-colors hover:text-primary-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2 border-t border-supporting-200/70 pt-4">
              <p className="flex items-center gap-2 text-xs text-supporting-500">
                <MapPin className="h-3.5 w-3.5 text-primary-600" />
                Cabang di seluruh Indonesia
              </p>
              <p className="flex items-center gap-2 text-xs text-supporting-500">
                <Mail className="h-3.5 w-3.5 text-primary-600" />
                layanan@penaameen.com
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-supporting-200/70 pt-6 text-xs text-supporting-500 sm:flex-row">
          <p className="flex items-center gap-1.5">
            <BookOpenCheck className="h-4 w-4 text-primary-600" />
            &copy; {new Date().getFullYear()} PENA AMEEN. Seluruh hak cipta
            dilindungi.
          </p>
          <Link
            href="/admin"
            className="font-medium text-supporting-400 transition-colors hover:text-primary-700"
          >
            Portal Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
