// src/app/cabang/[slug]/page.tsx
import Link from "next/link";
import { getBranchBySlug } from "@/data/branches";
import { notFound } from "next/navigation";

export default async function BranchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const branch = getBranchBySlug(slug);

  if (!branch) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background-50">
      <header className="bg-white/90 backdrop-blur-sm sticky top-0 z-20 border-b border-supporting-200">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <Link
              href="/cabang"
              className="text-supporting-600 hover:text-primary-600"
            >
              ← Kembali ke Daftar Cabang
            </Link>
            <h1 className="text-2xl font-serif text-primary-600">
              Cabang {branch.region}
            </h1>
          </div>
        </div>
      </header>

      <main className="py-12">
        <div className="container px-4 mx-auto">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-serif text-primary-600">
                Cabang {branch.region}
              </h2>
              <p className="mb-6 text-supporting-600">{branch.city}</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-supporting-200">
              <h3 className="mb-4 text-xl font-semibold text-primary-600">
                Informasi Cabang
              </h3>
              <p className="mb-4">
                <span className="font-medium">Alamat:</span> {branch.address}
              </p>
              <p className="mb-4">
                <span className="font-medium">Kontak:</span> {branch.contact}
              </p>
            </div>

            {/* Map Placeholder */}
            <div className="bg-supporting-200 rounded-xl h-96">
              {/* In a real app, we would embed a map here */}
              <div className="flex h-full items-center justify-center">
                <p className="text-supporting-500 italic">
                  Peta cabang akan ditampilkan di sini
                </p>
              </div>
            </div>

            {/* Products available at this branch (placeholder) */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-supporting-200">
              <h3 className="mb-4 text-xl font-semibold text-primary-600">
                Produk yang Tersedia
              </h3>
              <p className="mb-4 text-supporting-600">
                Berbagai produk PENA AMEEN tersedia di cabang ini. Silakan
                kunjungi langsung atau hubungi kontak di atas untuk informasi
                lebih lanjut.
              </p>
              <Link
                href="/produk"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
              >
                Lihat Semua Produk
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
