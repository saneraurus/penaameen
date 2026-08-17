// src/data/methods.ts
export interface Method {
  id: string;
  slug: string;
  name: string;
  description: string;
  benefits: string[];
  suitableFor: string;
  image: string;
  // We can add more fields as needed.
}

export const methods: Method[] = [
  {
    id: "1",
    slug: "acm",
    name: "ACM (Aku Cepat Membaca)",
    description:
      "Metode pembelajaran membaca aktif dengan materi terstruktur dan pendekatan bermain sambil belajar yang sesuai untuk anak usia dini.",
    benefits: [
      "Belajar menyenangkan",
      "Mengembangkan kreativitas",
      "Meningkatkan konsentrasi",
      "Sesuai untuk anak usia 3-8 tahun",
    ],
    suitableFor: "Anak usia 3-8 tahun",
    image: "/images/penaameen/methods/method-acm.jpg",
  },
  {
    id: "2",
    slug: "al-barqy",
    name: "AL-BARQY",
    description:
      "Metode cepat untuk membaca Al-Qur'an yang mudah dipahami dan dilengkapi dengan media pembelajaran interaktif.",
    benefits: [
      "Cepat dan mudah dipahami",
      "Dilengkapi dengan media interaktif",
      "Meningkatkan hafalan",
      "Cocok untuk anak dan dewasa",
    ],
    suitableFor: "Anak dan dewasa",
    image: "/images/penaameen/methods/method-albarqy.jpg",
  },
];

export const getMethodBySlug = (slug: string) => {
  return methods.find((method) => method.slug === slug);
};
