import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BookOpen,
  Users,
  HeartHandshake,
  Award,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Home,
  Layers,
  MapPin,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Tentang Kami — Penerbit Pena Ameen | Pelopor Metode Al-Barqy & ACM",
  description:
    "Mengenal lebih dekat Penerbit Pena Ameen (Ameen Educare), lembaga penerbitan dan edukasi pelopor metode cepat belajar membaca Al-Qur'an Al-Barqy (200 Menit Anti Lupa) dan metode ACM untuk anak di Indonesia.",
};

const stats = [
  {
    number: "30+",
    unit: "Tahun",
    label: "Dedikasi Kurikulum",
    desc: "Metodologi teruji membimbing jutaan pemula membaca Al-Qur'an & Latin.",
  },
  {
    number: "8.000+",
    unit: "Keluarga",
    label: "Home Learning Aktif",
    desc: "Orang tua mendampingi anak belajar mandiri di rumah dengan percaya diri.",
  },
  {
    number: "500+",
    unit: "Lembaga",
    label: "TPQ & Sekolah Binaan",
    desc: "Menggunakan paket alat peraga klasikal dan sertifikasi pengajar resmi.",
  },
  {
    number: "200",
    unit: "Menit",
    label: "Formula Al-Barqy",
    desc: "Sistem struktur bunyi kata berpasangan yang anti lupa seumur hidup.",
  },
];

const coreValues = [
  {
    icon: Sparkles,
    title: "Formula Anti Lupa yang Teruji",
    badge: "Metodologi Orisinal",
    description:
      "Metode Al-Barqy menggunakan pendekatan asosiasi struktur bunyi kata bertingkat yang mudah dicerna otak tanpa perlu mengeja huruf satu per satu secara kaku.",
  },
  {
    icon: BookOpen,
    title: "Belajar Ceria & Menyenangkan",
    badge: "Pendekatan Anak",
    description:
      "Metode ACM (Aku Cepat Membaca) menggabungkan konsep bermain, flashcard bergambar warna-warni, dan modul interaktif sehingga anak belajar tanpa tekanan.",
  },
  {
    icon: Home,
    title: "Kemitraan Hangat Keluarga",
    badge: "Home Learning",
    description:
      "Menyediakan panduan lengkap langkah demi langkah bagi ayah dan bunda untuk menjadi mentor belajar terbaik bagi putra-putrinya di rumah.",
  },
  {
    icon: Users,
    title: "Inklusif Lintas Generasi",
    badge: "Untuk Semua Usia",
    description:
      "Dirancang adaptif mulai dari balita usia 3 tahun, anak usia sekolah, remaja, santri TPQ, hingga dewasa dan lansia yang ingin lancar membaca Al-Qur'an.",
  },
];

const ecosystems = [
  {
    icon: GraduationCap,
    name: "Metode Al-Barqy (Cepat 200 Menit)",
    tag: "Spesialis Al-Qur'an",
    desc: "Metode cepat membaca Al-Qur'an legendaris karya Ust. Muhadjir Sulthon yang diakui secara nasional. Menuntaskan buta huruf Al-Qur'an hanya dalam hitungan jam.",
    href: "/metode/al-barqy",
  },
  {
    icon: BookOpen,
    name: "Metode ACM (Aku Cepat Membaca)",
    tag: "Literasi Anak Usia Dini",
    desc: "Metode belajar membaca huruf Latin yang interaktif dan menyenangkan untuk anak usia 3–8 tahun. Membangun fondasi literasi kuat tanpa membebani daya ingat anak.",
    href: "/metode/acm",
  },
  {
    icon: Layers,
    name: "Paket Home Learning & Flashcard",
    tag: "Perangkat Belajar Mandiri",
    desc: "Buku panduan orang tua, kartu flashcard peraga visual, lembar evaluasi bertahap, dan aktivitas motorik yang dirancang khusus untuk kenyamanan belajar di rumah.",
    href: "/produk",
  },
  {
    icon: HeartHandshake,
    name: "Pelatihan & Sertifikasi Guru",
    tag: "Standarisasi Pengajar",
    desc: "Program workshop standarisasi guru Al-Qur'an dan pengajar PAUD/TK di seluruh Indonesia untuk memastikan kualitas pengajaran yang seragam dan menyenangkan.",
    href: "/cabang",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background-50">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-950 via-primary-900 to-secondary-900 text-white py-16 md:py-24 border-b border-primary-800">
        <div className="container relative z-10 px-4 sm:px-6 mx-auto">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-300 mb-6">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>PROFIL PENERBIT & LEMBAGA EDUKASI</span>
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-serif font-bold text-white leading-[1.15] mb-6">
                  Membuka Gerbang Literasi Membaca &amp; Mengaji untuk Seluruh
                  Generasi.
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-8 max-w-2xl font-normal">
                  <strong className="text-emerald-300 font-semibold">
                    Penerbit Pena Ameen (Ameen Educare)
                  </strong>{" "}
                  hadir sebagai pelopor metodologi belajar membaca
                  Al-Qur&apos;an dan huruf Latin yang aplikatif, cepat, anti
                  lupa, dan membahagiakan bagi anak-anak, orang tua, santri,
                  hingga dewasa di seluruh Nusantara.
                </p>
              </Reveal>
              <Reveal delay={0.14}>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/produk"
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all"
                  >
                    <span>Jelajahi Produk Resmi</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/metode"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md hover:bg-white/20 transition-all"
                  >
                    <span>Pelajari Metodologi</span>
                  </Link>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={0.15}>
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-primary-900 group">
                  <Image
                    src="/images/penaameen/editorial/tentang-hero-family.jpg"
                    alt="Keluarga bahagia belajar mengaji dengan metode Pena Ameen"
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs">
                    <p className="font-semibold text-emerald-300">
                      Dedikasi untuk Keluarga Indonesia
                    </p>
                    <p className="text-[11px] text-white/80">
                      Menghadirkan momen belajar Al-Qur&apos;an yang hangat di
                      rumah.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & REPUTATION RIBBON */}
      <section className="py-10 bg-white border-b border-supporting-200 shadow-2xs">
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, idx) => (
              <Reveal key={item.label} delay={idx * 0.08}>
                <div className="p-5 rounded-2xl bg-supporting-50/80 border border-supporting-200/80 text-center hover:bg-white hover:shadow-md transition-all">
                  <div className="flex items-baseline justify-center gap-1 mb-1">
                    <span className="text-3xl sm:text-4xl font-serif font-black text-primary-950">
                      {item.number}
                    </span>
                    <span className="text-sm font-bold text-primary-700">
                      {item.unit}
                    </span>
                  </div>
                  <h2 className="text-xs sm:text-sm font-bold text-supporting-900 mb-1">
                    {item.label}
                  </h2>
                  <p className="text-[11px] text-supporting-500 leading-tight">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BRAND STORY & SEJARAH */}
      <section className="py-16 md:py-24 bg-background-50">
        <div className="container px-4 sm:px-6 mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <Reveal>
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-2 border-supporting-200 bg-supporting-100 group">
                  <Image
                    src="/images/penaameen/editorial/tentang-workshop-guru.jpg"
                    alt="Pelatihan dan standarisasi guru Al-Qur'an Pena Ameen"
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 text-white text-xs">
                    <p className="font-semibold text-amber-300">
                      Pelatihan &amp; Sertifikasi Pengajar
                    </p>
                    <p className="text-[11px] text-white/80">
                      Mencetak ribuan guru Al-Qur&apos;an profesional dan sabar.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6">
              <Reveal delay={0.1}>
                <span className="eyebrow text-primary-700">
                  Kisah &amp; Sejarah Kami
                </span>
                <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary-950 leading-tight">
                  Dari Kepedulian Nyata, Lahir Sebuah Terobosan Metodologi.
                </h2>
                <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-supporting-600">
                  <p>
                    Perjalanan{" "}
                    <strong className="text-supporting-900 font-semibold">
                      Pena Ameen
                    </strong>{" "}
                    berakar dari kepedulian mendalam terhadap banyaknya
                    anak-anak, santri, hingga orang dewasa yang merasa
                    kesulitan, canggung, atau bahkan putus asa saat belajar
                    membaca Al-Qur&apos;an karena metode ejaan huruf
                    konvensional yang kaku dan membutuhkan waktu bertahun-tahun.
                  </p>
                  <p>
                    Melalui dedikasi panjang para pakar pendidikan Islam,
                    dirumuskanlah metode revolusioner{" "}
                    <strong className="text-primary-800 font-semibold">
                      Al-Barqy (Sistem 200 Menit Anti Lupa)
                    </strong>{" "}
                    karya{" "}
                    <strong className="text-supporting-900 font-semibold">
                      Ust. Muhadjir Sulthon
                    </strong>
                    . Dengan pendekatan struktur bunyi kata berpasangan, santri
                    dapat membaca huruf sambung secara alami tanpa rasa
                    terbebani.
                  </p>
                  <p>
                    Tak berhenti di sana, Pena Ameen mengembangkan metode{" "}
                    <strong className="text-primary-800 font-semibold">
                      ACM (Aku Cepat Membaca)
                    </strong>{" "}
                    untuk membaca huruf Latin bagi anak usia dini (3–8 tahun),
                    menghadirkan buku bergambar penuh warna, kartu peraga, dan
                    lembar pantau yang menjadikan membaca sebagai aktivitas
                    bermain yang ditunggu-tunggu setiap hari.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VISI & MISI */}
      <section className="py-16 md:py-20 bg-supporting-100/70 border-y border-supporting-200">
        <div className="container px-4 sm:px-6 mx-auto max-w-5xl">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="eyebrow text-primary-700">
                Fondasi Pergerakan
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary-950">
                Visi &amp; Misi Mulia Kami
              </h2>
              <p className="mt-3 text-sm text-supporting-600">
                Komitmen berkelanjutan menghadirkan sarana literasi berkualitas
                bagi seluruh lapisan masyarakat.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-3xl border border-supporting-200 bg-white p-8 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center font-bold">
                    <Award className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-primary-950">
                    Visi Kami
                  </h3>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-supporting-600">
                  Menjadi pusat penerbitan dan lembaga edukasi terdepan di
                  Indonesia yang menghadirkan metodologi belajar membaca,
                  menulis, dan memahami Al-Qur&apos;an secara inovatif,
                  membahagiakan, inklusif, dan berkesinambungan bagi seluruh
                  generasi umat.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="h-full rounded-3xl border border-supporting-200 bg-white p-8 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-primary-950">
                    Misi Kami
                  </h3>
                </div>
                <ul className="space-y-2.5 text-sm sm:text-base text-supporting-600">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>
                      Menyediakan buku dan alat peraga edukasi yang sistematis,
                      terbukti efektif, dan mudah diaplikasikan.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>
                      Memberdayakan orang tua agar mampu menjadi pendidik utama
                      Al-Qur&apos;an di lingkungan keluarga.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>
                      Menyelenggarakan pelatihan dan standardisasi guru TPQ
                      serta sekolah di seluruh pelosok negeri.
                    </span>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. 4 CORE VALUES / PENDEKATAN KAMI */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 sm:px-6 mx-auto max-w-6xl">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="eyebrow text-primary-700">
                Nilai &amp; Keunggulan
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary-950">
                4 Pilar Utama Metodologi Pena Ameen
              </h2>
              <p className="mt-3 text-sm sm:text-base text-supporting-600">
                Prinsip yang membedakan produk dan pendekatan kami dari metode
                konvensional lainnya.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 0.08}>
                  <div className="group h-full rounded-3xl border border-supporting-200 bg-supporting-50/50 p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 hover:bg-white hover:shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100">
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-primary-950 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm leading-relaxed text-supporting-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. EKOSISTEM METODE & PRODUK */}
      <section className="py-16 md:py-24 bg-supporting-50 border-t border-supporting-200">
        <div className="container px-4 sm:px-6 mx-auto max-w-6xl">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="eyebrow text-primary-700">
                Ekosistem Terpadu
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary-950">
                Solusi Lengkap Belajar &amp; Mengajar
              </h2>
              <p className="mt-3 text-sm sm:text-base text-supporting-600">
                Pilih modul dan program yang paling tepat untuk kebutuhan buah
                hati, keluarga, maupun lembaga Anda.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            {ecosystems.map((eco, idx) => {
              const EcoIcon = eco.icon;
              return (
                <Reveal key={eco.name} delay={idx * 0.08}>
                  <Link
                    href={eco.href}
                    className="group block p-6 sm:p-8 rounded-3xl bg-white border border-supporting-200 shadow-xs hover:border-primary-300 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                        <EcoIcon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-bold text-primary-700 uppercase tracking-wider block mb-1">
                          {eco.tag}
                        </span>
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-primary-950 group-hover:text-primary-700 transition-colors mb-2">
                          {eco.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-supporting-600 leading-relaxed mb-4">
                          {eco.desc}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 group-hover:translate-x-1 transition-transform">
                          <span>Pelajari Selengkapnya</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. CLOSING CTA BANNER */}
      <section className="py-16 md:py-20 bg-primary-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <Image
            src="/images/penaameen/hero/hero-bg-islamic-learning.jpg"
            alt=""
            fill
            unoptimized
            loading="lazy"
            className="object-cover"
          />
        </div>
        <div className="container relative z-10 px-4 sm:px-6 mx-auto">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center text-white">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
                <Sparkles className="h-3.5 w-3.5" />
                Mulai Bersama Pena Ameen
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight mb-4">
                Siap Menghadirkan Momen Belajar yang Menggembirakan?
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-white/80 max-w-2xl mx-auto mb-8">
                Dapatkan paket perangkat resmi Al-Barqy, ACM, dan Home Learning
                sekarang dengan jaminan 100% produk asli dan bimbingan langsung
                dari tim konsultan pendidikan kami.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/produk"
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all"
                >
                  <span>Pesan Paket Belajar Sekarang</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/cabang"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 hover:bg-white/20 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Temukan Cabang &amp; Perwakilan</span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
