// src/app/cabang/page.tsx
"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { branches as fallbackBranches, type Branch } from "@/data/branches";
import { Reveal } from "@/components/motion/Reveal";
import { SceneIndex, Lede, Shell } from "@/components/ui/primitives";

export default function BranchListPage() {
  const [branches, setBranches] = useState<Branch[]>(fallbackBranches);
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  useEffect(() => {
    fetch("/api/branches")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: { branches: Branch[] }) => setBranches(data.branches))
      .catch(() => setBranches(fallbackBranches));
  }, []);

  const filteredBranches = useMemo(() => {
    const q = search.trim().toLowerCase();
    return branches.filter((branch) => {
      const matchesRegion =
        selectedRegion === "" ||
        branch.region.toLowerCase() === selectedRegion.toLowerCase();

      if (!matchesRegion) return false;
      if (!q) return true;

      const inMain =
        branch.city.toLowerCase().includes(q) ||
        branch.region.toLowerCase().includes(q) ||
        branch.address.toLowerCase().includes(q) ||
        branch.contact.toLowerCase().includes(q);

      const inOutlets = branch.outlets?.some(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.pic.toLowerCase().includes(q) ||
          o.address.toLowerCase().includes(q) ||
          o.city.toLowerCase().includes(q) ||
          o.contact.toLowerCase().includes(q) ||
          (o.type && o.type.toLowerCase().includes(q)),
      );

      return inMain || inOutlets;
    });
  }, [branches, search, selectedRegion]);

  const regions = useMemo(() => {
    return [...new Set(branches.map((branch) => branch.region))];
  }, [branches]);

  const totalOutletsCount = useMemo(() => {
    return branches.reduce((acc, b) => acc + (b.outlets?.length || 1), 0);
  }, [branches]);

  return (
    <div className="min-h-screen bg-background-50">
      {/* Editorial Hero */}
      <section className="relative overflow-hidden bg-primary-950 text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
        <Shell className="relative z-10 py-20 md:py-28">
          <Reveal variant="micro">
            <SceneIndex index="01" label="Jaringan Resmi" />
          </Reveal>
          <Reveal variant="large" delay={0.05}>
            <h1 className="display-type mt-5 text-[clamp(2.5rem,7vw,5rem)] text-background-50">
              Jaringan Cabang &amp; Perwakilan
            </h1>
          </Reveal>
          <Reveal variant="medium" delay={0.12}>
            <Lede className="mt-6 max-w-2xl text-background-200">
              Temukan kantor cabang resmi, perwakilan bimbingan belajar, dan
              mitra distributor metode Al-Barqy &amp; ACM di kota Anda.
            </Lede>
          </Reveal>

          <Reveal variant="small" delay={0.16}>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-supporting-300 border-t border-white/10 pt-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{branches.length} Wilayah Cakupan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary-400" />
                <span>{totalOutletsCount}+ Titik Layanan &amp; Mitra</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Pusat: Graha Al-Barqy Surabaya</span>
              </div>
            </div>
          </Reveal>
        </Shell>
      </section>

      <main className="section-y">
        <Shell className="max-w-6xl">
          {/* Search and Filters */}
          <Reveal variant="small">
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xs border border-supporting-200/80 mb-10">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Cari wilayah, kota, nama PIC, lembaga (contoh: Jakarta, Tebet, Kinderhouse)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-supporting-50/70 border border-supporting-300 rounded-xl text-supporting-900 placeholder:text-supporting-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
                  />
                  <span className="absolute left-3.5 top-3.5 text-supporting-400 text-base pointer-events-none">
                    🔍
                  </span>
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-3 text-xs text-supporting-400 hover:text-supporting-700 bg-supporting-200/60 rounded-full w-5 h-5 flex items-center justify-center"
                      title="Hapus pencarian"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <label
                    htmlFor="region-select"
                    className="text-xs font-semibold text-supporting-600 shrink-0"
                  >
                    Wilayah:
                  </label>
                  <select
                    id="region-select"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="px-4 py-3 border border-supporting-300 rounded-xl bg-white text-supporting-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                  >
                    <option value="">Semua Wilayah ({branches.length})</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Region quick filter pills */}
              <div className="mt-4 pt-4 border-t border-supporting-100 flex flex-wrap items-center gap-2">
                <span className="text-xs text-supporting-500 mr-1">
                  Filter cepat:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedRegion("")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedRegion === ""
                      ? "bg-primary-600 text-white shadow-2xs"
                      : "bg-supporting-100 text-supporting-700 hover:bg-supporting-200"
                  }`}
                >
                  Semua
                </button>
                {regions.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() =>
                      setSelectedRegion(r === selectedRegion ? "" : r)
                    }
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedRegion === r
                        ? "bg-primary-600 text-white shadow-2xs"
                        : "bg-supporting-100 text-supporting-700 hover:bg-supporting-200"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Results Counter */}
          <Reveal variant="small" delay={0.05}>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-supporting-600">
                Menampilkan{" "}
                <span className="font-bold text-primary-950">
                  {filteredBranches.length}
                </span>{" "}
                wilayah cabang
                {search && <span> untuk &ldquo;{search}&rdquo;</span>}
              </p>
            </div>
          </Reveal>

          {/* Branch Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBranches.length > 0 ? (
              filteredBranches.map((branch) => {
                const outletCount = branch.outlets?.length || 0;
                const isVerified = branch.isVerified || outletCount > 0;

                return (
                  <Reveal key={branch.id} variant="small" delay={0.05}>
                    <div className="group bg-white rounded-2xl p-6 shadow-xs hover:shadow-md border border-supporting-200/80 hover:border-primary-300 transition-all duration-200 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <span className="text-xs font-bold tracking-wider uppercase text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200/50">
                            {branch.region}
                          </span>
                          {isVerified ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <span>✓</span>
                              <span>
                                {outletCount > 0
                                  ? `${outletCount} Titik Mitra`
                                  : "Terverifikasi"}
                              </span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-supporting-400 bg-supporting-100 px-2 py-0.5 rounded-md">
                              Perwakilan
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-serif font-bold text-primary-950 group-hover:text-primary-700 transition-colors mb-2">
                          Cabang {branch.region}
                        </h3>

                        <p className="text-xs font-semibold text-supporting-500 mb-3 flex items-center gap-1.5">
                          <span>📍</span>
                          <span>{branch.city}</span>
                        </p>

                        {outletCount > 0 ? (
                          <div className="space-y-2 mb-4 bg-supporting-50/70 p-3 rounded-xl border border-supporting-100 text-xs">
                            <p className="font-semibold text-supporting-800">
                              Daftar Titik / Mitra Resmi:
                            </p>
                            <ul className="space-y-1 text-supporting-600">
                              {branch.outlets?.slice(0, 3).map((o) => (
                                <li
                                  key={o.id}
                                  className="flex items-center gap-1.5 truncate"
                                >
                                  <span className="text-primary-600 font-bold">
                                    •
                                  </span>
                                  <span className="font-medium text-supporting-800">
                                    {o.name}:
                                  </span>
                                  <span className="truncate text-supporting-500">
                                    {o.city}
                                  </span>
                                </li>
                              ))}
                              {outletCount > 3 && (
                                <li className="text-primary-700 font-semibold pt-1">
                                  + {outletCount - 3} titik mitra lainnya →
                                </li>
                              )}
                            </ul>
                          </div>
                        ) : (
                          <div className="mb-4 text-xs text-supporting-600 space-y-1.5 bg-supporting-50/50 p-3 rounded-xl">
                            <p>
                              <span className="font-medium text-supporting-700">
                                Alamat:
                              </span>{" "}
                              {branch.address.includes("[")
                                ? "Hubungi CS Pusat untuk alamat detail cabang ini."
                                : branch.address}
                            </p>
                            <p>
                              <span className="font-medium text-supporting-700">
                                Kontak:
                              </span>{" "}
                              {branch.contact.includes("[")
                                ? "0822 3123 9158 (Pusat)"
                                : branch.contact}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-supporting-100 flex items-center justify-between gap-3 mt-2">
                        <Link
                          href={`/cabang/${branch.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 hover:text-primary-800 transition-colors"
                        >
                          <span>Lihat Detail Cabang</span>
                          <span>→</span>
                        </Link>

                        {branch.contact && !branch.contact.includes("[") && (
                          <a
                            href={`https://wa.me/62${branch.contact.replace(/^0+/, "").replace(/[^0-9]/g, "")}?text=Halo%20Admin%20Cabang%20Pena%20Ameen%20${encodeURIComponent(branch.region)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <span>💬</span>
                            <span>Chat WA</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </Reveal>
                );
              })
            ) : (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-supporting-200 p-8">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-lg font-serif font-bold text-primary-950 mb-1">
                  Tidak ada cabang yang cocok
                </h3>
                <p className="text-sm text-supporting-600 max-w-md mx-auto mb-6">
                  Wilayah atau nama yang Anda cari belum terdaftar. Anda tetap
                  dapat memesan produk resmi langsung dari Graha Al-Barqy pusat.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setSelectedRegion("");
                    }}
                    className="px-4 py-2 bg-supporting-100 hover:bg-supporting-200 text-supporting-800 text-xs font-bold rounded-xl transition-colors"
                  >
                    Reset Pencarian
                  </button>
                  <Link
                    href="/kontak"
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Hubungi Layanan Pusat
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Partnership Banner CTA */}
          <Reveal variant="small" delay={0.1}>
            <div className="mt-14 bg-gradient-to-br from-primary-900 to-primary-950 text-white rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:12px_12px] hidden md:block" />
              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-400/20 text-secondary-300 text-xs font-semibold mb-3">
                  🤝 Kemitraan &amp; Pelatihan
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-3">
                  Tertarik Membuka Cabang atau Menjadi Mitra Resmi?
                </h2>
                <p className="text-supporting-200 text-sm sm:text-base leading-relaxed mb-6">
                  Kami membuka kesempatan bagi yayasan, sekolah, masjid, dan
                  perorangan untuk menjadi mitra bimbingan belajar baca
                  Al-Qur&apos;an Al-Barqy dan ACM di seluruh Indonesia.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/kontak"
                    className="px-6 py-3 bg-secondary-400 hover:bg-secondary-500 text-primary-950 font-bold rounded-xl text-sm transition-colors shadow-xs"
                  >
                    Konsultasi Kemitraan Cabang
                  </Link>
                  <a
                    href="https://wa.me/6282231239158?text=Halo%20Pena%20Ameen,%20saya%20tertarik%20untuk%20menjadi%20mitra%20cabang/perwakilan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-xl text-sm transition-colors flex items-center gap-2"
                  >
                    <span>💬</span>
                    <span>WhatsApp Admin Pusat</span>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </Shell>
      </main>
    </div>
  );
}
