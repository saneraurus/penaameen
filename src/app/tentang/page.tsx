// src/app/tentang/page.tsx
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background-50">
      <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-20 border-b border-supporting-100">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <Link
              href="/"
              className="text-supporting-600 hover:text-primary-600 transition-colors"
            >
              ← Kembali ke Beranda
            </Link>
            <h1 className="text-3xl font-serif font-medium text-primary-600">
              Tentang Kami
            </h1>
          </div>
        </div>
      </header>

      <main>
        <div className="container px-4 mx-auto">
          <div className="py-16 md:py-24 space-y-12">
            {/* Hero */}
            <section className="md:text-center max-w-2xl mx-auto">
              <h1 className="mb-6 text-5xl md:text-6xl font-serif font-bold text-primary-600 leading-tight">
                Belajar Tanpa Mengenal Usia
              </h1>
              <p className="mb-8 text-lg text-supporting-600 max-w prose">
                Pendamping belajar membaca, menulis, dan mengaji untuk anak,
                orang tua, guru, dan siapa saja yang ingin terus belajar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/produk"
                  className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
                >
                  Jelajahi Produk
                </Link>
                <Link
                  href="/sejarah"
                  className="px-6 py-3 bg-transparent text-primary-600 rounded-md hover:bg-primary-50 hover-text-primary-600 transition-colors font-medium"
                >
                  Baca Sejarah
                </Link>
              </div>
            </section>

            {/* Brand Story */}
            <section>
              <h2 className="mb-8 text-3xl font-serif font-semibold text-primary-600">
                Kisah Kami
              </h2>
              <p className="mb-6 text-supporting-600 leading-relaxed">
                PENA AMEEN lahir dari keinginan untuk membuat proses belajar
                membaca, menulis, dan mengaji menjadi lebih accessible,
                enjoyable, dan meaningful bagi setiap individu, terlepas dari
                usia, latar belakang, atau tingkat kemampuan awal.
              </p>
              <p className="mb-6 text-supporting-600 leading-relaxed">
                Dengan menggabungkan metodologi pembelajaran yang telah terbukti
                dan perangkat pembelajaran yang inovatif, kami menciptakan
                ekosistem belajar yang mendukung pertumbuhan holistik —
                kognitif, emosional, dan spiritual.
              </p>
              <p className="mb-6 text-supporting-600 leading-relaxed">
                Kami percaya bahwa setiap orang berhak untuk belajar dengan cara
                yang sesuai untuk dirinya, dan PENA AMEEN hadir sebagai
                pendamping dalam perjalanan tersebut.
              </p>
            </section>

            {/* Mission and Vision */}
            <section>
              <h2 className="mb-8 text-3xl font-serif font-semibold text-primary-600">
                Visi dan Misi
              </h2>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-primary-600">
                    Visi
                  </h3>
                  <p className="text-supporting-600 leading-relaxed">
                    Menjadi pendamping utama dalam perjalanan belajar membaca,
                    menulis, dan mengaji yang inovatif, inklusif, dan
                    berkelanjutan bagi semua lapisan masyarakat.
                  </p>
                </div>
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-primary-600">
                    Misi
                  </h3>
                  <p className="text-supporting-600 leading-relaxed">
                    Menyediakan metode dan perangkat belajar yang mudah diakses,
                    mudah dipahami, dan efektif untuk meningkatkan literasi
                    membaca dan menulis serta pemahaman Al-Qur&apos;an.
                  </p>
                </div>
              </div>
            </section>

            {/* Our Approach */}
            <section>
              <h2 className="mb-8 text-3xl font-serif font-semibold text-primary-600">
                Pendekatan Kami
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="mb-6 w-14 h-14 bg-primary-50 flex items-center justify-center rounded-2xl">
                    <svg
                      className="h-8 w-8 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m2 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-xl font-serif text-primary-600">
                    Belajar Menyenangkan
                  </h3>
                  <p className="text-supporting-600 leading-relaxed">
                    Pendekatan bermain sambil belajar yang membuat anak tetap
                    termotivasi dan enjoy proses belajar.
                  </p>
                </div>

                <div className="text-center">
                  <div className="mb-6 w-14 h-14 bg-secondary-50 flex items-center justify-center rounded-2xl">
                    <svg
                      className="h-8 w-8 text-secondary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m2 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-xl font-serif text-secondary-600">
                    Pembelajaran inklusif
                  </h3>
                  <p className="text-supporting-600 leading-relaxed">
                    Metode yang dirancang untuk semua usia dan latar belakang,
                    memastikan tidak ada yang terkecuali dari peluang belajar.
                  </p>
                </div>

                <div className="text-center">
                  <div className="mb-6 w-14 h-14 bg-accent-50 flex items-center justify-center rounded-2xl">
                    <svg
                      className="h-8 w-8 text-accent-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m2 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-xl font-serif text-accent-600">
                    Pertumbuhan holistik
                  </h3>
                  <p className="text-supporting-600 leading-relaxed">
                    Kognitif, emosional, dan spiritual — pengembangan menyeluruh
                    untuk setiap individu.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
