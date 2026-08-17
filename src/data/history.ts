// src/data/history.ts
//
// Company history content for the Sejarah route.
// Every claim below comes from the approved PENA AMEEN history copy: no
// figures, dates, partners, or outcomes may be added without a source.

export interface HistoryMilestone {
  id: string;
  /** Display period, e.g. "1995" or "2013–2015". */
  period: string;
  /** Short label used by the timeline navigation rail. */
  navLabel: string;
  /** Small kicker above the milestone title. */
  eyebrow: string;
  title: string;
  /** One sentence used in the rail and roadmap summary. */
  summary: string;
  /** Full narrative paragraph for the milestone panel. */
  narrative: string;
  highlights: { label: string; detail: string }[];
  image: string;
  imageAlt: string;
  caption: string;
}

export const historyMilestones: HistoryMilestone[] = [
  {
    id: "1995-pena-suci",
    period: "1995",
    navLabel: "PENA SUCI",
    eyebrow: "Awal Mula",
    title: "Berdirinya PENA SUCI",
    summary:
      "Berdiri sebagai perusahaan printing & publishing yang menerbitkan buku dan perangkat pendidikan.",
    narrative:
      "PENA SUCI merupakan perusahaan yang bergerak di bidang printing & publishing. Berdiri tahun 1995 dengan menerbitkan buku-buku dan perangkat pendidikan, terutama dalam bidang metode pembelajaran baca tulis latin dan Al-Qur'an, yaitu Metode ACM dan Al-Barqy.",
    highlights: [
      {
        label: "Bidang usaha",
        detail: "Printing & publishing untuk buku dan perangkat pendidikan.",
      },
      {
        label: "Fokus penerbitan",
        detail: "Metode pembelajaran baca tulis latin dan Al-Qur'an.",
      },
      {
        label: "Dua metode awal",
        detail: "Metode ACM dan Metode Al-Barqy mulai diterbitkan.",
      },
    ],
    image: "/images/penaameen/hero/hero-kit-showcase.jpg",
    imageAlt:
      "Kit perangkat buku dan kartu edukasi belajar membaca Al-Barqy dan ACM",
    caption: "Buku dan perangkat pendidikan sebagai produk pertama",
  },
  {
    id: "training-workshop",
    period: "Pengembangan",
    navLabel: "Training",
    eyebrow: "Penyebaran Metode",
    title: "Training dan Workshop ke Berbagai Wilayah",
    summary:
      "Metode diperkenalkan langsung melalui training dan workshop di Indonesia dan mancanegara.",
    narrative:
      "Dalam pengembangannya, PENA SUCI mengadakan Training dan Workshop ke berbagai wilayah di Indonesia dan mancanegara. Pendekatan tatap muka ini menjadi cara utama memperkenalkan Metode ACM dan Al-Barqy kepada para pendidik.",
    highlights: [
      {
        label: "Jangkauan nasional",
        detail: "Training dan workshop ke berbagai wilayah di Indonesia.",
      },
      {
        label: "Jangkauan mancanegara",
        detail: "Kegiatan pengenalan metode juga dilakukan di luar negeri.",
      },
      {
        label: "Format kegiatan",
        detail: "Training dan workshop bagi pendidik dan lembaga pendidikan.",
      },
    ],
    image: "/images/penaameen/journey/step-3-perangkat.jpg",
    imageAlt:
      "Koleksi buku, kartu belajar hijaiyah, dan perangkat edukasi PENA AMEEN",
    caption: "Perangkat metode yang dibawa ke ruang pelatihan",
  },
  {
    id: "al-ameen-serve-holding",
    period: "Kemitraan",
    navLabel: "Kemitraan",
    eyebrow: "Kolaborasi Lintas Negara",
    title: "Bekerja Sama dengan Al Ameen Serve Holding",
    summary:
      "Kemitraan dengan penerbit besar Malaysia membawa produk ke Asia Tenggara.",
    narrative:
      "PENA SUCI bekerja sama dengan salah satu penerbit besar di Malaysia, yaitu Al Ameen Serve Holding. Melalui kerja sama ini, produk-produk PENA SUCI beredar di berbagai negara di Asia Tenggara, di antaranya Malaysia, Singapura, dan Thailand.",
    highlights: [
      {
        label: "Mitra penerbitan",
        detail: "Al Ameen Serve Holding, penerbit besar di Malaysia.",
      },
      {
        label: "Peredaran produk",
        detail: "Di antaranya Malaysia, Singapura, dan Thailand.",
      },
      {
        label: "Skala kerja sama",
        detail: "Membuka jalur distribusi metode di kawasan Asia Tenggara.",
      },
    ],
    image: "/images/penaameen/methods/method-albarqy.jpg",
    imageAlt: "Santri belajar membaca Al-Qur'an dengan metode Al-Barqy",
    caption: "Metode yang sama dipelajari lintas negara",
  },
  {
    id: "2013-pena-ameen",
    period: "2013",
    navLabel: "PENA AMEEN",
    eyebrow: "Kelahiran PENA AMEEN",
    title: "Terbentuknya PENA AMEEN",
    summary:
      "PENA SUCI dan Al Ameen Serve Holding membentuk kerja sama yang lebih solid.",
    narrative:
      "Seiring berjalannya waktu, PENA SUCI dan Al Ameen Serve Holding membentuk kerja sama yang lebih solid untuk mengembangkan produk-produk yang ada, yaitu dengan membentuk PENA AMEEN yang berdiri pada tahun 2013. Peningkatan mutu dan pengembangan produk dilakukan guna memberikan hasil yang terbaik bagi konsumen.",
    highlights: [
      {
        label: "Tahun berdiri",
        detail: "PENA AMEEN resmi berdiri pada tahun 2013.",
      },
      {
        label: "Bentuk kerja sama",
        detail: "Kolaborasi yang lebih solid antara kedua perusahaan.",
      },
      {
        label: "Arah kerja",
        detail: "Peningkatan mutu dan pengembangan produk yang sudah ada.",
      },
    ],
    image: "/images/penaameen/products/featured-home-learning.jpg",
    imageAlt:
      "Paket Home Learning Al-Barqy berisi buku, flashcard, poster, dan tas eksklusif",
    caption: "Peningkatan mutu dan pengembangan produk",
  },
  {
    id: "2013-2015-pelatihan",
    period: "2013–2015",
    navLabel: "Pelatihan Masif",
    eyebrow: "Pengenalan Secara Masif",
    title: "Pelatihan, Seminar, dan Training for Trainer",
    summary:
      "Tiga tahun pengenalan metode secara masif kepada para guru dan pelatih.",
    narrative:
      "Pelatihan, Seminar, dan Training for Trainer dilakukan selama tahun 2013–2015 guna mengenalkan Metode Al-Barqy dan ACM secara lebih masif. Sampai saat ini telah melatih puluhan ribu guru untuk Metode Al-Barqy dan ACM.",
    highlights: [
      {
        label: "Periode",
        detail: "Program berjalan sepanjang tahun 2013 hingga 2015.",
      },
      {
        label: "Bentuk program",
        detail: "Pelatihan, seminar, dan Training for Trainer.",
      },
      {
        label: "Hasil sampai saat ini",
        detail: "Puluhan ribu guru telah dilatih untuk Al-Barqy dan ACM.",
      },
    ],
    image: "/images/penaameen/journey/step-4-latihan.jpg",
    imageAlt:
      "Pendamping dan anak berlatih menulis serta membaca bersama di meja belajar",
    caption: "Guru terlatih menjadi kunci penyebaran metode",
  },
  {
    id: "kini-literasi",
    period: "Kini",
    navLabel: "Hari Ini",
    eyebrow: "Peran Hari Ini",
    title: "Pemberantasan Buta Aksara Latin dan Al-Qur'an",
    summary:
      "Menyediakan metode untuk anak dan orang dewasa penyandang buta aksara.",
    narrative:
      "PENA AMEEN menjadi penyedia metode pembelajaran yang terbaik untuk pendidikan anak dan orang dewasa penyandang buta aksara, di antaranya pemberantasan buta aksara latin dan Al-Qur'an yang beberapa kali dilakukan bersama beberapa Pemda maupun CSR perusahaan, di antaranya Kabupaten Malang, NTB, dan Sampoerna Agro Tbk.",
    highlights: [
      {
        label: "Sasaran program",
        detail: "Anak dan orang dewasa penyandang buta aksara.",
      },
      {
        label: "Cakupan literasi",
        detail: "Pemberantasan buta aksara latin dan Al-Qur'an.",
      },
      {
        label: "Pola kerja sama",
        detail: "Bersama pemerintah daerah maupun program CSR perusahaan.",
      },
    ],
    image: "/images/penaameen/journey/step-5-tumbuh.jpg",
    imageAlt:
      "Siswi tersenyum memegang piagam dan membaca buku dengan percaya diri",
    caption: "Literasi sebagai tujuan jangka panjang",
  },
];

/** Headline figures for the page hero. Sourced from the history copy only. */
export const historyFacts = [
  { value: "1995", label: "PENA SUCI berdiri sebagai penerbit pendidikan" },
  { value: "2013", label: "PENA AMEEN terbentuk sebagai kerja sama lanjutan" },
  { value: "2 metode", label: "Metode ACM dan Metode Al-Barqy" },
  { value: "Puluhan ribu", label: "Guru telah dilatih sampai saat ini" },
] as const;

/** Companies behind PENA AMEEN. */
export const historyFounders = [
  {
    name: "PENA SUCI",
    origin: "Indonesia",
    role: "Printing & publishing",
    detail:
      "Berdiri tahun 1995, menerbitkan buku dan perangkat pendidikan untuk Metode ACM dan Al-Barqy.",
  },
  {
    name: "AL AMEEN SERVE HOLDING",
    origin: "Malaysia",
    role: "Penerbit",
    detail:
      "Salah satu penerbit besar di Malaysia yang bekerja sama mengembangkan produk-produk PENA SUCI.",
  },
] as const;

/** Product reach named in the history copy. */
export const historyReach = [
  { country: "Indonesia", note: "Basis penerbitan, training, dan workshop" },
  { country: "Malaysia", note: "Kerja sama dengan Al Ameen Serve Holding" },
  { country: "Singapura", note: "Peredaran produk di Asia Tenggara" },
  { country: "Thailand", note: "Peredaran produk di Asia Tenggara" },
] as const;

/** Characteristics of both methods, as described in the history copy. */
export const methodTraits = [
  "Mudah",
  "Cepat",
  "Menyenangkan",
  "Anti lupa",
] as const;

/** Literacy programme partners named in the history copy. */
export const literacyPartners = [
  { name: "Kabupaten Malang", type: "Pemerintah Daerah" },
  { name: "NTB", type: "Pemerintah Daerah" },
  { name: "Sampoerna Agro Tbk", type: "CSR Perusahaan" },
] as const;
