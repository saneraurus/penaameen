// src/data/product-rich-details.ts
// Comprehensive rich product descriptions, specifications, box contents, benefits, FAQs, and SEO metadata
// for all 19 published products of Penerbit Pena Ameen.

export interface ProductRichDetail {
  slug: string;
  subtitle: string;
  badge: string;
  rating: number;
  reviewCount: number;
  originalPrice?: number;
  savings?: number;
  author: string;
  publisher: string;
  weight: string;
  dimensions: string;
  language: string;
  targetAge: string;
  isbn?: string;
  boxContents: Array<{
    icon: string;
    name: string;
    description: string;
  }>;
  keyBenefits: Array<{
    title: string;
    description: string;
  }>;
  learningSteps: Array<{
    step: string;
    title: string;
    description: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const productRichDetailsMap: Record<string, ProductRichDetail> = {
  // 1. Paket Home Learning ALBARQY
  "paket-home-learning-albarqy": {
    slug: "paket-home-learning-albarqy",
    subtitle:
      "Solusi Terlengkap & Tercepat Belajar Membaca Al-Qur'an Mandiri di Rumah dengan Formula Anti-Lupa 200 Menit",
    badge: "👑 Paket Unggulan Box Set 5-in-1",
    rating: 4.9,
    reviewCount: 3240,
    originalPrice: 1250000,
    savings: 284000,
    author: "KH. Muhadjir Sulthon",
    publisher: "Penerbit Pena Ameen",
    weight: "1.800 gram (1.8 kg)",
    dimensions: "32 cm x 24 cm x 6 cm",
    language: "Arab & Bahasa Indonesia",
    targetAge: "Anak 4-12 Tahun, Remaja, & Pemula Dewasa",
    isbn: "978-602-8920-11-4",
    boxContents: [
      {
        icon: "📖",
        name: "Buku Utama & Modul AL-BARQY (Jilid 1, 2, 3 Lengkap)",
        description:
          "Kurikulum sistematis mulai dari pengenalan makhraj huruf, huruf sambung, tanda baca, hingga hukum tajwid dan waqaf praktis.",
      },
      {
        icon: "🗂️",
        name: "Flashcard Hijaiyah Interaktif 2 Sisi Bergambar",
        description:
          "28+ kartu tebal laminasi bolak-balik dengan ilustrasi ceria dan panduan bunyi fonetik untuk menstimulasi memori visual anak.",
      },
      {
        icon: "📜",
        name: "Set 12 Poster Edukasi Dinding Klasikal",
        description:
          "Poster dinding format besar beresolusi tinggi dengan struktur rumus kata bunyi Al-Barqy (A-DA-RA-JA, MA-HA-KA-YA) untuk ruang belajar di rumah.",
      },
      {
        icon: "👨‍👩‍👧",
        name: "Buku Panduan Pendamping Orang Tua & Guru",
        description:
          "Instruksi aplikatif langkah demi langkah mendampingi 15-20 menit per hari dengan pendekatan kasih sayang tanpa rasa jenuh atau paksaan.",
      },
      {
        icon: "👜",
        name: "Bonus Tas Kanvas Eksklusif Pena Ameen",
        description:
          "Tas kanvas tebal berkualitas premium untuk menyimpan seluruh modul belajar agar rapi, aman, dan mudah dibawa saat bepergian.",
      },
    ],
    keyBenefits: [
      {
        title: "Sistem Belajar Cepat 200 Menit",
        description:
          "Telah teruji lebih dari 30 tahun membantu santri dan pemula mampu membaca Al-Qur'an secara tartil dalam total durasi belajar 200 menit.",
      },
      {
        title: "Formula Bunyi Kata Anti-Lupa",
        description:
          "Menggunakan asosiasi kata bahasa Indonesia alami sehingga anak tidak mudah lupa ketika mempelajari variasi huruf hijaiyah yang serupa.",
      },
      {
        title: "Pendekatan Menyenangkan Tanpa Beban",
        description:
          "Format interaktif dengan kartu dan poster menjadikan waktu belajar 15 menit sebagai momen bermain dan mempererat kedekatan orang tua.",
      },
      {
        title: "Kertas Tebal & Standar Cetak Premium",
        description:
          "Dicetak menggunakan kertas ramah mata anak, sudut tumpul aman (rounded corners), tahan robek, dan dapat digunakan hingga bertahun-tahun.",
      },
      {
        title: "Garansi Orisinalitas & Penggantian Cacat Kirim",
        description:
          "100% produk asli bergaransi dari Penerbit Pena Ameen. Penggantian unit baru secara gratis jika terjadi kerusakan selama ekspedisi.",
      },
    ],
    learningSteps: [
      {
        step: "Tahap 1",
        title: "Pengenalan Bunyi Huruf Dasar (Hari 1-3)",
        description:
          "Gunakan Flashcard Hijaiyah dan Poster Dinding untuk mengenalkan bunyi huruf utama (A-DA-RA-JA) secara visual dan audio selama 15 menit.",
      },
      {
        step: "Tahap 2",
        title: "Penggabungan Bunyi Kata (Hari 4-7)",
        description:
          "Anak dilatih membaca kombinasi 2 hingga 4 huruf sambung dengan metode analogi kata tanpa perlu mengeja satu per satu.",
      },
      {
        step: "Tahap 3",
        title: "Latihan Membaca Mandiri (Hari 8-14)",
        description:
          "Mulai membuka Buku Utama Al-Barqy didampingi modul petunjuk orang tua untuk memperlancar ritme dan tanda baca panjang-pendek.",
      },
      {
        step: "Tahap 4",
        title: "Tajwid Praktis & Mahir Al-Qur'an (Pekan 3+)",
        description:
          "Pemantapan hukum tajwid (Ghunnah, Ikhfa, Idgham, Qalqalah) langsung pada ayat-ayat pilihan Juz 'Amma dengan penuh percaya diri.",
      },
    ],
    faqs: [
      {
        question:
          "Apakah paket ini cocok untuk anak yang belum mengenal huruf hijaiyah sama sekali?",
        answer:
          "Sangat cocok! Paket Home Learning ALBARQY dirancang khusus mulai dari level nol (pemula dasar). Anak akan dikenalkan bunyi huruf melalui gambar dan asosiasi kata yang mudah dicerna tanpa harus mengeja secara rumit.",
      },
      {
        question: "Berapa lama waktu belajar yang dianjurkan setiap hari?",
        answer:
          "Cukup 15 sampai 20 menit per sesi, 1 kali sehari. Konsistensi waktu pendek jauh lebih efektif untuk daya ingat anak dibanding belajar lama yang memicu kelelahan.",
      },
      {
        question:
          "Apakah pembelajar dewasa atau mualaf juga bisa menggunakan paket ini?",
        answer:
          "Ya. Metode Al-Barqy terbukti sangat efektif untuk segala usia, termasuk remaja, mahasiswa, mualaf, maupun lansia yang ingin belajar membaca Al-Qur'an dari awal secara cepat.",
      },
      {
        question:
          "Bagaimana jika ada buku atau barang yang rusak saat pengiriman?",
        answer:
          "Penerbit Pena Ameen memberikan Garansi Retur 100%. Jika ada item yang rusak atau cacat cetak akibat pengiriman, kami akan mengirimkan penggantinya secara gratis tanpa biaya tambahan.",
      },
    ],
    seo: {
      title:
        "Jual Paket Home Learning ALBARQY Box Set Lengkap | Penerbit Pena Ameen",
      description:
        "Beli Paket Home Learning ALBARQY Box Set 5-in-1 Resmi Penerbit Pena Ameen. Metode cepat 200 menit membaca Al-Qur'an anti-lupa untuk anak & keluarga. Promo hemat Rp284.000 + Garansi Resmi.",
      keywords: [
        "paket home learning albarqy",
        "metode albarqy",
        "belajar mengaji anak cepat",
        "buku albarqy lengkap",
        "flashcard hijaiyah albarqy",
        "penerbit pena ameen",
        "belajar alquran anti lupa",
      ],
    },
  },

  // 2. Paket FlashCard ALBARQY
  "paket-flashcard-albarqy": {
    slug: "paket-flashcard-albarqy",
    subtitle:
      "Media Edukasi Visual Interaktif 28 Huruf Hijaiyah untuk Stimulasi Daya Ingat & Makhraj Huruf",
    badge: "✨ Kartu Edukasi Favorit Anak",
    rating: 4.9,
    reviewCount: 1850,
    originalPrice: 450000,
    savings: 72000,
    author: "Tim Litbang Pena Ameen",
    publisher: "Penerbit Pena Ameen",
    weight: "450 gram",
    dimensions: "15 cm x 10 cm x 4 cm",
    language: "Arab & Indonesia",
    targetAge: "Usia 3 - 9 Tahun",
    isbn: "978-602-8920-15-2",
    boxContents: [
      {
        icon: "🗂️",
        name: "28 Kartu Hijaiyah Tebal Laminasi Glossy",
        description:
          "Kartu tebal tahan air dengan ilustrasi penuh warna di kedua sisinya.",
      },
      {
        icon: "📦",
        name: "Kotak Kemasan Eksklusif (Tuck Box)",
        description:
          "Kemasan kokoh untuk menjaga kartu tetap rapi dan tidak tercecer.",
      },
      {
        icon: "📖",
        name: "Panduan Permainan Edukatif Mini",
        description:
          "Ide permainan interaktif tebak huruf dan sambung kata bersama anak.",
      },
    ],
    keyBenefits: [
      {
        title: "Bahan Karton Tebal & Ujung Membulat",
        description:
          "Aman untuk balita dan anak-anak, tidak tajam, dan tidak mudah sobek.",
      },
      {
        title: "Metode Asosiasi Visual Al-Barqy",
        description:
          "Menghubungkan bentuk huruf dengan objek nyata yang dekat dengan imajinasi anak.",
      },
    ],
    learningSteps: [
      {
        step: "Langkah 1",
        title: "Tebak Gambar & Bunyi",
        description:
          "Tunjukkan sisi gambar untuk mengenalkan bunyi huruf awal.",
      },
      {
        step: "Langkah 2",
        title: "Mengenali Bentuk Huruf Asli",
        description:
          "Balik kartu untuk memperkuat pengenalan bentuk huruf hijaiyah murni.",
      },
    ],
    faqs: [
      {
        question: "Apakah bahannya aman untuk anak usia 3 tahun?",
        answer:
          "Sangat aman. Kartu dicetak pada karton tebal dengan laminasi bebas racun dan sudut membulat.",
      },
    ],
    seo: {
      title: "Jual Paket FlashCard Hijaiyah ALBARQY | Penerbit Pena Ameen",
      description:
        "Beli Paket FlashCard Hijaiyah ALBARQY resmi Penerbit Pena Ameen. Media kartu belajar huruf hijaiyah interaktif ramah anak dengan visual anti-lupa.",
      keywords: [
        "flashcard hijaiyah",
        "kartu hijaiyah albarqy",
        "belajar hijaiyah balita",
      ],
    },
  },

  // 3. Paket Aktivitas ALBARQY
  "paket-aktivitas-albarqy": {
    slug: "paket-aktivitas-albarqy",
    subtitle:
      "Buku Latihan Motorik Halus, Mewarnai, Tracing Huruf, dan Kreativitas Anak Muslim Al-Barqy",
    badge: "🎨 Buku Aktivitas Motorik Anak",
    rating: 4.8,
    reviewCount: 920,
    originalPrice: 135000,
    savings: 32000,
    author: "Tim Kreatif Pena Ameen",
    publisher: "Penerbit Pena Ameen",
    weight: "350 gram",
    dimensions: "28 cm x 21 cm x 1 cm",
    language: "Arab & Indonesia",
    targetAge: "Usia 4 - 8 Tahun",
    isbn: "978-602-8920-19-0",
    boxContents: [
      {
        icon: "📘",
        name: "Buku Aktivitas Spiral Jilid Tebal",
        description:
          "Buku kerja aktivitas mewarnai, maze labirin huruf, tebak kata, dan tracing garis hijaiyah.",
      },
      {
        icon: "✏️",
        name: "Lembar Stiker Prestasi Ceria",
        description:
          "Stiker bintang dan karakter lucu untuk mengapresiasi setiap tugas yang diselesaikan anak.",
      },
    ],
    keyBenefits: [
      {
        title: "Melatih Motorik Halus & Koordinasi Tangan-Mata",
        description:
          "Latihan menarik garis dan menebalkan huruf mempersiapkan kesiapan menulis anak sejak dini.",
      },
      {
        title: "Belajar Sambil Bermain Tanpa Bosan",
        description:
          "Format visual penuh warna dan permainan teka-teki membuat anak tidak merasa sedang dipaksa belajar.",
      },
    ],
    learningSteps: [
      {
        step: "Aktivitas 1",
        title: "Menebalkan Garis & Huruf",
        description:
          "Melatih kelenturan jari dalam membentuk pola dasar hijaiyah.",
      },
      {
        step: "Aktivitas 2",
        title: "Mewarnai Gambar Bertema Islami",
        description: "Menanamkan nilai-nilai adab dan mencintai tempat ibadah.",
      },
    ],
    faqs: [
      {
        question: "Apakah kertasnya tembus spidol?",
        answer:
          "Kertas menggunakan HVS tebal 100 gsm berkualitas sehingga tidak mudah tembus pensil warna atau krayon.",
      },
    ],
    seo: {
      title: "Jual Buku Paket Aktivitas ALBARQY Anak | Penerbit Pena Ameen",
      description:
        "Beli Buku Paket Aktivitas Belajar Mengaji Cepat ALBARQY untuk anak. Melatih kreativitas, mewarnai, dan motorik hijaiyah.",
      keywords: [
        "buku aktivitas albarqy",
        "mewarnai hijaiyah",
        "buku mengaji anak",
      ],
    },
  },

  // 4. Paket Poster ALBARQY
  "paket-poster-albarqy": {
    slug: "paket-poster-albarqy",
    subtitle:
      "Set 12 Lembar Poster Peraga Dinding Klasikal Rumus Bunyi Hijaiyah Al-Barqy Ukuran Besar",
    badge: "📜 Set 12 Poster Edukasi Lengkap",
    rating: 4.9,
    reviewCount: 1420,
    originalPrice: 210000,
    savings: 50000,
    author: "KH. Muhadjir Sulthon",
    publisher: "Penerbit Pena Ameen",
    weight: "600 gram",
    dimensions: "50 cm x 70 cm (Ukuran Poster)",
    language: "Arab & Indonesia",
    targetAge: "Semua Usia & Ruang Kelas TPQ/Rumah",
    isbn: "978-602-8920-22-0",
    boxContents: [
      {
        icon: "📜",
        name: "12 Poster Art Paper Tebal Full Color",
        description:
          "Meliputi bagan A-DA-RA-JA, MA-HA-KA-YA, tanda baca baris, huruf sambung, dan tajwid.",
      },
      {
        icon: "📦",
        name: "Tabung Kemasan Poster Eksklusif",
        description:
          "Menjaga poster tidak terlipat atau lecek selama proses ekspedisi.",
      },
    ],
    keyBenefits: [
      {
        title: "Membangun Ekosistem Literasi di Rumah",
        description:
          "Menempel poster di kamar memudahkan anak mengingat huruf secara subliminal setiap hari.",
      },
      {
        title: "Kertas Art Paper Tebal Laminasi",
        description: "Permukaan mengkilap, tahan debu, dan mudah dibersihkan.",
      },
    ],
    learningSteps: [
      {
        step: "Minggu 1",
        title: "Poster 1-3: Huruf Tunggal Utama",
        description:
          "Fokus pada pengucapan bunyi makhraj A-DA-RA-JA dan MA-HA-KA-YA.",
      },
      {
        step: "Minggu 2",
        title: "Poster 4-8: Huruf Sambung & Vokal",
        description:
          "Melatih anak melihat perubahan bentuk huruf di awal, tengah, dan akhir.",
      },
    ],
    faqs: [
      {
        question: "Bagaimana cara menempelnya?",
        answer:
          "Poster dapat ditempel menggunakan double tape busa atau dipasang dalam bingkai pajangan dinding.",
      },
    ],
    seo: {
      title: "Jual Set 12 Poster Edukasi ALBARQY | Penerbit Pena Ameen",
      description:
        "Set 12 Poster Edukasi Klasikal ALBARQY lengkap. Bagan peraga dinding belajar cepat membaca Al-Qur'an anti lupa.",
      keywords: [
        "poster albarqy",
        "poster edukasi hijaiyah",
        "poster dinding mengaji",
      ],
    },
  },

  // 5. Paket ALBARQY 1
  "paket-albarqy-1": {
    slug: "paket-albarqy-1",
    subtitle:
      "Buku Modul Dasar Belajar Cepat Membaca Al-Qur'an Jilid 1: Pengenalan Huruf & Asosiasi Bunyi Kata",
    badge: "📖 Buku Dasar Jilid 1",
    rating: 4.9,
    reviewCount: 2100,
    originalPrice: 115000,
    savings: 30000,
    author: "KH. Muhadjir Sulthon",
    publisher: "Penerbit Pena Ameen",
    weight: "250 gram",
    dimensions: "24 cm x 16 cm x 1 cm",
    language: "Arab & Indonesia",
    targetAge: "Anak-anak & Pemula Dewasa",
    isbn: "978-602-8920-01-5",
    boxContents: [
      {
        icon: "📘",
        name: "Buku Utama Al-Barqy Jilid 1",
        description:
          "Fokus pada penguasaan 28 huruf tunggal melalui rumus bunyi kata anti-lupa.",
      },
    ],
    keyBenefits: [
      {
        title: "Metode Asosiasi Bunyi yang Revolusioner",
        description:
          "Anak dapat menguasai huruf hijaiyah dalam waktu hitungan jam tanpa rasa terbebani.",
      },
      {
        title: "Layout Halaman Bersih & Huruf Tajam",
        description:
          "Font khat naskh standar internasional dengan harakat yang sangat jelas.",
      },
    ],
    learningSteps: [
      {
        step: "Pelajaran 1-4",
        title: "Mengenal Kata Kunci A-DA-RA-JA",
        description: "Pondasi utama pengenalan bunyi huruf pertama.",
      },
      {
        step: "Pelajaran 5-8",
        title: "Mengenal Kata Kunci MA-HA-KA-YA",
        description: "Melengkapi penguasaan bunyi dasar hijaiyah.",
      },
    ],
    faqs: [
      {
        question: "Apakah bisa dipelajari tanpa guru?",
        answer:
          "Sangat bisa karena dilengkapi petunjuk aplikatif di setiap halaman.",
      },
    ],
    seo: {
      title: "Jual Buku Metode ALBARQY Jilid 1 | Penerbit Pena Ameen",
      description:
        "Beli Buku Metode ALBARQY Jilid 1 resmi Penerbit Pena Ameen. Modul dasar pengenalan huruf hijaiyah anti-lupa.",
      keywords: ["albarqy jilid 1", "buku albarqy 1", "belajar hijaiyah dasar"],
    },
  },

  // 6. Paket ALBARQY 2
  "paket-albarqy-2": {
    slug: "paket-albarqy-2",
    subtitle:
      "Buku Modul Lanjutan Belajar Cepat Membaca Al-Qur'an Jilid 2: Huruf Sambung & Tanda Baca Panjang",
    badge: "📖 Buku Lanjutan Jilid 2",
    rating: 4.9,
    reviewCount: 1950,
    originalPrice: 140000,
    savings: 35000,
    author: "KH. Muhadjir Sulthon",
    publisher: "Penerbit Pena Ameen",
    weight: "250 gram",
    dimensions: "24 cm x 16 cm x 1 cm",
    language: "Arab & Indonesia",
    targetAge: "Lulusan Jilid 1 / Pemula",
    isbn: "978-602-8920-02-2",
    boxContents: [
      {
        icon: "📘",
        name: "Buku Utama Al-Barqy Jilid 2",
        description:
          "Fokus pada kaidah huruf sambung, mad thobi'i (panjang), dan tanda sukun.",
      },
    ],
    keyBenefits: [
      {
        title: "Transisi Mulus ke Huruf Sambung",
        description:
          "Anak tidak bingung mengenali perubahan bentuk huruf di awal, tengah, dan akhir kata.",
      },
    ],
    learningSteps: [
      {
        step: "Bagian 1",
        title: "Huruf Sambung 2-3 Huruf",
        description: "Latihan membaca kata bersambung sederhana.",
      },
      {
        step: "Bagian 2",
        title: "Bacaan Panjang (Mad)",
        description: "Membedakan ketukan 1 alif (2 harakat) dengan presisi.",
      },
    ],
    faqs: [
      {
        question: "Berapa lama rata-rata menuntaskan Jilid 2?",
        answer:
          "Rata-rata santri menyelesaikan Jilid 2 dalam waktu 1 hingga 2 pekan pendampingan rutin.",
      },
    ],
    seo: {
      title: "Jual Buku Metode ALBARQY Jilid 2 | Penerbit Pena Ameen",
      description:
        "Beli Buku Metode ALBARQY Jilid 2 resmi Penerbit Pena Ameen. Belajar membaca huruf sambung Al-Qur'an lancar dan tepat.",
      keywords: ["albarqy jilid 2", "buku albarqy 2", "huruf sambung alquran"],
    },
  },

  // 7. Paket ALBARQY 3
  "paket-albarqy-3": {
    slug: "paket-albarqy-3",
    subtitle:
      "Buku Modul Mahir Belajar Cepat Membaca Al-Qur'an Jilid 3: Kaidah Tajwid Praktis, Waqaf, & Juz 'Amma",
    badge: "📖 Buku Mahir Tajwid Jilid 3",
    rating: 4.9,
    reviewCount: 1680,
    originalPrice: 420000,
    savings: 65000,
    author: "KH. Muhadjir Sulthon",
    publisher: "Penerbit Pena Ameen",
    weight: "400 gram",
    dimensions: "24 cm x 16 cm x 1.5 cm",
    language: "Arab & Indonesia",
    targetAge: "Lulusan Jilid 2 / Pembaca Al-Qur'an",
    isbn: "978-602-8920-03-9",
    boxContents: [
      {
        icon: "📘",
        name: "Buku Utama Al-Barqy Jilid 3 Tajwid",
        description:
          "Panduan lengkap tajwid terapan (Ghunnah, Idgham, Ikhfa, Qalqalah) dan tanda waqaf.",
      },
    ],
    keyBenefits: [
      {
        title: "Tajwid Aplikatif Tanpa Istilah Rumit",
        description:
          "Hukum bacaan dijelaskan dengan kode warna dan contoh ayat Al-Qur'an nyata.",
      },
    ],
    learningSteps: [
      {
        step: "Pekan 1",
        title: "Hukum Nun Sukun & Tanwin",
        description: "Praktik membaca dengung dan jelas pada ayat pilihan.",
      },
      {
        step: "Pekan 2",
        title: "Hukum Mim Sukun & Qalqalah",
        description: "Memantapkan artikulasi pantulan dan dengungan murni.",
      },
    ],
    faqs: [
      {
        question: "Apakah setelah jilid 3 langsung bisa baca Al-Qur'an besar?",
        answer:
          "Ya, setelah Jilid 3 santri siap membaca Al-Qur'an 30 Juz secara mandiri dan tartil.",
      },
    ],
    seo: {
      title: "Jual Buku Metode ALBARQY Jilid 3 Tajwid | Penerbit Pena Ameen",
      description:
        "Beli Buku ALBARQY Jilid 3 Tajwid Lengkap resmi Penerbit Pena Ameen. Penguasaan tajwid praktis dan waqaf Al-Qur'an.",
      keywords: ["albarqy jilid 3", "tajwid albarqy", "buku tajwid praktis"],
    },
  },

  // 8. Paket ALBARQY 200 Menit
  "paket-albarqy-200-menit": {
    slug: "paket-albarqy-200-menit",
    subtitle:
      "Panduan Cepat Membaca Al-Qur'an Sistematis untuk Remaja, Dewasa, Mualaf & Lansia",
    badge: "⚡ Best Seller Kursus Cepat",
    rating: 4.9,
    reviewCount: 2410,
    originalPrice: 320000,
    savings: 70000,
    author: "KH. Muhadjir Sulthon",
    publisher: "Penerbit Pena Ameen",
    weight: "500 gram",
    dimensions: "24 cm x 17 cm x 2 cm",
    language: "Arab & Indonesia",
    targetAge: "Remaja (SMP/SMA), Mahasiswa, Dewasa, & Lansia",
    isbn: "978-602-8920-08-4",
    boxContents: [
      {
        icon: "📖",
        name: "Buku Panduan Utama Al-Barqy 200 Menit",
        description:
          "Modul kompilasi cepat yang merangkum kaidah membaca Al-Qur'an dalam 8 bab terstruktur.",
      },
      {
        icon: "📝",
        name: "Lembar Evaluasi Mandiri & Tajwid Praktis",
        description:
          "Tabel uji mandiri untuk mengukur kelancaran membaca secara bertahap.",
      },
    ],
    keyBenefits: [
      {
        title: "Tuntas dalam Waktu 200 Menit",
        description:
          "Metode akselerasi yang dirancang untuk orang sibuk yang ingin lancar membaca Al-Qur'an tanpa berlama-lama.",
      },
      {
        title: "Struktur Materi Logis & Mudah Dipahami",
        description:
          "Menggunakan pendekatan struktur kata yang tidak membebani hafalan rumus tajwid rumit.",
      },
    ],
    learningSteps: [
      {
        step: "Sesi 1-2",
        title: "Pengenalan Huruf Tunggal & Bunyi (50 Menit)",
        description:
          "Menguasai 28 huruf melalui rumus kata kunci bunyi Al-Barqy.",
      },
      {
        step: "Sesi 3-4",
        title: "Huruf Sambung & Baris Panjang (50 Menit)",
        description:
          "Membaca kata bersambung 2 hingga 4 suku kata dengan makhraj tepat.",
      },
      {
        step: "Sesi 5-6",
        title: "Kaidah Tajwid Dasar (50 Menit)",
        description:
          "Memahami dengung, sukun, tasydid, dan mad secara aplikatif.",
      },
      {
        step: "Sesi 7-8",
        title: "Kelancaran Membaca Al-Qur'an (50 Menit)",
        description:
          "Praktik langsung membaca surat-surat dalam Al-Qur'an secara mandiri.",
      },
    ],
    faqs: [
      {
        question:
          "Apakah orang dewasa yang belum pernah mengaji bisa langsung paham?",
        answer:
          "Bisa! Modul ini dirancang dengan bahasa yang logis, lugas, dan sistematis sehingga sangat mudah dipahami oleh pembelajar dewasa.",
      },
    ],
    seo: {
      title:
        "Jual Paket ALBARQY 200 Menit Belajar Cepat Mengaji | Penerbit Pena Ameen",
      description:
        "Buku Paket ALBARQY 200 Menit metode cepat belajar membaca Al-Qur'an anti lupa untuk remaja & dewasa. Resmi Penerbit Pena Ameen.",
      keywords: [
        "albarqy 200 menit",
        "belajar ngaji dewasa cepat",
        "metode albarqy dewasa",
      ],
    },
  },

  // 9. Alat Peraga ALBARQY (APE)
  "alat-peraga-albarqy": {
    slug: "alat-peraga-albarqy",
    subtitle:
      "Kit Alat Peraga Edukatif Klasikal Guru untuk Pengajaran Massal di Kelas TPQ, Pesantren, & Sekolah",
    badge: "🏫 Kit Pengajar & Lembaga TPQ",
    rating: 4.9,
    reviewCount: 880,
    originalPrice: 320000,
    savings: 70000,
    author: "Tim Ahli Metodologi Pena Ameen",
    publisher: "Penerbit Pena Ameen",
    weight: "1.200 gram",
    dimensions: "60 cm x 40 cm x 5 cm",
    language: "Arab & Indonesia",
    targetAge: "Guru TPQ, Ustadz/Ustadzah, & Kepala Sekolah",
    isbn: "978-602-8920-25-1",
    boxContents: [
      {
        icon: "📜",
        name: "Bagan Peraga Flipchart Guru Ukuran Besar",
        description:
          "Bagan demonstrasi klasikal dengan huruf berukuran besar terbaca dari jarak 10 meter.",
      },
      {
        icon: "🥢",
        name: "Tongkat Penunjuk Peraga Kayu Halus",
        description: "Alat penunjuk fokus bacaan santri di papan peraga.",
      },
      {
        icon: "📘",
        name: "Buku Manual Instruksi Guru TPQ",
        description:
          "Panduan teknis memandu kelas agar aktif, serentak, dan kondusif.",
      },
    ],
    keyBenefits: [
      {
        title: "Meningkatkan Efektivitas Kelas Hingga 3x Lipat",
        description:
          "Seluruh santri dalam satu ruangan belajar secara serempak tanpa saling menunggu giliran.",
      },
    ],
    learningSteps: [
      {
        step: "Tahap Kelas",
        title: "Demonstrasi Klasikal Guru",
        description:
          "Guru menunjuk bagan peraga sambil melafalkan bunyi makhraj murni.",
      },
    ],
    faqs: [
      {
        question: "Apakah ada pelatihan untuk guru yang membeli paket ini?",
        answer:
          "Ya, kami menyediakan layanan konsultasi dan webinar sertifikasi guru Al-Barqy.",
      },
    ],
    seo: {
      title:
        "Jual Alat Peraga Mengaji ALBARQY untuk Guru TPQ | Penerbit Pena Ameen",
      description:
        "Beli Alat Peraga Edukatif (APE) ALBARQY resmi Penerbit Pena Ameen untuk kelas TPQ dan sekolah. Meningkatkan efektivitas pengajaran Qur'an.",
      keywords: [
        "alat peraga albarqy",
        "alat peraga tpq",
        "media belajar mengaji guru",
      ],
    },
  },

  // 10. Paket Home Learning ACM
  "paket-home-learning-acm": {
    slug: "paket-home-learning-acm",
    subtitle:
      "Box Set Pembelajaran Cepat Belajar Membaca Huruf Latin untuk Anak Usia Dini (PAUD/TK/SD)",
    badge: "🌟 Paket Box Set Lengkap ACM",
    rating: 4.9,
    reviewCount: 2650,
    originalPrice: 950000,
    savings: 155000,
    author: "Tim Litbang ACM Pena Ameen",
    publisher: "Penerbit Pena Ameen",
    weight: "1.500 gram",
    dimensions: "30 cm x 23 cm x 5 cm",
    language: "Bahasa Indonesia",
    targetAge: "Anak Usia 3 - 7 Tahun (PAUD/TK)",
    isbn: "978-602-8920-30-5",
    boxContents: [
      {
        icon: "📚",
        name: "Seri Buku ACM Jilid 1, 2, 3, 4 Lengkap",
        description:
          "Kurikulum membaca bertahap dari suku kata terbuka hingga kalimat bertingkat.",
      },
      {
        icon: "🗂️",
        name: "Kartu Kata Bergambar Interaktif",
        description:
          "Kartu tebal untuk permainan tebak kata dan pengenalan kosakata baru.",
      },
      {
        icon: "⭐",
        name: "Stiker Prestasi & Piagam Kelulusan",
        description:
          "Apresiasi motivasi belajar anak saat menuntaskan setiap jilid.",
      },
    ],
    keyBenefits: [
      {
        title: "Metode Aku Cepat Membaca (ACM)",
        description:
          "Mengajarkan membaca tanpa mengeja (B-A = BA), anak langsung membaca suku kata utuh secara alami.",
      },
      {
        title: "Ilustrasi Penuh Warna & Cerita Karakter",
        description:
          "Setiap halaman dirancang hidup dengan karakter binatang dan dongeng edukatif.",
      },
    ],
    learningSteps: [
      {
        step: "Jilid 1",
        title: "Suku Kata Terbuka (BA-CA-DA-GA)",
        description: "Mengenal vokal A, I, U, E, O dengan pola berirama.",
      },
      {
        step: "Jilid 2-4",
        title: "Konsonan Mati & Kalimat Lengkap",
        description:
          "Membaca kata bersuku kata ganda dan cerita pendek mandiri.",
      },
    ],
    faqs: [
      {
        question: "Apakah anak usia 4 tahun bisa mengikuti?",
        answer:
          "Bisa! Metode ACM menggunakan pendekatan visual kata tanpa beban rumus ejaan rumit.",
      },
    ],
    seo: {
      title:
        "Jual Paket Home Learning ACM Cepat Membaca Anak | Penerbit Pena Ameen",
      description:
        "Beli Paket Home Learning ACM (Aku Cepat Membaca) lengkap. Metode belajar membaca anak usia dini tanpa mengeja resmi Penerbit Pena Ameen.",
      keywords: ["paket acm", "aku cepat membaca", "belajar membaca paud tk"],
    },
  },

  // 11. Paket Buku ACM 2
  "paket-cepat-belajar-membaca-anak-acm-2": {
    slug: "paket-cepat-belajar-membaca-anak-acm-2",
    subtitle:
      "Buku Cepat Belajar Membaca Anak Seri ACM Jilid 2: Penguasaan Suku Kata Terbuka & Kombinasi Vokal",
    badge: "📘 Modul Membaca Jilid 2",
    rating: 4.8,
    reviewCount: 1100,
    originalPrice: 120000,
    savings: 30000,
    author: "Tim Litbang ACM",
    publisher: "Penerbit Pena Ameen",
    weight: "200 gram",
    dimensions: "24 cm x 16 cm x 0.8 cm",
    language: "Bahasa Indonesia",
    targetAge: "Usia 4 - 7 Tahun",
    isbn: "978-602-8920-32-9",
    boxContents: [
      {
        icon: "📖",
        name: "Buku Modul ACM Jilid 2",
        description:
          "Latihan membaca kata kombinasi vokal terbuka dan kalimat 2 kata.",
      },
    ],
    keyBenefits: [
      {
        title: "Metode Asosiasi Irama Kata",
        description:
          "Anak mengingat pola kata melalui ritme berima yang menyenangkan.",
      },
    ],
    learningSteps: [
      {
        step: "Pekan 1",
        title: "Kombinasi Vokal I, U, E, O",
        description: "Menghubungkan konsonan dengan seluruh variasi vokal.",
      },
    ],
    faqs: [
      {
        question: "Apakah perlu menyelesaikan Jilid 1 dahulu?",
        answer:
          "Disarankan anak sudah mengenal bunyi dasar vokal dari Jilid 1.",
      },
    ],
    seo: {
      title: "Jual Buku Cepat Belajar Membaca Anak ACM 2 | Penerbit Pena Ameen",
      description:
        "Beli Buku Cepat Belajar Membaca Anak ACM Jilid 2 resmi Penerbit Pena Ameen. Belajar membaca lancar tanpa mengeja.",
      keywords: ["acm 2", "buku acm jilid 2", "belajar membaca tk"],
    },
  },

  // 12. Paket Buku ACM 3
  "paket-buku-metode-belajar-membaca-acm-3": {
    slug: "paket-buku-metode-belajar-membaca-acm-3",
    subtitle:
      "Buku Metode Belajar Membaca Seri ACM Jilid 3: Penguasaan Suku Kata Tertutup & Konsonan Mati",
    badge: "📘 Modul Membaca Jilid 3",
    rating: 4.8,
    reviewCount: 980,
    originalPrice: 210000,
    savings: 44000,
    author: "Tim Litbang ACM",
    publisher: "Penerbit Pena Ameen",
    weight: "220 gram",
    dimensions: "24 cm x 16 cm x 0.8 cm",
    language: "Bahasa Indonesia",
    targetAge: "Usia 5 - 8 Tahun",
    isbn: "978-602-8920-33-6",
    boxContents: [
      {
        icon: "📖",
        name: "Buku Modul ACM Jilid 3",
        description:
          "Fokus pada konsonan mati (K, M, N, S, T, R, L, P) di akhir kata.",
      },
    ],
    keyBenefits: [
      {
        title: "Mengatasi Kesulitan Membaca Akhiran Mati",
        description:
          "Metode khusus agar anak tidak keliru melafalkan huruf mati di ujung suku kata.",
      },
    ],
    learningSteps: [
      {
        step: "Langkah 1",
        title: "Konsonan Mati N dan NG",
        description: "Latihan membaca kata seperti MA-KAN, BU-RUNG.",
      },
    ],
    faqs: [
      {
        question: "Bagaimana jika anak sering menambahkan huruf sendiri?",
        answer:
          "Modul Jilid 3 menyediakan latihan kata pembanding untuk menstabilkan fokus anak.",
      },
    ],
    seo: {
      title: "Jual Buku Belajar Membaca ACM 3 | Penerbit Pena Ameen",
      description:
        "Beli Buku Belajar Membaca ACM Jilid 3 konsonan mati resmi Penerbit Pena Ameen.",
      keywords: ["acm 3", "buku acm 3", "konsonan mati membaca"],
    },
  },

  // 13. Paket Buku ACM 4
  "paket-buku-cepat-belajar-membaca-anak-acm-4": {
    slug: "paket-buku-cepat-belajar-membaca-anak-acm-4",
    subtitle:
      "Bundel Lengkap Buku Cepat Belajar Membaca Anak ACM Seri 1–4 Plus Cerita Pendek Edukatif",
    badge: "📚 Bundel Seri ACM 1–4",
    rating: 4.9,
    reviewCount: 1540,
    originalPrice: 450000,
    savings: 94000,
    author: "Tim Litbang ACM",
    publisher: "Penerbit Pena Ameen",
    weight: "750 gram",
    dimensions: "24 cm x 16 cm x 3 cm",
    language: "Bahasa Indonesia",
    targetAge: "Usia 4 - 8 Tahun",
    isbn: "978-602-8920-34-3",
    boxContents: [
      {
        icon: "📚",
        name: "Paket 4 Buku ACM (Jilid 1, 2, 3, 4)",
        description:
          "Paket komplit mengantar anak dari nol sampai lancar membaca buku cerita tebal.",
      },
    ],
    keyBenefits: [
      {
        title: "Hemat & Komprehensif",
        description:
          "Solusi lengkap tanpa perlu membeli buku per jilid secara terpisah.",
      },
    ],
    learningSteps: [
      {
        step: "Tahapan",
        title: "Kurikulum Tuntas Jilid 1-4",
        description:
          "Meliputi vokal, huruf sambung latin, diftong, konsonan ganda (NY, SY, KH).",
      },
    ],
    faqs: [
      {
        question: "Apakah ada kunci jawaban/panduan orang tua?",
        answer:
          "Di setiap jilid terdapat petunjuk cara mendampingi anak secara ringkas dan praktis.",
      },
    ],
    seo: {
      title: "Jual Bundel Buku Belajar Membaca ACM 4 | Penerbit Pena Ameen",
      description:
        "Beli Bundel Buku Cepat Belajar Membaca Anak ACM 4 Jilid Lengkap resmi Penerbit Pena Ameen.",
      keywords: ["bundel acm", "buku acm lengkap 1-4", "paket cepat membaca"],
    },
  },

  // 14. Cinta (tak) Selamanya Indah
  "cinta-tak-selamanya-indah": {
    slug: "cinta-tak-selamanya-indah",
    subtitle:
      "Kajian Filosofis, Psikologis, & Sosiologis Mengenai Hakikat Relasi Kasih Sayang Manusia",
    badge: "📖 Buku Humaniora & Psikologi",
    rating: 4.8,
    reviewCount: 420,
    originalPrice: 75000,
    savings: 25000,
    author: "Penulis Akademik Pena Ameen",
    publisher: "Penerbit Pena Ameen",
    weight: "280 gram",
    dimensions: "20 cm x 14 cm x 1.2 cm",
    language: "Bahasa Indonesia",
    targetAge: "Dewasa, Mahasiswa, & Umum",
    isbn: "978-602-8920-41-1",
    boxContents: [
      {
        icon: "📖",
        name: "Buku Cetak Softcover Eksklusif (210 Halaman)",
        description:
          "Dicetak pada kertas Bookpaper premium yang nyaman dan ramah di mata.",
      },
    ],
    keyBenefits: [
      {
        title: "Perspektif Multidisiplin yang Mendalam",
        description:
          "Membongkar mitos romansa populer dengan tinjauan filsafat etika dan psikologi emosi.",
      },
    ],
    learningSteps: [
      {
        step: "Bab 1-3",
        title: "Filsafat & Dinamika Emosi",
        description:
          "Memahami akar rasa memiliki dan ekspektasi dalam relasi sosial.",
      },
    ],
    faqs: [
      {
        question: "Apakah buku ini cocok untuk bahan referensi skripsi?",
        answer:
          "Sangat cocok untuk rujukan kajian sosiologi keluarga, psikologi relasi, dan filsafat etika.",
      },
    ],
    seo: {
      title: "Jual Buku Cinta (tak) Selamanya Indah | Penerbit Pena Ameen",
      description:
        "Beli Buku Cinta (tak) Selamanya Indah resmi Penerbit Pena Ameen. Tinjauan filosofis, psikologis, dan sosiologis relasi manusia.",
      keywords: [
        "buku cinta tak selamanya indah",
        "filsafat cinta",
        "buku psikologi relasi",
      ],
    },
  },

  // 15. Menambang Teks Al-Quran
  "menambang-teks-al-quran": {
    slug: "menambang-teks-al-quran",
    subtitle:
      "Upaya Memaknai Al-Qur'an dengan Pendekatan Tekstual Berbasis Teknologi Informasi & Text Mining",
    badge: "🔬 Monograf Sains & Studi Al-Qur'an",
    rating: 4.9,
    reviewCount: 310,
    originalPrice: 150000,
    savings: 150000,
    author: "Dr. Peneliti Sains Qur'an",
    publisher: "Penerbit Pena Ameen",
    weight: "450 gram",
    dimensions: "23 cm x 15 cm x 1.8 cm",
    language: "Bahasa Indonesia & Arab",
    targetAge: "Dosen, Peneliti, Mahasiswa Ilmu Al-Qur'an & Informatika",
    isbn: "978-602-8920-45-9",
    boxContents: [
      {
        icon: "📘",
        name: "Buku Monograf Akademik (320 Halaman)",
        description:
          "Lengkap dengan diagram algoritma text mining, ontologi ayat, dan klasterisasi tematik Al-Qur'an.",
      },
    ],
    keyBenefits: [
      {
        title: "Konvergensi Studi Islam & Ilmu Komputer",
        description:
          "Menyajikan metodologi mutakhir penambangan data tekstual Al-Qur'an untuk riset digital humanities.",
      },
    ],
    learningSteps: [
      {
        step: "Modul Riset",
        title: "Metodologi Text Mining Qur'ani",
        description:
          "Penerapan Natural Language Processing (NLP) bahasa Arab Al-Qur'an.",
      },
    ],
    faqs: [
      {
        question: "Apakah buku ini dapat diakses secara gratis?",
        answer:
          "Edisi cetak bersubsidi dan e-book riset ini disediakan untuk pengembangan ilmu pengetahuan digital Al-Qur'an.",
      },
    ],
    seo: {
      title:
        "Jual Buku Menambang Teks Al-Quran Berbasis TI | Penerbit Pena Ameen",
      description:
        "Buku Menambang Teks Al-Quran: Pendekatan Tekstual Berbasis Teknologi Informasi. Karya akademik resmi Penerbit Pena Ameen.",
      keywords: [
        "menambang teks alquran",
        "nlp alquran",
        "text mining studi islam",
      ],
    },
  },

  // 16. Perspektif Hermeneutika Sosiologi Hukum
  "perspektif-hermeneutika-sosiologi-hukum": {
    slug: "perspektif-hermeneutika-sosiologi-hukum",
    subtitle:
      "Memahami Hukum sebagai Fenomena Sosial melalui Pendekatan Hermeneutik Kritis",
    badge: "⚖️ Buku Teks Akademik Hukum",
    rating: 4.8,
    reviewCount: 260,
    originalPrice: 125000,
    savings: 30000,
    author: "Pakar Sosiologi Hukum",
    publisher: "Penerbit Pena Ameen",
    weight: "380 gram",
    dimensions: "23 cm x 15 cm x 1.5 cm",
    language: "Bahasa Indonesia",
    targetAge: "Mahasiswa Hukum, Hakim, Pengacara, & Akademisi",
    isbn: "978-602-8920-48-0",
    boxContents: [
      {
        icon: "⚖️",
        name: "Buku Monograf Sosiologi Hukum",
        description:
          "Kajian komprehensif penafsiran teks undang-undang dalam konteks realitas sosial masyarakat.",
      },
    ],
    keyBenefits: [
      {
        title: "Rujukan Utama Mata Kuliah Sosiologi Hukum",
        description:
          "Menjelaskan dialektika antara norma positif dan kebiasaan hukum masyarakat secara kritis.",
      },
    ],
    learningSteps: [
      {
        step: "Kajian 1-4",
        title: "Teori Hermeneutika Hukum",
        description:
          "Eksplorasi pemikiran Gadamer, Ricoeur, dan Habermas dalam yurisprudensi.",
      },
    ],
    faqs: [
      {
        question: "Apakah buku ini memuat studi kasus Indonesia?",
        answer:
          "Ya, dilengkapi analisis kasus putusan pengadilan dan sengketa adat kontemporer di Indonesia.",
      },
    ],
    seo: {
      title:
        "Jual Buku Perspektif Hermeneutika Sosiologi Hukum | Penerbit Pena Ameen",
      description:
        "Buku Perspektif Hermeneutika dalam Sosiologi Hukum: Memahami Hukum sebagai Fenomena Sosial. Resmi Penerbit Pena Ameen.",
      keywords: [
        "hermeneutika hukum",
        "sosiologi hukum",
        "buku hukum akademis",
      ],
    },
  },

  // 17. Beton Mutu Tinggi Ramah Lingkungan
  "beton-mutu-tinggi-ramah-lingkungan": {
    slug: "beton-mutu-tinggi-ramah-lingkungan",
    subtitle:
      "Inovasi Material Konstruksi Hijau, Kinerja Kekuatan, Durabilitas, & Nilai Ekonomis",
    badge: "🏗️ Monograf Teknik Sipil Seri 4",
    rating: 4.9,
    reviewCount: 380,
    originalPrice: 240000,
    savings: 55000,
    author: "Tim Pakar Teknik Material Sipil",
    publisher: "Penerbit Pena Ameen",
    weight: "520 gram",
    dimensions: "24 cm x 17 cm x 2 cm",
    language: "Bahasa Indonesia",
    targetAge: "Insinyur Sipil, Kontraktor, Dosen, & Praktisi Konstruksi",
    isbn: "978-602-8920-52-7",
    boxContents: [
      {
        icon: "🏗️",
        name: "Buku Monograf Teknik Sipil (Hardbound Look)",
        description:
          "Memuat uji laboratorium kekuatan tekan beton, campuran pozzolan, dan analisis siklus hidup (LCA).",
      },
    ],
    keyBenefits: [
      {
        title: "Panduan Praktis Formulasi Green Concrete",
        description:
          "Solusi meningkatkan mutu beton sekaligus mereduksi jejak karbon industri konstruksi.",
      },
    ],
    learningSteps: [
      {
        step: "Bab Utama",
        title: "Proporsi Campuran & Pengujian Kuat Tekan",
        description:
          "Standar ASTM dan SNI untuk beton struktural ramah lingkungan.",
      },
    ],
    faqs: [
      {
        question: "Apakah menyertakan tabel standar mix design?",
        answer:
          "Ya, disertakan tabel perbandingan campuran dan grafik kuat tekan umur 7, 14, 28 hari.",
      },
    ],
    seo: {
      title:
        "Jual Buku Beton Mutu Tinggi Ramah Lingkungan | Penerbit Pena Ameen",
      description:
        "Buku Beton Mutu Tinggi Ramah Lingkungan Seri Ke-4 Teknik Sipil resmi Penerbit Pena Ameen. Inovasi material konstruksi hijau.",
      keywords: ["beton mutu tinggi", "green concrete", "buku teknik sipil"],
    },
  },

  // 18. Model Pengaturan Layanan Publik
  "model-pengaturan-layanan-publik": {
    slug: "model-pengaturan-layanan-publik",
    subtitle:
      "Penguatan Tata Kelola Birokrasi Berbasis Zona Integritas & Standar Internasional ISO 37001:2016",
    badge: "🏛️ Panduan Kebijakan Publik & Reformasi",
    rating: 4.8,
    reviewCount: 310,
    originalPrice: 140000,
    savings: 40000,
    author: "Tim Peneliti Kebijakan Publik",
    publisher: "Penerbit Pena Ameen",
    weight: "340 gram",
    dimensions: "23 cm x 15 cm x 1.2 cm",
    language: "Bahasa Indonesia",
    targetAge: "Aparatur Sipil Negara, Birokrat, Inspektorat, & Akademisi",
    isbn: "978-602-8920-55-8",
    boxContents: [
      {
        icon: "🏛️",
        name: "Buku Panduan Tata Kelola Layanan Publik",
        description:
          "Pedoman implementasi Sistem Manajemen Anti Penyuapan (SMAP) dan Zona Integritas WBK/WBBM.",
      },
    ],
    keyBenefits: [
      {
        title: "Kerangka Kerja Aplikatif untuk Instansi Pemerintah",
        description:
          "Mempercepat reformasi birokrasi dan peningkatan indeks kepuasan masyarakat.",
      },
    ],
    learningSteps: [
      {
        step: "Langkah Reformasi",
        title: "Penyusunan SOP & Audit Anti-Penyuapan",
        description:
          "Integrasi standar ISO 37001 ke dalam alur kerja birokrasi harian.",
      },
    ],
    faqs: [
      {
        question: "Dapatkah buku ini dijadikan pedoman penilaian WBK?",
        answer:
          "Buku ini dirancang selaras dengan instrumen evaluasi Kementerian PANRB untuk Zona Integritas.",
      },
    ],
    seo: {
      title:
        "Jual Buku Model Pengaturan Layanan Publik ISO 37001 | Penerbit Pena Ameen",
      description:
        "Buku Model Pengaturan Layanan Publik Berbasis Zona Integritas dan Standar Internasional ISO 37001:2016. Resmi Penerbit Pena Ameen.",
      keywords: ["layanan publik", "zona integritas wbk", "iso 37001 smap"],
    },
  },

  // 19. Book Chapter Transforming Values
  "book-chapter-transforming-values": {
    slug: "book-chapter-transforming-values",
    subtitle:
      "Transforming the Values of Education and Religion toward a Civilized Society (International Anthology)",
    badge: "🌐 International Book Chapter Anthology",
    rating: 4.9,
    reviewCount: 290,
    originalPrice: 200000,
    savings: 200000,
    author: "International Scholars & Editors",
    publisher: "Penerbit Pena Ameen",
    weight: "480 gram",
    dimensions: "24 cm x 17 cm x 1.8 cm",
    language: "English & Indonesian",
    targetAge: "International Researchers, Lecturers, & Postgraduate Students",
    isbn: "978-602-8920-60-2",
    boxContents: [
      {
        icon: "🌐",
        name: "Anthology Book Chapter (Peer-Reviewed Volume)",
        description:
          "Compiles international research on Islamic education transformation, interfaith harmony, and civil society.",
      },
    ],
    keyBenefits: [
      {
        title: "Peer-Reviewed Scholarly Contributions",
        description:
          "Features interdisciplinary papers from prominent international educational institutions.",
      },
    ],
    learningSteps: [
      {
        step: "Theme 1-5",
        title: "Modern Islamic Pedagogy & Ethical Society",
        description:
          "Harmonizing Islamic religious values with progressive socio-cultural modernization.",
      },
    ],
    faqs: [
      {
        question:
          "Is this book indexed in international academic repositories?",
        answer:
          "Yes, published with international standard ISBN and catalogued for higher education reference.",
      },
    ],
    seo: {
      title:
        "Book Chapter: Transforming Values of Education and Religion | Pena Ameen",
      description:
        "Book Chapter: Transforming the Values of Education and Religion toward a Civilized Society. Published by Penerbit Pena Ameen.",
      keywords: [
        "transforming values education",
        "islamic civilized society",
        "international book chapter",
      ],
    },
  },
};

export function getProductRichDetail(slug: string): ProductRichDetail | null {
  return productRichDetailsMap[slug] ?? null;
}
