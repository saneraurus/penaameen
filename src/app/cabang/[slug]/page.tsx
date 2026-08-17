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

            {/* Products available at this branch */}
            <div className="bg-white rounded-3xl p-8 shadow-xs border border-supporting-200">
              <h3 className="mb-3 text-xl font-serif font-bold text-primary-950">
                Produk &amp; Layanan di Cabang Ini
              </h3>
              <p className="mb-6 text-supporting-600 text-sm sm:text-base leading-relaxed">
                Seluruh produk resmi PENA AMEEN (Al-Barqy, ACM, Flashcard &amp;
                Alat Peraga) tersedia di cabang ini. Anda juga dapat
                berkonsultasi langsung atau mendaftarkan lembaga Anda untuk
                program pembinaan pengajar.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/produk"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-bold text-sm shadow-xs"
                >
                  <span>Jelajahi Katalog Produk</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/kontak"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-supporting-100 hover:bg-supporting-200 text-supporting-800 rounded-xl transition-colors font-bold text-sm"
                >
                  <span>Hubungi Kami</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
