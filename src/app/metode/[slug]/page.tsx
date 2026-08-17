// src/app/metode/[slug]/page.tsx
import Link from "next/link";
import { getMethodBySlug } from "@/data/methods";
import { notFound } from "next/navigation";

export default async function MethodDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const method = getMethodBySlug(slug);

  if (!method) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background-50">
      <header className="bg-white/90 backdrop-blur-sm sticky top-0 z-20 border-b border-supporting-200">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <Link
              href="/metode"
              className="text-supporting-600 hover:text-primary-600"
            >
              ← Kembali ke Metode
            </Link>
            <h1 className="text-2xl font-serif text-primary-600">
              {method.name}
            </h1>
          </div>
        </div>
      </header>

      <main className="py-12">
        <div className="container px-4 mx-auto">
          <div className="space-y-12">
            {/* Introduction */}
            <section>
              <h2 className="mb-4 text-2xl font-serif text-primary-600">
                Tentang {method.name}
              </h2>
              <p className="mb-6 text-supporting-600">{method.description}</p>
            </section>

            {/* Who is it for? */}
            <section>
              <h3 className="mb-3 text-xl font-semibold text-primary-600">
                Untuk Siapa?
              </h3>
              <p className="text-supporting-600">{method.suitableFor}</p>
            </section>

            {/* Benefits */}
            <section>
              <h3 className="mb-3 text-xl font-semibold text-primary-600">
                Manfaat
              </h3>
              <ul className="list-disc list-inside space-y-2 text-supporting-600">
                {method.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </section>

            {/* How it works (placeholder) */}
            <section>
              <h3 className="mb-3 text-xl font-semibold text-primary-600">
                Cara Kerja
              </h3>
              <p className="text-supporting-600">
                Metode ini dirancang dengan langkah-langkah yang mudah diikuti,
                mulai dari pengenalan dasar hingga latihan berlatih.
              </p>
            </section>

            {/* Learning process (placeholder) */}
            <section>
              <h3 className="mb-3 text-xl font-semibold text-primary-600">
                Proses Belajar
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-supporting-600">
                <li>Pengenalan konsep dasar</li>
                <li>Latihan praktis dengan alat bantu</li>
                <li>Evaluasi dan umpan balik</li>
                <li>Peningkatkan kesulitan secara bertahap</li>
              </ol>
            </section>

            {/* Available products (placeholder) */}
            <section>
              <h3 className="mb-3 text-xl font-semibold text-primary-600">
                Produk yang Tersedia
              </h3>
              <p className="text-supporting-600">
                Berbagai produk PENA AMEEN yang sesuai dengan metode ini
                tersedia untuk mendukung proses belajar Anda.
              </p>
              <Link
                href="/produk"
                className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
              >
                Lihat Semua Produk
                <Link href="/produk" className="ml-2">
                  {/* We'll use the same ArrowRightIcon, but for simplicity, we'll just use text */}
                  →
                </Link>
              </Link>
            </section>

            {/* CTA */}
            <section className="text-center">
              <Link
                href="/produk"
                className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
              >
                Mulai Belajar Sekarang
              </Link>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
