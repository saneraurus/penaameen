// src/data/methods.ts
// Official source of truth: Litbang Penerbit Pena Ameen & akucepatmembaca.com

export interface MethodStep {
  step: string;
  title: string;
  description: string;
  examples?: string;
}

export interface MethodAdvantage {
  icon: string;
  title: string;
  description: string;
}

export interface MethodFaq {
  question: string;
  answer: string;
}

export interface Method {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  officialReference: string;
  officialDomain: string;
  description: string;
  philosophy: string;
  suitableFor: string;
  image: string;
  targetDuration: string;
  composition: {
    reading: string;
    writing: string;
    concept: string;
  };
  keyStats: Array<{
    label: string;
    value: string;
    detail: string;
  }>;
  advantages: MethodAdvantage[];
  steps: MethodStep[];
  comparison: {
    conventional: string[];
    acm: string[];
  };
  benefits: string[];
  faqs: MethodFaq[];
  relatedProductSlugs: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const methods: Method[] = [
  {
    id: "1",
    slug: "acm",
    name: "ACM (Aku Cepat Membaca)",
    tagline:
      "Revolusi Belajar Membaca Anak Usia Dini: Mudah, Cepat, Menyenangkan, & Anti Lupa Tanpa Mengeja",
    officialReference:
      "Dikembangkan oleh Litbang Penerbit Pena Ameen & Portal Resmi AkuCepatMembaca.com",
    officialDomain: "https://akucepatmembaca.com",
    description:
      "Metode ACM (Aku Cepat Membaca) adalah terobosan metode pembelajaran baca-tulis permulaan yang dirancang khusus agar peserta didik mampu membaca secara cepat dan lancar tanpa mengeja (tanpa B-A = BA) dan tanpa menghafal abjad A-Z di awal. Menggabungkan konsep bermain sambil belajar, lagu edukatif, dan teknik penguncian memori 'Anti Lupa', metode ini sangat efektif untuk anak usia dini (PAUD/TK/SD), anak berkebutuhan khusus (ABK/Dyslexia), hingga orang dewasa penyandang buta aksara.",
    philosophy:
      "Mengapa mengeja konvensional sering membebani anak? Karena memaksa otak anak usia dini memproses dua beban sekaligus: mengingat nama simbol huruf abstrak dan merakit bunyi bunyian suku kata. Metode ACM membalik paradigma tersebut: anak dikenalkan langsung pada 'Kata Lembaga' bermakna yang dekat dengan kehidupannya melalui asosiasi visual dan lagu riang. Pengenalan abjad (A-Z) baru diberikan di tahap akhir setelah anak sudah mahir membaca.",
    suitableFor:
      "Anak Usia Dini (PAUD, TK A/B, SD Kelas 1), Anak Berkebutuhan Khusus (ABK/Dyslexia), dan Orang Dewasa Buta Aksara",
    image: "/images/penaameen/methods/method-acm.jpg",
    targetDuration: "Rata-rata 16–24 Kali Pertemuan (15–20 Menit/Hari)",
    composition: {
      reading: "70% Membaca Aktif (Visual, Auditori, & Permainan Lagu)",
      writing: "30% Menulis & Motorik Halus (Kinestetik & Tracing Garis)",
      concept: "Bermain Sambil Belajar Tanpa Beban & Tanpa Paksaan",
    },
    keyStats: [
      {
        label: "Target Ketuntasan",
        value: "16-24 Sesi",
        detail: "Rata-rata anak lancar membaca",
      },
      {
        label: "Metode Asosiasi",
        value: "100% Tanpa Mengeja",
        detail: "Tanpa B-A = BA / Tanpa Ejaan",
      },
      {
        label: "Komposisi Belajar",
        value: "70% : 30%",
        detail: "70% Membaca & 30% Menulis",
      },
      {
        label: "Dipercaya Lembaga",
        value: "500+ Sekolah",
        detail: "PAUD, TK, SD & Program CSR Pemda",
      },
    ],
    advantages: [
      {
        icon: "🚫",
        title: "Tanpa Mengeja (Non-Spelling Method)",
        description:
          "Anak langsung membaca suku kata dan kata utuh secara spontan tanpa harus mengeja satu per satu huruf yang sering membingungkan otak anak.",
      },
      {
        icon: "🔤",
        title: "Tanpa Menghafal Abjad di Awal",
        description:
          "Mengeliminasi stres menghafal 26 huruf simbol A–Z di awal pembelajaran. Nama-nama abjad baru diajarkan di akhir sebagai penguatan.",
      },
      {
        icon: "🧠",
        title: "Teknik Penguncian Memori 'Anti Lupa'",
        description:
          "Menggunakan formula asosiasi bunyi fonetik bahasa Indonesia yang alami sehingga materi yang dipelajari melekat kuat di memori jangka panjang.",
      },
      {
        icon: "🎵",
        title: "Konsep Bermain Sambil Belajar & Lagu Edukatif",
        description:
          "Didukung lagu-lagu berima ceria, kartu permainan interaktif, dan alat peraga visual yang menjaga keceriaan dan rasa percaya diri anak.",
      },
      {
        icon: "⚡",
        title: "Sangat Cepat, Ringkas, & Efisien",
        description:
          "Materi disajikan tanpa jilid yang berbelit-belit. Cukup 15–20 menit sehari secara konsisten untuk mencapai ketuntasan membaca mandiri.",
      },
      {
        icon: "🎯",
        title: "Multi Sasaran & Ramah Anak Berkebutuhan Khusus",
        description:
          "Telah terbukti efektif membantu anak dengan kesulitan belajar membaca (Speech Delay / Dyslexia) serta program literasi orang dewasa.",
      },
    ],
    steps: [
      {
        step: "Tahap 1",
        title: "Pengenalan Kata Lembaga (Kata Kunci Bermakna)",
        description:
          "Anak dikenalkan pada kata-kata konkret bergambar yang sangat akrab di dunia anak (misal: BOLA, MATA, SAPU, DUKU, TOPI) melalui lagu dan gambar cerita.",
        examples: "BO-LA, MA-TA, SA-PU, KA-KI",
      },
      {
        step: "Tahap 2",
        title: "Variasi Bunyi Vokal Terbuka (a, i, u, e, o)",
        description:
          "Mengeksplorasi perubahan vokal secara berirama dan berima (BA-BI-BU-BE-BO, CA-CI-CU-CE-CO) tanpa mengeja, melainkan dengan ritme lagu yang menyenangkan.",
        examples: "BA-BI-BU-BE-BO, DA-DI-DU-DE-DO",
      },
      {
        step: "Tahap 3",
        title: "Penggabungan & Membaca Kata Baru",
        description:
          "Anak langsung dilatih merangkai kombinasi suku kata menjadi kata-kata baru dan kalimat pendek 2–3 kata secara mandiri dan cepat.",
        examples: "BU-DI BA-CA BU-KU, I-BU BE-LI RO-TI",
      },
      {
        step: "Tahap 4",
        title: "Bunyi Transfer (Konsonan Mati / Huruf Terkunci)",
        description:
          "Menguasai huruf konsonan mati di akhir kata (K, M, N, S, T, R, L, P, serta bunyi sengau NG dan NY) dengan teknik analogi bunyi yang sangat mudah dicerna.",
        examples: "MA-KAN, PIN-TU, BU-RUNG, TANG-GA",
      },
      {
        step: "Tahap 5",
        title: "Membaca Cerita Bertingkat & Dongeng Bergambar",
        description:
          "Anak mulai membaca paragraf cerita pendek, melatih intonasi bacaan, pemahaman makna kalimat, serta membangun kegemaran membaca buku sejak dini.",
        examples: "Cerita Edukatif Kancil, Petualangan Si Belang",
      },
      {
        step: "Tahap 6",
        title: "Pengenalan Nama Huruf Abjad (A–Z)",
        description:
          "Di tahap akhir, anak dikenalkan pada nama-nama abjad formal (A, B, C, D...) untuk melengkapi kesiapan literasi resmi memasuki bangku Sekolah Dasar.",
        examples: "A, B, C, D sampai Z secara alfabetis",
      },
    ],
    comparison: {
      conventional: [
        "Menghafal 26 abjad abstrak A–Z sejak hari pertama",
        "Mengeja huruf terpisah (B-A dibaca BA, C-A dibaca CA)",
        "Sering memicu kejenuhan, stres, dan trauma belajar membaca",
        "Waktu belajar relatif lama (berbulan-bulan bahkan bertahun-tahun)",
        "Sering lupa saat bertemu kata panjang atau huruf mati di akhir",
      ],
      acm: [
        "Memulai dari Kata Lembaga konkret bergambar yang dipahami anak",
        "Langsung membaca suku kata utuh tanpa proses mengeja",
        "Menyenangkan dengan lagu edukatif & konsep bermain sambil belajar",
        "Cepat & terukur, tuntas rata-rata dalam 16–24 pertemuan",
        "Formula Anti Lupa berbasis asosiasi fonem bahasa Indonesia alami",
      ],
    },
    benefits: [
      "Anak mampu membaca lancar tanpa beban stres atau paksaan",
      "Meningkatkan rasa percaya diri dan antusiasme belajar mandiri",
      "Melatih koordinasi motorik halus melalui komposisi 30% menulis terarah",
      "Sangat praktis didampingi oleh orang tua di rumah maupun guru di kelas",
      "Teruji secara akademis dalam puluhan skripsi, tesis, dan jurnal riset literasi",
    ],
    faqs: [
      {
        question:
          "Apakah anak usia 3,5 – 4 tahun bisa langsung mengikuti metode ACM?",
        answer:
          "Sangat bisa! Metode ACM dirancang dengan pendekatan visual bergambar dan lagu anak ceria sehingga balita dan anak usia dini dapat menyerap materi membaca dengan rasa gembira layaknya sedang bermain.",
      },
      {
        question:
          "Mengapa metode ACM tidak mengajarkan menghafal abjad A-Z di awal?",
        answer:
          "Menghafal 26 simbol abjad di awal adalah beban kognitif abstrak yang berat bagi anak usia dini. Di metode ACM, anak diajarkan membaca kata bermakna terlebih dahulu agar cepat bisa membaca. Nama abjad (A-Z) baru diperkenalkan di akhir saat anak sudah percaya diri dan lancar membaca.",
      },
      {
        question:
          "Bagaimana jika anak sudah terlanjur belajar mengeja di tempat lain dan merasa bingung?",
        answer:
          "Metode ACM sangat efektif sebagai terapi membaca bagi anak yang mengalami hambatan mengeja. Dengan mengalihkan fokus ke pola suku kata berima dan lagu ACM, kebiasaan mengeja yang lambat akan berangsur hilang dan berganti menjadi membaca lancar.",
      },
      {
        question:
          "Apakah metode ACM bisa diterapkan untuk anak berkebutuhan khusus (ABK / Dyslexia / Speech Delay)?",
        answer:
          "Ya. Metode ACM telah banyak digunakan oleh para terapis wicara dan pendidik inklusi karena pendekatan fonetik visualnya yang konkret sangat membantu anak dengan tantangan konsentrasi maupun disleksia.",
      },
      {
        question:
          "Berapa lama waktu pendampingan harian yang disarankan untuk orang tua?",
        answer:
          "Cukup 15 sampai 20 menit per sesi, 1 kali sehari. Konsistensi waktu belajar yang singkat jauh lebih efektif untuk retensi memori anak dibanding belajar berjam-jam yang melelahkan.",
      },
    ],
    relatedProductSlugs: [
      "paket-home-learning-acm",
      "paket-cepat-belajar-membaca-anak-acm-2",
      "paket-buku-metode-belajar-membaca-acm-3",
      "paket-buku-cepat-belajar-membaca-anak-acm-4",
    ],
    seo: {
      title:
        "Metode ACM (Aku Cepat Membaca) - Belajar Membaca Anak Tanpa Mengeja | Pena Ameen",
      description:
        "Pelajari Metode ACM (Aku Cepat Membaca) resmi Penerbit Pena Ameen & akucepatmembaca.com. Metode revolusioner belajar membaca anak PAUD/TK tanpa mengeja, anti-lupa, dan menyenangkan dalam 16-24 pertemuan.",
      keywords: [
        "metode acm",
        "aku cepat membaca",
        "belajar membaca anak tanpa mengeja",
        "akucepatmembaca com",
        "metode membaca paud tk",
        "penerbit pena ameen acm",
        "terapi membaca anak disleksia",
      ],
    },
  },
  {
    id: "2",
    slug: "al-barqy",
    name: "AL-BARQY (Metode 200 Menit Anti Lupa)",
    tagline:
      "Metode Cepat Membaca Al-Qur'an 200 Menit Anti Lupa Karya KH. Muhadjir Sulthon",
    officialReference:
      "Karya Legendaris KH. Muhadjir Sulthon Sejak 1965 • Diterbitkan oleh Penerbit Pena Ameen",
    officialDomain: "https://penaameen.com/metode/al-barqy",
    description:
      "Metode Al-Barqy adalah metode pembelajaran membaca Al-Qur'an tercepat dan paling sistematis di Indonesia. Ditemukan oleh KH. Muhadjir Sulthon pada tahun 1965, metode ini mengusung formula kata kunci fonetik 'Anti Lupa' (A-DA-RA-JA, MA-HA-KA-YA) yang mampu mengantarkan pembelajar dari nol hingga mahir membaca Al-Qur'an dalam total durasi belajar 200 menit.",
    philosophy:
      "Al-Barqy berarti 'Kilat'. Metode ini memanfaatkan prinsip asosiasi bunyi kata alami bahasa Indonesia yang telah diakrabi oleh lidah pembelajar. Tanpa perlu mengeja harakat dan huruf satu per satu secara rumit, santri diajak mengenali pola nada dan struktur huruf bersambung secara intuitif dan permanen.",
    suitableFor:
      "Anak-anak (Mulai Usia 4 Tahun), Remaja, Mahasiswa, Pemula Dewasa, Mualaf, hingga Lansia",
    image: "/images/penaameen/methods/method-albarqy.jpg",
    targetDuration: "Total Waktu Belajar 200 Menit (8 Sesi @ 25 Menit)",
    composition: {
      reading: "80% Praktik Membaca & Artikulasi Makharijul Huruf",
      writing: "20% Latihan Menulis Rasm Utsmani",
      concept: "Sistem Asosiasi Bunyi Kata Kunci Fonetik Cepat & Tartil",
    },
    keyStats: [
      {
        label: "Target Waktu",
        value: "200 Menit",
        detail: "Total durasi belajar dari nol",
      },
      {
        label: "Formula Kunci",
        value: "Anti Lupa",
        detail: "Asosiasi bunyi A-DA-RA-JA",
      },
      {
        label: "Jangkauan",
        value: "30+ Tahun",
        detail: "Dipakai di Indonesia & Malaysia",
      },
      {
        label: "Alumni Santri",
        value: "1.000.000+",
        detail: "Santri, mualaf, dan pembelajar",
      },
    ],
    advantages: [
      {
        icon: "⚡",
        title: "Sistem Kilat 200 Menit Teruji",
        description:
          "Membagi seluruh kurikulum membaca Al-Qur'an ke dalam 8 bab terstruktur yang tuntas dalam 200 menit.",
      },
      {
        icon: "🧠",
        title: "Rumus Kata Kunci Bunyi 'Anti Lupa'",
        description:
          "Mengelompokkan 28 huruf hijaiyah ke dalam rumus kata bermakna (A-DA-RA-JA, MA-HA-KA-YA, dsb).",
      },
      {
        icon: "📖",
        title: "Tajwid Aplikatif & Praktis",
        description:
          "Hukum bacaan panjang, dengung, sukun, dan waqaf diajarkan langsung pada ayat Al-Qur'an tanpa rumus rumit.",
      },
      {
        icon: "👨‍👩‍👧",
        title: "Cocok untuk Belajar Mandiri di Rumah",
        description:
          "Dapat dipelajari secara mandiri dengan bimbingan modul orang tua atau kit klasikal TPQ.",
      },
    ],
    steps: [
      {
        step: "Sesi 1-2",
        title: "Pengenalan Huruf Tunggal (A-DA-RA-JA, MA-HA-KA-YA)",
        description:
          "Menguasai 28 huruf hijaiyah melalui rumus kata kunci fonetik.",
      },
      {
        step: "Sesi 3-4",
        title: "Huruf Sambung & Baris Panjang (Mad)",
        description:
          "Membaca kata bersambung 2 hingga 4 huruf dengan ritme mad tepat.",
      },
      {
        step: "Sesi 5-6",
        title: "Tanda Baca Sukun, Tasydid, & Tanwin",
        description:
          "Memantapkan artikulasi konsonan mati dan dengung (Ghunnah).",
      },
      {
        step: "Sesi 7-8",
        title: "Tajwid Lengkap & Praktik Membaca Al-Qur'an",
        description:
          "Langsung lancar membaca ayat-ayat Al-Qur'an secara tartil.",
      },
    ],
    comparison: {
      conventional: [
        "Menghafal huruf acak satu per satu secara terpisah",
        "Mengeja huruf dan baris panjang secara bertele-tele",
        "Butuh waktu 6 bulan hingga 2 tahun untuk mengenal tajwid",
        "Sering lupa bentuk huruf yang mirip-mirip",
      ],
      acm: [
        "Mengelompokkan huruf ke dalam rumus kata berima A-DA-RA-JA",
        "Langsung membaca bunyi kata utuh tanpa mengeja",
        "Tuntas dalam total durasi 200 menit belajar terstruktur",
        "Formula Anti Lupa mengunci memori jangka panjang",
      ],
    },
    benefits: [
      "Mampu membaca Al-Qur'an secara tartil dan percaya diri dalam waktu singkat",
      "Menguasai hukum tajwid praktis tanpa dibebani hafalan definisi rumit",
      "Sangat fleksibel untuk segala rentang usia dari balita hingga lansia",
      "Telah teruji selama lebih dari 30 tahun di ribuan TPQ dan institusi pendidikan",
    ],
    faqs: [
      {
        question:
          "Apakah benar-benar bisa lancar membaca Al-Qur'an hanya dalam 200 menit?",
        answer:
          "Ya! 200 menit adalah total akumulasi waktu belajar efektif (misalnya dibagi menjadi 8 sesi x 25 menit) dengan mengikuti modul Al-Barqy secara disiplin.",
      },
      {
        question:
          "Apakah orang dewasa atau lansia yang belum pernah belajar mengaji bisa ikut?",
        answer:
          "Sangat bisa. Al-Barqy adalah salah satu metode terfavorit untuk program bimbingan membaca Al-Qur'an bagi mualaf, mahasiswa, dan orang dewasa karena penyampaian materinya yang sangat logis dan sistematis.",
      },
    ],
    relatedProductSlugs: [
      "paket-home-learning-albarqy",
      "paket-albarqy-200-menit",
      "paket-flashcard-albarqy",
      "paket-poster-albarqy",
    ],
    seo: {
      title:
        "Metode AL-BARQY (Belajar Cepat Membaca Al-Qur'an 200 Menit Anti Lupa) | Pena Ameen",
      description:
        "Pelajari Metode AL-BARQY resmi Penerbit Pena Ameen. Metode legendaris KH. Muhadjir Sulthon untuk belajar membaca Al-Qur'an cepat 200 menit anti-lupa untuk anak, remaja, dan dewasa.",
      keywords: [
        "metode albarqy",
        "albarqy 200 menit",
        "belajar membaca alquran cepat",
        "metode albarqy anti lupa",
        "penerbit pena ameen albarqy",
        "kh muhadjir sulthon",
      ],
    },
  },
];

export const getMethodBySlug = (slug: string) => {
  return methods.find((method) => method.slug === slug);
};
