"use client";

import { useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { CartContext } from "@/context/CartContext";

export function FeaturedProductSection() {
  const [activeTab, setActiveTab] = useState<"isi" | "keunggulan">("isi");
  const [isAdded, setIsAdded] = useState(false);
  const cartContext = useContext(CartContext);

  const formatPrice = (price: number) => `Rp${price.toLocaleString("id-ID")}`;

  const kitContents = [
    {
      title: "Buku Utama & Modul Praktik AL-BARQY",
      desc: "Panduan belajar membaca Al-Qur'an sistematis dari dasar hingga mahir tajwid.",
    },
    {
      title: "Flashcard Hijaiyah Interaktif",
      desc: "Kartu tebal dua sisi bergambar untuk melatih daya ingat visual dan bunyi huruf.",
    },
    {
      title: "Set 12 Poster Edukasi Klasikal",
      desc: "Poster dinding berukuran besar untuk ruang belajar di rumah atau TPQ.",
    },
    {
      title: "Buku Panduan Pendamping (Orang Tua & Guru)",
      desc: "Instruksi praktis mendampingi 15–20 menit per hari secara mandiri.",
    },
    {
      title: "Bonus Tas Eksklusif PENA AMEEN",
      desc: "Tas kanvas tebal untuk menyimpan seluruh perlengkapan agar rapi dan mudah dibawa.",
    },
  ];

  const keyAdvantages = [
    {
      title: "Sistem Cepat 200 Menit",
      desc: "Kurikulum padat yang terbukti mengantarkan santri lancar membaca dalam 200 menit.",
    },
    {
      title: "Formula Kata Anti-Lupa",
      desc: "Menggunakan asosiasi bunyi kata alami bahasa Indonesia sehingga tidak mudah lupa.",
    },
    {
      title: "Cocok untuk Semua Usia",
      desc: "Efektif digunakan untuk anak usia sekolah, remaja, mualaf, hingga lansia.",
    },
    {
      title: "Bahan Cetak Standar Premium",
      desc: "Kertas tebal ramah anak, warna jelas tidak silau, dan awet bertahun-tahun.",
    },
  ];

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (cartContext?.addToCart) {
      try {
        await cartContext.addToCart("1", 1);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2200);
      } catch {
        // silent
      }
    }
  };

  return (
    <section className="border-y border-supporting-200 bg-white py-16 sm:py-20">
      <div className="container max-w-6xl">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5">
            <figure className="m-0">
              <div className="image-frame aspect-[4/3] w-full">
                <Image
                  src="/images/penaameen/products/featured-home-learning.jpg"
                  alt="Paket Home Learning ALBARQY Box Set Lengkap dengan Buku, Flashcard, Poster, dan Tas Eksklusif"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 flex items-center justify-between text-[11px] text-supporting-500">
                <span>Paket Unggulan Terlengkap · Box Set 5-in-1</span>
                <span className="font-medium text-supporting-700">
                  4.9 / 5.0 · 3.200+ keluarga
                </span>
              </figcaption>
            </figure>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal delay={0.08}>
              <p className="scene-index">Pilihan Belajar Utama</p>
              <span aria-hidden="true" className="sr-only">
                PILIHAN BELAJAR UTAMA
              </span>
              <h2 className="display-type mt-4 text-supporting-900">
                Paket Home Learning ALBARQY
              </h2>
              <p className="mt-4 max-w-prose text-sm leading-relaxed text-supporting-600 sm:text-base">
                Solusi menyeluruh pembelajaran membaca Al-Qur&apos;an mandiri di
                rumah. Dirancang agar anak dan pembelajar dewasa dapat belajar
                secara runtut, menyenangkan, dan cepat mahir tanpa rasa bosan.
              </p>

              <nav
                aria-label="Rincian paket"
                className="mt-8 flex gap-6 border-b border-supporting-200"
              >
                <button
                  type="button"
                  aria-pressed={activeTab === "isi"}
                  onClick={() => setActiveTab("isi")}
                  className={`relative py-2.5 text-sm transition-colors ${
                    activeTab === "isi"
                      ? "text-supporting-900"
                      : "text-supporting-500 hover:text-supporting-900"
                  }`}
                >
                  Isi Paket Box
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 h-px bg-accent-600 transition-transform ${
                      activeTab === "isi" ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
                <button
                  type="button"
                  aria-pressed={activeTab === "keunggulan"}
                  onClick={() => setActiveTab("keunggulan")}
                  className={`relative py-2.5 text-sm transition-colors ${
                    activeTab === "keunggulan"
                      ? "text-supporting-900"
                      : "text-supporting-500 hover:text-supporting-900"
                  }`}
                >
                  Keunggulan Metode
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 h-px bg-accent-600 transition-transform ${
                      activeTab === "keunggulan" ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              </nav>

              <div className="mt-8">
                {activeTab === "isi" && (
                  <ol className="space-y-3 border-t border-supporting-200">
                    {kitContents.map((item, index) => (
                      <li
                        key={item.title}
                        className="flex gap-4 border-b border-supporting-100 py-3.5"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-1.5 text-[11px] font-medium text-supporting-400"
                        >
                          0{index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium leading-snug text-supporting-900">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-supporting-600">
                            {item.desc}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}

                {activeTab === "keunggulan" && (
                  <ul className="space-y-3 border-t border-supporting-200">
                    {keyAdvantages.map((adv) => (
                      <li
                        key={adv.title}
                        className="border-b border-supporting-100 py-3.5"
                      >
                        <p className="text-sm font-medium text-supporting-900">
                          {adv.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-supporting-600">
                          {adv.desc}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-10 border-t border-supporting-200 pt-6">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="font-serif text-2xl text-supporting-900">
                    {formatPrice(966000)}
                  </p>
                  <p className="text-xs text-supporting-400 line-through">
                    {formatPrice(1250000)}
                  </p>
                  <p className="text-xs font-medium text-accent-700">
                    Hemat Rp284.000
                  </p>
                </div>
                <p className="mt-1 text-[11px] text-supporting-500">
                  + Bonus Tas Eksklusif · 100% orisinal
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {cartContext?.addToCart && (
                  <button
                    type="button"
                    onClick={handleQuickAdd}
                    className={`text-sm font-medium underline-offset-4 transition-colors ${
                      isAdded
                        ? "text-primary-700"
                        : "text-supporting-600 hover:text-primary-800 hover:underline"
                    }`}
                  >
                    {isAdded ? "Ditambah ✓" : "+ Keranjang"}
                  </button>
                )}
                <Link
                  href="/produk/paket-home-learning-albarqy"
                  className="inline-flex min-h-10 items-center rounded-full bg-primary-900 px-5 text-sm font-medium text-white transition-colors hover:bg-primary-800"
                >
                  Lihat Detail Produk →
                </Link>
                <Link
                  href="/kontak"
                  className="inline-flex min-h-10 items-center rounded-full border border-supporting-300 px-5 text-sm font-medium text-supporting-700 transition-colors hover:border-primary-700 hover:text-primary-800"
                >
                  Tanya CS
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
