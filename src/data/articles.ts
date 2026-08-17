// src/data/articles.ts
export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // In a real app, this would be rich text or markdown.
  date: string; // ISO date string
  category: string;
  image: string;
  readTime: number; // in minutes
}

export const articles: Article[] = [
  {
    id: "1",
    slug: "belajar-cepat-mengaji-untuk-anak",
    title: "Belajar Cepat Mengaji Untuk Anak, Apakah Bisa ?",
    excerpt:
      "Artikel ini membahas tentang efektivitas metode belajar cepat mengaji untuk anak dan bagaimana orang tua dapat mendukung proses belajarnya.",
    content:
      "Ini adalah konten artikel lengkap tentang belajar cepat mengaji untuk anak...",
    date: "2026-01-12",
    category: "Tips Belajar",
    image: "/images/penaameen/editorial/anak-belajar-mengaji.jpg",
    readTime: 5,
  },
  {
    id: "2",
    slug: "metode-albarqy-anti-lupa",
    title: "AL BARQY Metode Anti Lupa",
    excerpt:
      "Artikel ini menjelaskan keunikan metode Al-Barqy yang dikenal sebagai metode anti lupa dalam belajar membaca Al-Qur'an.",
    content:
      "Ini adalah konten artikel lengkap tentang metode Al-Barqy anti lupa...",
    date: "2026-01-10",
    category: "Metode Membaca",
    image: "/images/penaameen/methods/logoantilupa.png",
    readTime: 6,
  },
  {
    id: "3",
    slug: "keunggulan-metode-acm",
    title: "Keunggulan Metode ACM",
    excerpt:
      "Artikel ini membahas keunggulan metode ACM dalam proses belajar membaca untuk anak usia dini.",
    content:
      "Ini adalah konten artikel lengkap tentang keunggulan metode ACM...",
    date: "2026-01-08",
    category: "Untuk Guru",
    image: "/images/penaameen/methods/albarqy.png",
    readTime: 4,
  },
  // Add more articles as needed
];

export const getArticlesByCategory = (category: string) => {
  return articles.filter(
    (article) => article.category.toLowerCase() === category.toLowerCase(),
  );
};

export const getArticleBySlug = (slug: string) => {
  return articles.find((article) => article.slug === slug);
};
