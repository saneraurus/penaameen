// src/app/cabang/[slug]/page.tsx
"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import {
  branches as fallbackBranches,
  getBranchBySlug,
  type Branch,
} from "@/data/branches";
import { useParams, notFound } from "next/navigation";

interface PageProps {
  params?: Promise<{ slug: string }> | { slug: string };
}

export default function BranchDetailPage(props?: PageProps) {
  const routerParams = useParams<{ slug: string }>();

  let initialSlug = routerParams?.slug;
  if (!initialSlug && props?.params && !("then" in props.params)) {
    initialSlug = props.params.slug;
  }

  const [resolvedSlug, setResolvedSlug] = useState<string | null>(
    initialSlug || null,
  );
  const [branch, setBranch] = useState<Branch | null>(
    initialSlug ? (getBranchBySlug(initialSlug) ?? null) : null,
  );
  const [branches, setBranches] = useState<Branch[]>(fallbackBranches);
  const effectiveSlug = resolvedSlug || initialSlug;

  useEffect(() => {
    fetch("/api/branches")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: { branches: Branch[] }) => setBranches(data.branches))
      .catch(() => setBranches(fallbackBranches));
  }, []);

  useEffect(() => {
    if (props?.params && "then" in props.params) {
      props.params.then((p) => {
        if (p?.slug) setResolvedSlug(p.slug);
      });
    } else if (routerParams?.slug) {
      setResolvedSlug(routerParams.slug);
    }
  }, [props?.params, routerParams?.slug]);

  useEffect(() => {
    if (!effectiveSlug) return;
    fetch(`/api/branches?slug=${encodeURIComponent(effectiveSlug)}`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: { branch: Branch | null }) => setBranch(data.branch))
      .catch(() =>
        setBranch(
          effectiveSlug ? (getBranchBySlug(effectiveSlug) ?? null) : null,
        ),
      );
  }, [effectiveSlug]);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedSubCity, setSelectedSubCity] = useState<string>("");

  const outlets = useMemo(() => branch?.outlets ?? [], [branch]);
  const hasOutlets = outlets.length > 0;

  const subCities = useMemo(() => {
    if (!hasOutlets) return [];
    return [...new Set(outlets.map((o) => o.city))];
  }, [outlets, hasOutlets]);

  const filteredOutlets = useMemo(() => {
    if (!selectedSubCity) return outlets;
    return outlets.filter((o) => o.city === selectedSubCity);
  }, [outlets, selectedSubCity]);

  const copyToClipboard = (text: string, id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const cleanPhone = (phone: string) => {
    return phone.replace(/^0+/, "").replace(/[^0-9]/g, "");
  };

  if (effectiveSlug && !branch) {
    notFound();
  }

  if (!branch) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-supporting-500">Memuat data cabang...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5]">
      {/* Header & Breadcrumbs */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-20 border-b border-supporting-200/80 shadow-2xs">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <Link
              href="/cabang"
              className="inline-flex items-center gap-2 text-sm font-medium text-supporting-600 hover:text-primary-700 transition-colors"
            >
              <span>←</span>
              <span>Kembali ke Daftar Cabang</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full border border-primary-200/60">
                {branch.region}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-primary-950 via-primary-900 to-primary-950 text-white py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="container mx-auto relative z-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-secondary-400/20 border border-secondary-400/30 text-secondary-300 text-xs font-semibold uppercase tracking-wider">
              {hasOutlets
                ? `${outlets.length} Titik Perwakilan &amp; Mitra`
                : "Kantor Perwakilan"}
            </span>
            {branch.isVerified && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                <span>✓</span>
                <span>Terverifikasi Resmi</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight mb-3">
            Cabang {branch.region}
          </h1>

          <p className="text-supporting-200 text-base sm:text-lg leading-relaxed max-w-2xl">
            {hasOutlets
              ? `Daftar titik bimbingan belajar, perwakilan lembaga, masjid, dan reseller resmi metode Al-Barqy & ACM di wilayah ${branch.region}.`
              : `Informasi perwakilan dan jaringan layanan resmi Pena Ameen untuk wilayah ${branch.region}.`}
          </p>
        </div>
      </section>

      <main className="py-10">
        <div className="container px-4 mx-auto max-w-5xl">
          {hasOutlets ? (
            <div className="space-y-8">
              {/* Filter tabs if multiple sub-cities exist */}
              {subCities.length > 1 && (
                <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-supporting-200/80 shadow-2xs w-fit">
                  <button
                    type="button"
                    onClick={() => setSelectedSubCity("")}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      selectedSubCity === ""
                        ? "bg-primary-600 text-white shadow-2xs"
                        : "text-supporting-600 hover:text-primary-700 hover:bg-supporting-50"
                    }`}
                  >
                    Semua Wilayah ({outlets.length})
                  </button>
                  {subCities.map((city) => {
                    const count = outlets.filter((o) => o.city === city).length;
                    return (
                      <button
                        key={city}
                        type="button"
                        onClick={() => setSelectedSubCity(city)}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                          selectedSubCity === city
                            ? "bg-primary-600 text-white shadow-2xs"
                            : "text-supporting-600 hover:text-primary-700 hover:bg-supporting-50"
                        }`}
                      >
                        {city} ({count})
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Table / Cards List */}
              <div className="grid gap-6">
                {filteredOutlets.map((outlet, index) => {
                  const phoneClean = cleanPhone(outlet.contact);
                  const isCopied = copiedId === outlet.id;

                  return (
                    <div
                      key={outlet.id}
                      className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-supporting-200/80 hover:border-primary-300 transition-all duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-supporting-100">
                        <div className="flex items-start gap-3">
                          <span className="w-8 h-8 rounded-xl bg-primary-50 text-primary-700 font-serif font-bold text-sm flex items-center justify-center shrink-0 border border-primary-200/60">
                            {index + 1}
                          </span>
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h2 className="text-xl font-serif font-bold text-primary-950">
                                {outlet.name}
                              </h2>
                              {outlet.type && (
                                <span className="text-[11px] font-semibold text-secondary-800 bg-secondary-50 border border-secondary-200 px-2.5 py-0.5 rounded-full">
                                  {outlet.type}
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-semibold text-supporting-500">
                              Wilayah:{" "}
                              <span className="text-primary-700">
                                {outlet.city}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Quick Contact CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <a
                            href={`https://wa.me/62${phoneClean}?text=Halo%20${encodeURIComponent(outlet.pic)},%20saya%20ingin%20bertanya%20mengenai%20metode%20dan%20produk%20Pena%20Ameen%20(Al-Barqy/ACM)%20di%20${encodeURIComponent(outlet.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                          >
                            <span>💬</span>
                            <span>Chat WhatsApp</span>
                          </a>

                          <a
                            href={`tel:${outlet.contact.replace(/\s+/g, "")}`}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-supporting-100 hover:bg-supporting-200 text-supporting-800 rounded-xl text-xs font-bold transition-colors"
                          >
                            <span>📞</span>
                            <span>Telepon</span>
                          </a>
                        </div>
                      </div>

                      {/* Outlet Information Grid */}
                      <div className="mt-5 grid sm:grid-cols-2 gap-4 text-sm">
                        <div className="bg-supporting-50/60 p-4 rounded-xl border border-supporting-100/80">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-supporting-500">
                              👤 Penanggung Jawab (PIC)
                            </span>
                          </div>
                          <p className="font-semibold text-supporting-900 text-base">
                            {outlet.pic}
                          </p>
                          <p className="text-xs text-supporting-500 mt-1">
                            Kontak:{" "}
                            <span className="font-mono font-medium text-supporting-800">
                              {outlet.contact}
                            </span>
                          </p>
                        </div>

                        <div className="bg-supporting-50/60 p-4 rounded-xl border border-supporting-100/80">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-supporting-500">
                              📍 Alamat Lengkap
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                copyToClipboard(outlet.address, outlet.id)
                              }
                              className="text-[11px] font-semibold text-primary-700 hover:text-primary-800 bg-white px-2 py-0.5 rounded border border-supporting-200 shadow-2xs hover:bg-primary-50 transition-colors"
                            >
                              {isCopied ? "✓ Tersalin" : "Salin Alamat"}
                            </button>
                          </div>
                          <p className="text-supporting-800 leading-relaxed text-xs sm:text-sm">
                            {outlet.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Single Branch / HQ Fallback Card */}
              <div className="bg-white rounded-2xl p-8 shadow-xs border border-supporting-200">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200/50">
                      {branch.region}
                    </span>
                    <h2 className="text-2xl font-serif font-bold text-primary-950 mt-2">
                      Informasi Cabang &amp; Perwakilan {branch.region}
                    </h2>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 text-sm">
                  <div className="bg-supporting-50 p-5 rounded-xl border border-supporting-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-supporting-500 block mb-2">
                      📍 Wilayah Cakupan / Alamat
                    </span>
                    <p className="text-supporting-800 font-medium leading-relaxed">
                      {branch.address.includes("[")
                        ? "Data alamat spesifik perwakilan sedang dalam proses verifikasi sistem. Layanan pengiriman tetap dilayani ke seluruh kecamatan."
                        : branch.address}
                    </p>
                  </div>

                  <div className="bg-supporting-50 p-5 rounded-xl border border-supporting-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-supporting-500 block mb-2">
                      📞 Layanan Kontak
                    </span>
                    <p className="text-supporting-800 font-medium mb-3">
                      {branch.contact.includes("[")
                        ? "0822 3123 9158 (Graha Al-Barqy Pusat)"
                        : branch.contact}
                    </p>
                    <a
                      href="https://wa.me/6282231239158?text=Halo%20Pena%20Ameen,%20saya%20ingin%20bertanya%20mengenai%20layanan%20di%20wilayah%20"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      <span>💬</span>
                      <span>Hubungi CS Pusat</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products and Services at this branch */}
          <div className="mt-10 bg-white rounded-3xl p-8 sm:p-10 shadow-xs border border-supporting-200">
            <div className="max-w-3xl">
              <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200/50 mb-3 inline-block">
                📚 Layanan Resmi
              </span>
              <h3 className="text-2xl font-serif font-bold text-primary-950 mb-3">
                Produk &amp; Layanan Pembinaan Guru di Cabang Ini
              </h3>
              <p className="text-supporting-600 text-sm sm:text-base leading-relaxed mb-6">
                Seluruh buku panduan resmi metode Al-Barqy (200 Menit Belajar
                Al-Qur&apos;an), metode ACM (Aku Cepat Membaca Tanpa Mengeja),
                kartu peraga, dan alat peraga edukatif tersedia melalui jaringan
                cabang dan mitra resmi Pena Ameen. Anda juga dapat mengajukan
                pelatihan guru/ustadz untuk TPQ atau sekolah Anda.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/produk"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-bold text-sm shadow-xs"
                >
                  <span>Beli Buku &amp; Peraga Resmi</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/kontak"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-supporting-100 hover:bg-supporting-200 text-supporting-800 rounded-xl transition-colors font-bold text-sm"
                >
                  <span>Daftar Pelatihan Guru</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Other Branches Navigation */}
          <div className="mt-12 pt-8 border-t border-supporting-200/80">
            <h4 className="text-sm font-bold text-supporting-500 uppercase tracking-wider mb-4">
              Jelajahi Wilayah Lainnya:
            </h4>
            <div className="flex flex-wrap gap-2">
              {branches
                .filter((b) => b.slug !== effectiveSlug)
                .map((b) => (
                  <Link
                    key={b.slug}
                    href={`/cabang/${b.slug}`}
                    className="px-3.5 py-1.5 bg-white hover:bg-primary-50 text-supporting-700 hover:text-primary-700 border border-supporting-200 rounded-xl text-xs font-semibold transition-colors"
                  >
                    {b.region}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
