import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { HeroSection } from "@/components/sections/HeroSection";
import { LearningJourneySection } from "@/components/sections/LearningJourneySection";
import { FeaturedProductSection } from "@/components/sections/FeaturedProductSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { EditorialStorySection } from "@/components/sections/EditorialStorySection";
import { ProductCatalogSection } from "@/components/sections/ProductCatalogSection";

const articles = [
  {
    slug: "belajar-cepat-mengaji-untuk-anak",
    title: "Belajar Cepat Mengaji untuk Anak: Kunci Konsistensi 15 Menit Sehari",
    category: "Tips Belajar",
    image: "/images/penaameen/editorial/anak-belajar-mengaji.jpg",
    date: "12 Januari 2026",
    readTime: "5 min read",
    excerpt:
      "Panduan mendampingi anak belajar membaca Al-Qur'an di rumah tanpa rasa bosan dan tanpa paksaan melalui pendekatan fonetik alami.",
  },
  {
    slug: "metode-albarqy-anti-lupa",
    title: "Mengenal Formula Kata Bunyi Anti-Lupa pada Metode AL-BARQY",
    category: "Metode Al-Qur'an",
    image: "/images/penaameen/methods/logoantilupa.png",
    date: "10 Januari 2026",
    readTime: "6 min read",
    excerpt:
      "Mengapa rumus kata kunci A-DA-RA-JA mampu mengunci ingatan membaca Al-Qur'an seumur hidup hanya dalam 200 menit.",
  },
  {
    slug: "keunggulan-metode-acm",
    title: "Mengapa Metode ACM Efektif Mengajarkan Anak Membaca Tanpa Mengeja",
    category: "Literasi Anak",
    image: "/images/penaameen/methods/albarqy.png",
    date: "8 Januari 2026",
    readTime: "4 min read",
    excerpt:
      "Ulasan ilmiah mengapa menghafal abjad A–Z di awal memperlambat kemampuan membaca anak dan bagaimana ACM mengatasinya.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background-50 text-supporting-900">
      {/* 1. Interactive Hero Section */}
      <HeroSection />

      {/* 2. Brand Intro Section */}
      <section className="py-16 md:py-24 bg-white border-y border-supporting-200/60 relative overflow-hidden">
        <div
          className="absolute -top-20 -right-20 w-80 h-80 bg-primary-100/40 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="container px-4 mx-auto relative z-10 max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 items-center">
            {/* Left Column: Story & Value Checkpoints */}
            <div className="lg:col-span-6">
              <Reveal>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1 bg-primary-100 text-primary-800 rounded-full border border-primary-200/70">
                      TENTANG PENA AMEEN
                    </span>
                    <span className="text-xs text-supporting-500 font-medium hidden sm:inline">
                      • Sejak 1995
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary-950 leading-tight mb-4">
                    Belajar Tanpa Mengenal Usia.{" "}
                    <span className="block text-primary-600 text-2xl sm:text-3xl md:text-4xl mt-1">
                      Penerbit Resmi Metode Membaca &amp; Al-Qur&apos;an.
                    </span>
                  </h2>

                  <p className="text-sm sm:text-base text-supporting-600 leading-relaxed mb-6">
                    PENA AMEEN menerbitkan metode legendaris <strong>AL-BARQY</strong> (Cepat Baca Al-Qur&apos;an 200 Menit Anti-Lupa) dan <strong>ACM</strong> (Aku Cepat Membaca Tanpa Mengeja). Kami telah mendampingi lebih dari 8.000+ keluarga dan 500+ TPQ/sekolah di Indonesia dan Asia Tenggara.
                  </p>

                  {/* 3 Pillars */}
                  <div className="space-y-3 mb-8">
                    {[
                      {
                        title: "Formula Fonetik Anti-Lupa",
                        desc: "Mengunci ingatan jangka panjang melalui asosiasi bunyi kata alami bahasa Indonesia.",
                      },
                      {
                        title: "15–20 Menit Sehari di Rumah",
                        desc: "Pendampingan mandiri yang menyenangkan tanpa stres dan tanpa paksaan.",
                      },
                      {
                        title: "30+ Tahun Teruji & Bersertifikasi",
                        desc: "Standar kurikulum resmi ratusan lembaga TPQ, sekolah dasar, dan program literasi.",
                      },
                    ].map((pillar, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-supporting-50/70 border border-supporting-200/80">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                          ✓
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-primary-950">{pillar.title}</h4>
                          <p className="text-[11px] sm:text-xs text-supporting-600 leading-snug">{pillar.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      href="/tentang"
                      className="px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs inline-flex items-center gap-2 transition-colors"
                    >
                      <span>Kenali Profil Lengkap</span>
                      <span>→</span>
                    </Link>
                    <Link
                      href="/metode"
                      className="px-5 py-3.5 bg-white hover:bg-supporting-50 text-primary-800 font-bold rounded-xl text-xs sm:text-sm border border-supporting-300 transition-colors"
                    >
                      Pelajari 2 Metode Unggulan
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Column: 4K HD Family Study Photography Showcase */}
            <div className="lg:col-span-6">
              <Reveal delay={0.2}>
                <div className="relative">
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-supporting-200 group">
                    <Image
                      src="/images/penaameen/editorial/anak-belajar-mengaji.jpg?v=20260817c"
                      alt="Suasana belajar mengaji dan membaca bersama keluarga Penerbit Pena Ameen"
                      fill
                      unoptimized
                      priority
                      className="object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 via-transparent to-transparent opacity-90" />

                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/80 shadow-md">
                      <span className="text-xs font-bold text-primary-800 flex items-center gap-1.5">
                        <span>✨</span>
                        <span>Eksplorasi Hangat &amp; Alami</span>
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 bg-primary-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
                          ♥
                        </span>
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">
                            8.000+ Keluarga &amp; Santri
                          </p>
                          <p className="text-[11px] text-emerald-300">
                            Belajar Menyenangkan Tanpa Paksaan
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold bg-white/20 text-white px-2.5 py-1 rounded-lg">
                        Anti-Lupa
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-center text-caption text-supporting-500 font-medium">
                    Belajar • Bertumbuh • Berproses Penuh Kasih Sayang
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Ecosystem Section */}
      <section className="py-16 md:py-24 bg-primary-50">
        <div className="container px-4 mx-auto max-w-6xl">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-primary-700 bg-primary-100 px-3.5 py-1 rounded-full border border-primary-200 inline-block mb-2.5">
                SOLUSI TEPAT SASARAN
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary-950">
                Ekosistem Belajar untuk Semua Kalangan
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Anak Usia Dini (PAUD/TK)",
                description: "Lancar membaca huruf Latin tanpa mengeja dan bebas stres.",
                image: "/images/penaameen/products/aktivitas.jpg",
                badge: "Metode ACM",
              },
              {
                title: "Orang Tua di Rumah",
                description: "Modul pendampingan mandiri praktis 15 menit per hari.",
                image: "/images/penaameen/products/home-learning.jpg",
                badge: "Home Learning",
              },
              {
                title: "Guru & Pengajar TPQ",
                description: "Perangkat peraga klasikal dinding dan panduan kurikulum kelas.",
                image: "/images/penaameen/products/flashcard.jpg",
                badge: "Alat Peraga Guru",
              },
              {
                title: "Remaja, Dewasa & Mualaf",
                description: "Kuasai membaca Al-Qur'an tartil dalam 200 menit tuntas.",
                image: "/images/penaameen/products/poster.jpg",
                badge: "Al-Barqy 200 Menit",
              },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 0.1}>
                <div className="bg-white rounded-3xl p-5 shadow-2xs border border-supporting-200 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
                  <div>
                    <div className="relative mb-3 aspect-[4/3] rounded-2xl overflow-hidden bg-supporting-100">
                      <Image
                        src={`${item.image}?v=20260817b`}
                        alt={item.title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-primary-950/85 backdrop-blur-md text-[10px] font-bold text-amber-300">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-serif font-bold text-primary-950 mb-1 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-supporting-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Methods Section */}
      <section className="py-16 md:py-24 bg-background-50 border-y border-supporting-200/50">
        <div className="container px-4 mx-auto max-w-6xl">
          <Reveal>
            <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
              <span className="mb-3 inline-block text-xs font-bold tracking-widest uppercase text-primary-700 bg-primary-100 px-3.5 py-1 rounded-full border border-primary-200/60">
                DUA METODOLOGI RESMI
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary-950 leading-tight mb-3">
                Metode yang Memberi Hasil Nyata
              </h2>
              <p className="text-sm sm:text-base text-supporting-600">
                Pilih jalur belajar sesuai target literasi Anda dan keluarga.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-2 items-stretch max-w-5xl mx-auto">
            {/* Card ACM */}
            <Reveal delay={0.1}>
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xs border border-supporting-200/90 hover:shadow-lg hover:border-primary-200 transition-all duration-300 flex flex-col justify-between h-full group">
                <div>
                  <div className="relative aspect-[16/10] bg-secondary-100 overflow-hidden">
                    <Image
                      src="/images/penaameen/methods/method-acm.jpg"
                      alt="Anak ceria belajar membaca dengan buku metode ACM"
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/60 shadow-xs">
                      <span className="text-xs font-bold text-primary-900">
                        👶 Usia 3–8 Tahun &amp; ABK
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 bg-emerald-600 backdrop-blur-md px-3 py-1 rounded-full shadow-xs">
                      <span className="text-xs font-bold text-white">
                        Tanpa Mengeja
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary-950 mb-2">
                      ACM (Aku Cepat Membaca)
                    </h3>
                    <p className="text-xs sm:text-sm text-supporting-600 leading-relaxed mb-6">
                      Metode membaca aktif tanpa mengeja B-A = BA. Menggunakan pendekatan kata lembaga bermakna dan lagu edukatif ceria yang menjaga rasa gembira anak.
                    </p>

                    <div className="space-y-2.5 mb-6">
                      {[
                        { title: "100% Tanpa Mengeja", desc: "Anak langsung membaca suku kata utuh secara spontan." },
                        { title: "Tuntas 16–24 Sesi", desc: "Terukur dan cepat tanpa membebani daya ingat anak." },
                        { title: "Ramah Anak ABK", desc: "Sangat efektif untuk terapi disleksia dan speech delay." },
                      ].map((b, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                            ✓
                          </span>
                          <p className="text-supporting-700">
                            <strong className="text-primary-950">{b.title}:</strong> {b.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 pt-0 border-t border-supporting-100 flex flex-wrap items-center gap-3">
                  <Link
                    href="/metode/acm"
                    className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>Pelajari Metode ACM</span>
                    <span>→</span>
                  </Link>
                  <Link
                    href="/produk"
                    className="px-4 py-2.5 border border-supporting-300 text-primary-900 rounded-xl hover:bg-supporting-50 transition-colors text-xs sm:text-sm font-semibold"
                  >
                    Lihat Produk ACM
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Card AL-BARQY */}
            <Reveal delay={0.2}>
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xs border border-supporting-200/90 hover:shadow-lg hover:border-primary-200 transition-all duration-300 flex flex-col justify-between h-full group">
                <div>
                  <div className="relative aspect-[16/10] bg-secondary-100 overflow-hidden">
                    <Image
                      src="/images/penaameen/methods/method-albarqy.jpg"
                      alt="Santri belajar membaca Al-Qur'an dengan metode Al-Barqy"
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/60 shadow-xs">
                      <span className="text-xs font-bold text-primary-900">
                        📖 Anak, Remaja &amp; Dewasa
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 bg-amber-500 backdrop-blur-md px-3 py-1 rounded-full shadow-xs">
                      <span className="text-xs font-bold text-primary-950">
                        Sistem 200 Menit
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary-950 mb-2">
                      AL-BARQY (Metode Anti-Lupa)
                    </h3>
                    <p className="text-xs sm:text-sm text-supporting-600 leading-relaxed mb-6">
                      Metode cepat membaca Al-Qur&apos;an karya KH. Nursyamsu Muhadi sejak 1965. Membagi materi ke dalam 8 bab terstruktur yang tuntas dalam total durasi 200 menit.
                    </p>

                    <div className="space-y-2.5 mb-6">
                      {[
                        { title: "Formula Kata Anti-Lupa", desc: "Rumus kata kunci fonetik A-DA-RA-JA, MA-HA-KA-YA." },
                        { title: "Tuntas 200 Menit", desc: "8 sesi @ 25 menit efektif dari nol sampai tartil." },
                        { title: "Tajwid Terapan", desc: "Langsung lancar membaca ayat Al-Qur'an tanpa rumus rumit." },
                      ].map((b, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                            ✓
                          </span>
                          <p className="text-supporting-700">
                            <strong className="text-primary-950">{b.title}:</strong> {b.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 pt-0 border-t border-supporting-100 flex flex-wrap items-center gap-3">
                  <Link
                    href="/metode/al-barqy"
                    className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>Pelajari Metode Al-Barqy</span>
                    <span>→</span>
                  </Link>
                  <Link
                    href="/produk/paket-home-learning-albarqy"
                    className="px-4 py-2.5 border border-supporting-300 text-primary-900 rounded-xl hover:bg-supporting-50 transition-colors text-xs sm:text-sm font-semibold"
                  >
                    Lihat Paket Al-Barqy
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. Product Showcase Catalog Section */}
      <ProductCatalogSection />

      {/* 6. Featured Product (Home Learning Al-Barqy) */}
      <FeaturedProductSection />

      {/* 7. Learning Journey Section */}
      <LearningJourneySection />

      {/* 8. Interactive Rich Testimonials */}
      <TestimonialsSection />

      {/* 9. Editorial Feature / Manifesto */}
      <EditorialStorySection />

      {/* 10. Articles Section */}
      <section className="py-16 md:py-24 bg-background-50">
        <div className="container px-4 mx-auto max-w-6xl">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-primary-700 bg-primary-100 px-3.5 py-1 rounded-full border border-primary-200 inline-block mb-2.5">
                ARTIKEL &amp; WAWASAN
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary-950">
                Panduan Edukasi Membaca &amp; Mengaji
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-3">
            {articles.map((art, idx) => (
              <Reveal key={art.slug} delay={idx * 0.1}>
                <Link
                  href={`/artikel/${art.slug}`}
                  className="group block bg-white rounded-3xl overflow-hidden shadow-2xs border border-supporting-200 hover:shadow-lg hover:-translate-y-1 transition-all h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/3] bg-supporting-200 overflow-hidden">
                      <Image
                        src={art.image}
                        alt={art.title}
                        fill
                        unoptimized
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-primary-950/85 text-white text-[10px] font-bold">
                        {art.category}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="text-base font-serif font-bold text-primary-950 group-hover:text-primary-700 transition-colors line-clamp-2 mb-2 leading-snug">
                        {art.title}
                      </h3>
                      <p className="text-xs text-supporting-600 line-clamp-2 leading-relaxed mb-4">
                        {art.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-supporting-100 flex items-center justify-between text-xs text-supporting-500">
                    <span>{art.date}</span>
                    <span className="font-semibold text-primary-700 group-hover:underline">
                      Baca Artikel →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/artikel"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-supporting-50 text-primary-950 font-bold rounded-xl text-xs sm:text-sm border border-supporting-300 shadow-2xs transition-colors"
            >
              <span>Lihat Seluruh Artikel &amp; Panduan</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 11. Final CTA Section */}
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
        <div className="container relative z-10 px-4 mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
              PENA AMEEN • METODOLOGI TERBUKTI
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-4 drop-shadow-md">
              Mulai Perjalanan Belajar Membaca Sekarang.
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-xl mx-auto mb-8 drop-shadow-xs">
              Pesan paket modul belajar orisinal bergaransi resmi dari Penerbit Pena Ameen atau konsultasikan kebutuhan kurikulum lembaga Anda.
            </p>
            <div className="flex flex-wrap gap-3.5 justify-center">
              <Link
                href="/produk"
                className="px-7 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg transition-all text-xs sm:text-sm inline-flex items-center gap-2"
              >
                <span>Pesan Paket Belajar Resmi</span>
                <span>→</span>
              </Link>
              <Link
                href="/kontak"
                className="px-6 py-3.5 border border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl backdrop-blur-md transition-all text-xs sm:text-sm"
              >
                Konsultasi CS / Kemitraan
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
