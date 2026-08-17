// src/app/cabang/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { branches } from "@/data/branches";

export default function BranchListPage() {
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  const filteredBranches = branches.filter((branch) => {
    const matchesSearch = branch.city
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesRegion =
      selectedRegion === "" ||
      branch.region.toLowerCase() === selectedRegion.toLowerCase();
    return matchesSearch && matchesRegion;
  });

  const regions = [...new Set(branches.map((branch) => branch.region))];

  return (
    <div className="min-h-screen bg-background-50">
      <header className="bg-white/90 backdrop-blur-sm sticky top-0 z-20 border-b border-supporting-200">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <Link
              href="/"
              className="text-supporting-600 hover:text-primary-600"
            >
              ← Kembali ke Beranda
            </Link>
            <h1 className="text-2xl font-serif text-primary-600">Cabang</h1>
          </div>
        </div>
      </header>

      <main className="py-12">
        <div className="container px-4 mx-auto">
          {/* Search and Filter */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <input
                type="text"
                placeholder="Cari kota atau wilayah"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-supporting-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-1 border border-supporting-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Semua Wilayah</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Branch Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBranches.length > 0 ? (
              filteredBranches.map((branch) => (
                <Link
                  key={branch.id}
                  href={`/cabang/${branch.slug}`}
                  className="block bg-white rounded-xl p-6 shadow-sm border border-supporting-200 hover:shadow-md transition-all"
                >
                  <h3 className="mb-3 text-lg font-semibold text-primary-600">
                    {branch.region}
                  </h3>
                  <p className="mb-2 text-supporting-500">{branch.city}</p>
                  <p className="mb-4 text-supporting-600">
                    Alamat: {branch.address}
                  </p>
                  <p className="mb-4 text-supporting-600">
                    Kontak: {branch.contact}
                  </p>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-supporting-600">
                  Tidak ada cabang yang ditemukan.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
