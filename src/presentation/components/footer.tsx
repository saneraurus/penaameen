"use client";

import Link from "next/link";
import Image from "next/image";

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

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h2 className="mb-5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-background-400">
        {title}
      </h2>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-background-200 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-primary-950 text-background-100">
      <div className="container py-16 sm:py-20">
        {/* Closing statement */}
        <div className="max-w-3xl">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-400">
            Penerbit Pena Ameen
          </p>
          <p className="display-type mt-5 text-[clamp(1.75rem,4vw,3rem)] text-background-50">
            Belajar Tanpa Mengenal Usia.
          </p>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-background-300">
            Pendamping belajar membaca, menulis, dan mengaji untuk anak, orang
            tua, guru, serta siapa saja yang ingin terus belajar.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 border-t border-white/10 pt-12 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" aria-label="PENA AMEEN" className="inline-block">
              <span className="relative block h-11 w-40 brightness-0 invert">
                <Image
                  src="/images/logo.png"
                  alt="PENA AMEEN"
                  fill
                  className="object-contain object-left"
                  unoptimized
                />
              </span>
            </Link>
            <div className="mt-6 space-y-2 text-sm text-background-300">
              <p>Cabang di seluruh Indonesia</p>
              <p>
                <a
                  href="mailto:layanan@penaameen.com"
                  className="transition-colors hover:text-white"
                >
                  layanan@penaameen.com
                </a>
              </p>
            </div>
          </div>

          <LinkColumn title="Navigasi" links={navLinks} />
          <LinkColumn title="Kategori" links={categoryLinks} />
          <LinkColumn title="Bantuan" links={supportLinks} />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-background-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} PENA AMEEN. Seluruh hak cipta
            dilindungi.
          </p>
          <Link
            href="/admin"
            className="transition-colors hover:text-background-100"
          >
            Portal Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
