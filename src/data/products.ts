// src/data/products.ts
// Source of truth: OLD WEBSITE FILES WordPress export
// (wc-product-export CSV + WXR XML). 19 published simple products.
export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price: number; // in IDR
  salePrice?: number;
  image: string;
}

export const products: Product[] = [
  // --- Al-Barqy learning packages ---
  {
    id: "2",
    slug: "paket-flashcard-albarqy",
    name: "Paket FlashCard ALBARQY",
    category: "Al-Barqy",
    description:
      "Paket Flashcard ALBARQY memudahkan anak-anak untuk belajar mengaji dan mengerti lebih jelas tentang huruf hijaiyah.",
    price: 378000,
    image: "/images/penaameen/products/flashcard.jpg",
  },
  {
    id: "3",
    slug: "paket-aktivitas-albarqy",
    name: "Paket Aktivitas ALBARQY",
    category: "Al-Barqy",
    description:
      "Paket Aktivitas Belajar Cepat Mengaji Al-Barqy ini melatih kreativitas si kecil sambil belajar.",
    price: 103000,
    image: "/images/penaameen/products/aktivitas.jpg",
  },
  {
    id: "4",
    slug: "paket-poster-albarqy",
    name: "Paket Poster ALBARQY",
    category: "Al-Barqy",
    description:
      "Paket Poster Belajar Cepat Mengaji Al-Barqy ini melatih kreativitas si kecil sambil belajar dan bisa ditempel di dinding.",
    price: 160000,
    image: "/images/penaameen/products/poster.jpg",
  },
  {
    id: "7",
    slug: "paket-albarqy-3",
    name: "Paket ALBARQY 3",
    category: "Al-Barqy",
    description:
      "Paket AlBARQY 3, belajar mengaji menjadi cepat, anti lupa dan menyenangkan cocok untuk pengajaran di rumah.",
    price: 355000,
    image: "/images/penaameen/products/albarqy3.jpg",
  },
  {
    id: "8",
    slug: "paket-albarqy-200-menit",
    name: "Paket ALBARQY 200 Menit",
    category: "Al-Barqy",
    description:
      "Paket ALBARQY 200 Menit sangat efektif untuk siswa SMP sampai dengan dewasa yang ingin belajar mengaji.",
    price: 250000,
    image: "/images/penaameen/products/albarqy200-menit.jpg",
  },
  {
    id: "9",
    slug: "paket-albarqy-2",
    name: "Paket ALBARQY 2",
    category: "Al-Barqy",
    description:
      "Paket AlBARQY 2, belajar mengaji menjadi cepat, anti lupa dan menyenangkan cocok untuk pengajaran di rumah.",
    price: 105000,
    image: "/images/penaameen/products/paket-2.jpg",
  },
  {
    id: "10",
    slug: "paket-albarqy-1",
    name: "Paket ALBARQY 1",
    category: "Al-Barqy",
    description:
      "Paket AlBARQY 1, belajar mengaji menjadi cepat, anti lupa dan menyenangkan cocok untuk pengajaran di rumah.",
    price: 85000,
    image: "/images/penaameen/products/paket-1.jpg",
  },
  {
    id: "12",
    slug: "alat-peraga-albarqy",
    name: "Alat Peraga Cepat Belajar Membaca Al Quran/Mengaji ALBARQY",
    category: "Al-Barqy",
    description:
      "Alat peraga ALBARQY, belajar mengaji menjadi cepat, anti lupa dan menyenangkan untuk anak didik dan putra-putri tercinta.",
    price: 250000,
    image: "/images/penaameen/products/ape-abq.jpg",
  },
  // --- ACM learning packages ---
  {
    id: "5",
    slug: "paket-buku-metode-belajar-membaca-acm-3",
    name: "Paket Buku Metode Belajar Membaca ACM 3",
    category: "ACM",
    description:
      "Paket ACM 3, belajar membaca menjadi cepat, anti lupa dan menyenangkan cocok untuk pengajaran di rumah.",
    price: 166000,
    image: "/images/penaameen/products/paket-3.jpg",
  },
  {
    id: "6",
    slug: "paket-cepat-belajar-membaca-anak-acm-2",
    name: "Paket Buku Cepat Belajar Membaca Anak ACM 2",
    category: "ACM",
    description:
      "Paket ACM 2, belajar membaca menjadi cepat, anti lupa dan menyenangkan cocok untuk pengajaran di rumah.",
    price: 90000,
    image: "/images/penaameen/products/paket-2-acm.jpg",
  },
  {
    id: "11",
    slug: "paket-home-learning-acm",
    name: "Paket Home Learning Buku Belajar Cepat Membaca ACM",
    category: "ACM",
    description:
      "Seri pembelajaran lengkap metode ACM untuk di rumah dan sekolah, memudahkan anak untuk belajar membaca.",
    price: 795000,
    image: "/images/penaameen/products/home-learning-acm.jpg",
  },
  {
    id: "13",
    slug: "paket-buku-cepat-belajar-membaca-anak-acm-4",
    name: "Paket Buku Cepat Belajar Membaca Anak ACM 4",
    category: "ACM",
    description:
      "Paket ACM 4, belajar membaca menjadi cepat, anti lupa dan menyenangkan cocok untuk pengajaran di rumah.",
    price: 356000,
    image: "/images/penaameen/products/paket-4.jpg",
  },
  // --- Buku / Umum ---
  {
    id: "14",
    slug: "cinta-tak-selamanya-indah",
    name: "Cinta (tak) Selamanya Indah",
    category: "Umum",
    description:
      "Buku yang menawarkan pandangan luas dan mendalam tentang cinta dengan berbagai perspektif filosofis, psikologis, sosiologis, dan antropologis.",
    price: 50000,
    image: "/images/penaameen/products/Buku-Cinta-1.jpeg",
  },
  {
    id: "15",
    slug: "menambang-teks-al-quran",
    name: "Menambang Teks Al-Quran: Upaya memaknai Al-Quran dengan pendekatan tekstual berbasis teknologi informasi",
    category: "Umum",
    description:
      "Buku yang membahas bagaimana teknologi informasi dapat membantu memahami teks Al-Quran dengan pendekatan tekstual berbasis teknologi informasi.",
    price: 0,
    image: "/images/penaameen/products/Menambang-Teks-Al-Quran.jpg",
  },
  {
    id: "16",
    slug: "perspektif-hermeneutika-sosiologi-hukum",
    name: "Perspektif Hermeneutika dalam Sosiologi Hukum : Memahami Hukum sebagai Fenomena Sosial",
    category: "Umum",
    description:
      "Membahas penggunaan pendekatan hermeneutik dalam kajian sosiologi hukum. Cocok bagi mahasiswa, peneliti, dan praktisi hukum.",
    price: 95000,
    image: "/images/penaameen/products/Hermeneutika-1.jpg",
  },
  {
    id: "17",
    slug: "beton-mutu-tinggi-ramah-lingkungan",
    name: "BETON MUTU TINGGI RAMAH LINGKUNGAN",
    category: "Umum",
    description:
      "Seri buku beton ke-4 yang mempersembahkan pengetahuan material terbaik dan sinerginya dalam kinerja kekuatan, keawetan, dan nilai ekonomis.",
    price: 185000,
    image: "/images/penaameen/products/Untitled-design-1-1.png",
  },
  {
    id: "18",
    slug: "model-pengaturan-layanan-publik",
    name: "Model Pengaturan Layanan Publik Berbasis Zona Integritas dan Standar Internasional",
    category: "Umum",
    description:
      "Menyajikan hasil kajian layanan publik berbasis Zona Integritas dan Standar Internasional (ISO 37001:2016).",
    price: 100000,
    image:
      "/images/penaameen/products/Minimalist-Free-Guide-Lead-Magnet-Mockup-Instagram-Post.png",
  },
  {
    id: "19",
    slug: "book-chapter-transforming-values",
    name: "Book Chapter “Transforming the Values of Education and Religion toward a Civilized Society”",
    category: "Umum",
    description:
      "Book chapter tentang transformasi nilai pendidikan dan agama menuju masyarakat beradab yang mengharmonisasi nilai Islam ke dalam kehidupan sosial.",
    price: 0,
    image: "/images/penaameen/products/COVER-IC-ISLEH-web.jpg",
  },
  {
    id: "20",
    slug: "mengenal-tindak-pidana-ekonomi-karakter-dan-bentuk-bentuk-tindak-pidana-ekonomi",
    name: "Mengenal Tindak Pidana Ekonomi: Karakter dan Bentuk-bentuk Tindak Pidana Ekonomi",
    category: "Universitas",
    description:
      "Buku referensi mahasiswa tentang tindak pidana ekonomi, white collar crime, tindak pidana korporasi, perbankan, pencucian uang, perpajakan, pasar modal, mayantara, korupsi, dan lingkungan hidup.",
    price: 150000,
    image: "https://penaameen.com/wp-content/uploads/2024/08/Cover-Web.png",
  },
  {
    id: "21",
    slug: "pengantar-ilmu-hukum",
    name: "PENGANTAR ILMU HUKUM",
    category: "Hukum",
    description:
      "Buku pengantar hukum pidana yang membahas konsep dasar perbuatan pidana, pertanggungjawaban pidana, pemidanaan, concursus, deelneming, kausalitas, peraturan, dan contoh kasus.",
    price: 150000,
    salePrice: 90000,
    image:
      "https://penaameen.com/wp-content/uploads/2025/08/Pengantar-Ilmu-Hukum.jpeg",
  },
  {
    id: "22",
    slug: "pengantar-teknologi-beton-prategang",
    name: "PENGANTAR TEKNOLOGI BETON PRATEGANG",
    category: "Teknik Sipil",
    description:
      "Buku referensi tentang prinsip dasar dan aplikasi beton prategang dalam konstruksi untuk mahasiswa, insinyur, dan praktisi teknik sipil.",
    price: 150000,
    salePrice: 90000,
    image:
      "https://penaameen.com/wp-content/uploads/2025/08/Pengantar-Teknologi-Beton-Prategang.jpeg",
  },
];

export const getProductsByCategory = (category: string) => {
  return products.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase(),
  );
};

export const getProductBySlug = (slug: string) => {
  return products.find((product) => product.slug === slug);
};
