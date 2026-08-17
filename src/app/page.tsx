import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { Reveal } from "@/components/motion/Reveal";
import { HeroSection } from "@/components/sections/HeroSection";
import { LearningJourneySection } from "@/components/sections/LearningJourneySection";
import { FeaturedProductSection } from "@/components/sections/FeaturedProductSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { EditorialStorySection } from "@/components/sections/EditorialStorySection";

const formatPrice = (price: number) => `Rp${price.toLocaleString("id-ID")}`;

const articles = [
  {
    slug: "belajar-cepat-mengaji-untuk-anak",
    title: "Belajar Cepat Mengaji Untuk Anak, Apakah Bisa ?",
    category: "Tips Belajar",
    image: "/images/penaameen/editorial/anak-belajar-mengaji.jpg",
    date: "12 Januari 2026",
    readTime: "5 min read",
    excerpt:
      "Artikel ini membahas tentang efektivitas metode belajar cepat mengaji untuk anak dan bagaimana orang tua dapat mendukung proses belajarnya.",
  },
  {
    slug: "metode-albarqy-anti-lupa",
    title: "AL BARQY Metode Anti Lupa",
    category: "Metode Membaca",
    image: "/images/penaameen/methods/logoantilupa.png",
    date: "10 Januari 2026",
    readTime: "6 min read",
    excerpt:
      "Artikel ini menjelaskan keunikan metode Al-Barqy yang dikenal sebagai metode anti lupa dalam belajar membaca Al-Qur'an.",
  },
  {
    slug: "keunggulan-metode-acm",
    title: "Keunggulan Metode ACM",
    category: "Untuk Guru",
    image: "/images/penaameen/methods/albarqy.png",
    date: "8 Januari 2026",
    readTime: "4 min read",
    excerpt:
      "Artikel ini membahas keunggulan metode ACM dalam proses belajar membaca untuk anak usia dini.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background-50 text-supporting-900">
      {/* Interactive Hero Section */}
      <HeroSection />

      {/* Brand Intro */}
      <section className="py-16 md:py-24 bg-background-50">
        <div className="container px-4 mx-auto">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <Reveal>
              <div>
                <span className="mb-4 inline-block text-sm font-semibold tracking-widest uppercase text-primary-600">
                  WHO WE ARE
                </span>
                <h2 className="mb-6 text-section font-serif text-primary-800 leading-tight">
                  Belajar tanpa mengenal usia.
                </h2>
                <p className="mb-8 text-supporting-600 leading-relaxed">
                  PENA AMEEN membantu menghadirkan metode dan perangkat belajar
                  yang sederhana, praktis, dan menyenangkan untuk semua usia.
                </p>
                <Link
                  href="/tentang"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
                >
                  Kenali PENA AMEEN
                  <svg
                    className="ml-2 h-4 w-4"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-supporting-200">
                <Image
                  src="/images/penaameen/editorial/anak-belajar-mengaji.jpg"
                  alt="Anak belajar mengaji"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-4 text-center text-caption text-supporting-500">
                Belajar • Bertumbuh • Berproses
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="py-16 md:py-24 bg-primary-50">
        <div className="container px-4 mx-auto">
          <Reveal>
            <h2 className="mb-12 text-section font-serif text-center text-primary-800">
              Ekosistem Belajar untuk Semua
            </h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Untuk Anak",
                description: "Belajar membaca dengan cara yang menyenangkan.",
                image: "/images/penaameen/products/aktivitas.jpg",
              },
              {
                title: "Untuk Orang Tua",
                description: "Mendampingi proses belajar di rumah.",
                image: "/images/penaameen/products/home-learning.jpg",
              },
              {
                title: "Untuk Guru",
                description: "Perangkat pembelajaran yang praktis.",
                image: "/images/penaameen/products/flashcard.jpg",
              },
              {
                title: "Untuk Dewasa",
                description: "Belajar kembali tanpa rasa malu atau terbebani.",
                image: "/images/penaameen/products/poster.jpg",
              },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-supporting-200 flex flex-col h-full">
                  <div className="relative mb-4 aspect-[4/3] rounded-xl overflow-hidden bg-supporting-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mb-2 text-productTitle font-serif text-primary-700">
                    {item.title}
                  </h3>
                  <p className="text-supporting-600">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Methods */}
      <section className="py-16 md:py-24 bg-background-50 border-y border-supporting-200/50">
        <div className="container px-4 mx-auto">
          <Reveal>
            <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
              <span className="mb-3 inline-block text-xs font-semibold tracking-widest uppercase text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200/60">
                METODOLOGI UNGGULAN
              </span>
              <h2 className="text-section font-serif text-primary-900 leading-tight mb-4">
                Metode yang Memberi Hasil Nyata
              </h2>
              <p className="text-supporting-600 text-base sm:text-lg">
                Dua pilar metodologi teruji yang telah dipercaya oleh ribuan
                keluarga, guru, dan lembaga pendidikan di seluruh Indonesia.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-2 items-stretch max-w-5xl mx-auto">
            {/* Card ACM */}
            <Reveal delay={0.1}>
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-supporting-200/80 hover:shadow-md hover:border-primary-200 transition-all duration-300 flex flex-col h-full group">
                <div className="relative aspect-[16/10] bg-secondary-100 overflow-hidden">
                  <Image
                    src="/images/penaameen/methods/method-acm.jpg"
                    alt="Anak ceria belajar membaca dengan buku metode ACM"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/60 shadow-xs">
                    <span className="text-xs font-semibold text-primary-800">
                      👶 Usia 3–8 Tahun
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-primary-600/90 backdrop-blur-md px-3 py-1 rounded-full shadow-xs">
                    <span className="text-xs font-medium text-white">
                      Membaca Latin Ceria
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary-800 mb-2">
                      ACM (Aku Cepat Membaca)
                    </h3>
                    <p className="text-sm sm:text-base text-supporting-600 leading-relaxed mb-6">
                      Metode pembelajaran membaca aktif yang dirancang khusus
                      untuk anak usia dini dengan pendekatan bermain sambil
                      belajar tanpa beban hafalan ejaan yang kaku.
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold flex-shrink-0">
                          ✓
                        </div>
                        <span className="text-xs sm:text-sm text-supporting-700">
                          <strong>Bermain Sambil Belajar:</strong> Anak belajar
                          dengan gembira, antusias, dan percaya diri.
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold flex-shrink-0">
                          ✓
                        </div>
                        <span className="text-xs sm:text-sm text-supporting-700">
                          <strong>Media Interaktif:</strong> Didukung buku
                          aktivitas bergambar, kartu kata, dan evaluasi berkala.
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold flex-shrink-0">
                          ✓
                        </div>
                        <span className="text-xs sm:text-sm text-supporting-700">
                          <strong>Sistematis &amp; Cepat:</strong> Teruji
                          menumbuhkan minat membaca mandiri sejak dini.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-supporting-100">
                    <Link
                      href="/metode/acm"
                      className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>Pelajari Metode ACM</span>
                      <svg
                        className="h-4 w-4"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                    <Link
                      href="/produk"
                      className="px-4 py-2.5 border border-primary-200 text-primary-700 rounded-xl hover:bg-primary-50 transition-colors text-xs sm:text-sm font-medium"
                    >
                      Lihat Produk ACM
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Card AL-BARQY */}
            <Reveal delay={0.2}>
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-supporting-200/80 hover:shadow-md hover:border-primary-200 transition-all duration-300 flex flex-col h-full group">
                <div className="relative aspect-[16/10] bg-secondary-100 overflow-hidden">
                  <Image
                    src="/images/penaameen/methods/method-albarqy.jpg"
                    alt="Santri belajar membaca Al-Qur'an dengan metode Al-Barqy"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/60 shadow-xs">
                    <span className="text-xs font-semibold text-primary-800">
                      📖 Anak &amp; Dewasa
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-accent-600/90 backdrop-blur-md px-3 py-1 rounded-full shadow-xs">
                    <span className="text-xs font-medium text-white">
                      Sistem 200 Menit
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary-800 mb-2">
                      AL-BARQY (Metode Anti Lupa)
                    </h3>
                    <p className="text-sm sm:text-base text-supporting-600 leading-relaxed mb-6">
                      Metode cepat belajar membaca Al-Qur&apos;an yang
                      revolusioner dan melegenda. Menggunakan formula struktur
                      kata yang mudah dipahami dan melekat kuat seumur hidup.
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold flex-shrink-0">
                          ✓
                        </div>
                        <span className="text-xs sm:text-sm text-supporting-700">
                          <strong>Formula Anti Lupa:</strong> Pola struktur
                          bunyi yang langsung mengendap di memori jangka
                          panjang.
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold flex-shrink-0">
                          ✓
                        </div>
                        <span className="text-xs sm:text-sm text-supporting-700">
                          <strong>Cepat 200 Menit:</strong> Efektif untuk
                          pemula, anak-anak, santri, hingga dewasa/lansia.
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold flex-shrink-0">
                          ✓
                        </div>
                        <span className="text-xs sm:text-sm text-supporting-700">
                          <strong>Perangkat Lengkap:</strong> Buku panduan,
                          poster klasikal, modul guru, dan kartu flashcard.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-supporting-100">
                    <Link
                      href="/metode/al-barqy"
                      className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>Pelajari Metode Al-Barqy</span>
                      <svg
                        className="h-4 w-4"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                    <Link
                      href="/produk/paket-home-learning-albarqy"
                      className="px-4 py-2.5 border border-primary-200 text-primary-700 rounded-xl hover:bg-primary-50 transition-colors text-xs sm:text-sm font-medium"
                    >
                      Lihat Paket Al-Barqy
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-16 md:py-24 bg-background-100">
        <div className="container px-4 mx-auto">
          <Reveal>
            <h2 className="mb-4 text-section font-serif text-center text-primary-800">
              Perangkat Belajar yang Dirancang untuk Digunakan.
            </h2>
            <p className="mb-10 text-center text-supporting-600 max-w-2xl mx-auto">
              Semua produk kami dirancang agar nyaman dipegang, mudah digunakan,
              dan memberikan pengalaman belajar yang menyenangkan.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/produk/${product.slug}`}
                  className="group flex-shrink-0 w-[280px] snap-start bg-white rounded-2xl overflow-hidden shadow-sm border border-supporting-200 hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] bg-secondary-200">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="280px"
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <span className="mb-2 inline-flex items-center px-2.5 py-0.5 bg-primary-100 text-primary-800 text-xs font-medium rounded">
                      {product.category}
                    </span>
                    <h3 className="mb-2 text-productTitle font-serif text-primary-700 leading-tight">
                      {product.name}
                    </h3>
                    <p className="mb-3 text-sm text-supporting-500 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-semibold text-primary-600">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Lihat detail →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured Product */}
      <FeaturedProductSection />

      {/* Learning Journey */}
      <LearningJourneySection />

      {/* Interactive Rich Testimonials */}
      <TestimonialsSection />

      {/* Editorial Feature */}
      <EditorialStorySection />

      {/* Articles */}
      <section className="py-16 md:py-24 bg-background-50">
        <div className="container px-4 mx-auto">
          <Reveal>
            <h2 className="mb-12 text-section font-serif text-center text-primary-800">
              Artikel &amp; Wawasan
            </h2>
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-3">
            <Reveal delay={0.1}>
              <Link
                href={`/artikel/${articles[0].slug}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-supporting-200 hover:shadow-md transition-all lg:col-span-2 lg:row-span-2"
              >
                <div className="relative aspect-[16/9] bg-supporting-200">
                  <Image
                    src={articles[0].image}
                    alt={articles[0].title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <span className="mb-2 inline-flex items-center px-2.5 py-0.5 bg-primary-100 text-primary-800 text-xs font-medium rounded">
                    {articles[0].category}
                  </span>
                  <h3 className="mb-3 text-productTitle font-serif text-primary-700">
                    {articles[0].title}
                  </h3>
                  <p className="mb-4 text-supporting-600 line-clamp-2">
                    {articles[0].excerpt}
                  </p>
                  <div className="flex items-center text-sm text-supporting-500">
                    <span className="mr-3">{articles[0].date}</span>
                    <span>•</span>
                    <span className="ml-3">{articles[0].readTime}</span>
                  </div>
                </div>
              </Link>
            </Reveal>
            <Reveal delay={0.2}>
              <Link
                href={`/artikel/${articles[1].slug}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-supporting-200 hover:shadow-md transition-all"
              >
                <div className="relative aspect-[4/3] bg-supporting-200">
                  <Image
                    src={articles[1].image}
                    alt={articles[1].title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <span className="mb-2 inline-flex items-center px-2.5 py-0.5 bg-primary-100 text-primary-800 text-xs font-medium rounded">
                    {articles[1].category}
                  </span>
                  <h3 className="mb-2 text-productTitle font-serif text-primary-700">
                    {articles[1].title}
                  </h3>
                  <p className="mb-3 text-sm text-supporting-600 line-clamp-2">
                    {articles[1].excerpt}
                  </p>
                  <div className="flex items-center text-sm text-supporting-500">
                    <span className="mr-3">{articles[1].date}</span>
                    <span>•</span>
                    <span className="ml-3">{articles[1].readTime}</span>
                  </div>
                </div>
              </Link>
            </Reveal>
            <Reveal delay={0.3}>
              <Link
                href={`/artikel/${articles[2].slug}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-supporting-200 hover:shadow-md transition-all"
              >
                <div className="relative aspect-[4/3] bg-supporting-200">
                  <Image
                    src={articles[2].image}
                    alt={articles[2].title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <span className="mb-2 inline-flex items-center px-2.5 py-0.5 bg-primary-100 text-primary-800 text-xs font-medium rounded">
                    {articles[2].category}
                  </span>
                  <h3 className="mb-2 text-productTitle font-serif text-primary-700">
                    {articles[2].title}
                  </h3>
                  <p className="mb-3 text-sm text-supporting-600 line-clamp-2">
                    {articles[2].excerpt}
                  </p>
                  <div className="flex items-center text-sm text-supporting-500">
                    <span className="mr-3">{articles[2].date}</span>
                    <span>•</span>
                    <span className="ml-3">{articles[2].readTime}</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/artikel"
              className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
            >
              Baca Semua Artikel
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-primary-950 text-white relative overflow-hidden border-t border-primary-800">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <Image
            src="/images/penaameen/hero/hero-bg-islamic-learning.jpg"
            alt=""
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="container relative z-10 px-4 mx-auto">
          <Reveal>
            <div className="max-w-3xl mx-auto text-center text-white">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
                PENA AMEEN • METODE ANTI LUPA
              </span>
              <h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight drop-shadow-md">
                Mulai Perjalanan Belajar Hari Ini.
              </h2>
              <p className="mb-8 text-base sm:text-lg text-white/90 leading-relaxed max-w-xl mx-auto drop-shadow-xs">
                Temukan metode dan perangkat belajar yang paling sesuai untuk Anda dan keluarga.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/produk"
                  className="px-7 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg transition-all text-sm inline-flex items-center gap-2"
                >
                  <span>Jelajahi Produk</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/metode"
                  className="px-6 py-3.5 border border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl backdrop-blur-md transition-all text-sm"
                >
                  Kenali Metode
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
