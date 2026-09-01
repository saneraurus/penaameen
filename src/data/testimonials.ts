// src/data/testimonials.ts

export interface Testimonial {
  id: string;
  slug: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  date: string;
  productUsed: string;
  category: "all" | "orangtua" | "guru" | "anak" | "dewasa";
  title: string;
  content: string;
  highlight: string;
  verifiedBuyer: boolean;
  image?: string;
  label: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    slug: "testimoni-ibu-siti-nurjanah",
    name: "Ibu Siti Nurjanah",
    role: "Bunda dari Rayhan usia 5 tahun",
    location: "Surabaya, Jawa Timur",
    avatar: "/images/penaameen/testimonials/avatar-ibu-siti.jpg",
    rating: 5,
    date: "12 Februari 2026",
    productUsed: "Paket Home Learning Al Barqy",
    category: "orangtua",
    title: "Dua minggu belajar anak sudah hafal huruf hijaiyah",
    content:
      "Alhamdulillah Rayhan cepat paham pola hurufnya. Bukunya gampang dipelajari bareng di rumah tanpa anak rewel atau merasa terbebani.",
    highlight: "Lancar Mengaji Dua Pekan",
    verifiedBuyer: true,
    label: "Testimoni Ibu Siti Surabaya",
  },
  {
    id: "2",
    slug: "testimoni-ustadz-ahmad-fauzi",
    name: "Ustadz Ahmad Fauzi",
    role: "Pengajar TPQ dan Pembina Santri",
    location: "Bandung, Jawa Barat",
    avatar: "/images/penaameen/testimonials/avatar-ustadz-fauzi.jpg",
    rating: 5,
    date: "28 Januari 2026",
    productUsed: "Paket Klasikal dan Alat Peraga Guru TPQ",
    category: "guru",
    title: "Alat peraga dan posternya sangat membantu di kelas TPQ",
    content:
      "Sangat praktis untuk bimbing santri baru. Santri yang awalnya kesulitan kenal makhraj huruf sekarang belajarnya jauh lebih cepat.",
    highlight: "Dipakai Puluhan Santri TPQ",
    verifiedBuyer: true,
    label: "Testimoni Ustadz Fauzi Bandung",
  },
  {
    id: "3",
    slug: "testimoni-bapak-hendra-pratama",
    name: "Bapak Hendra Pratama",
    role: "Ayah dari Keenan usia 4 tahun",
    location: "Jakarta Timur, DKI Jakarta",
    avatar: "/images/penaameen/testimonials/avatar-pak-hendra.jpg",
    rating: 5,
    date: "18 Januari 2026",
    productUsed: "Paket Flashcard dan Buku Aktivitas ACM",
    category: "anak",
    title: "Cukup lima belas menit tiap malam sepulang kantor",
    content:
      "Metode baca tanpa mengeja ini bikin anak gak gampang bosen. Keenan anggap belajarnya kayak main tebak tebakan kartu santai.",
    highlight: "Lima Belas Menit Sehari",
    verifiedBuyer: true,
    label: "Testimoni Pak Hendra Jakarta",
  },
  {
    id: "4",
    slug: "testimoni-ibu-dewi-anggraeni",
    name: "Ibu Dewi Anggraeni",
    role: "Bunda dari Naura",
    location: "Sleman, D.I. Yogyakarta",
    avatar: "/images/penaameen/testimonials/avatar-ibu-dewi.jpg",
    rating: 5,
    date: "5 Januari 2026",
    productUsed: "Paket Pintar Membaca dan Menulis Ceria",
    category: "orangtua",
    title: "Persiapan masuk SD jadi lancar dan menyenangkan",
    content:
      "Modul belajarnya interaktif banget buat melatih motorik dan baca. Naura jadi percaya diri pas tes masuk sekolah kemarin.",
    highlight: "Persiapan Masuk SD",
    verifiedBuyer: true,
    label: "Testimoni Ibu Dewi Yogyakarta",
  },
  {
    id: "5",
    slug: "testimoni-ustadzah-anisa-fitri",
    name: "Ustadzah Anisa Fitri",
    role: "Pengajar Quran dan TPQ",
    location: "Malang, Jawa Timur",
    avatar: "/images/penaameen/testimonials/avatar-ustadzah-anisa.jpg",
    rating: 5,
    date: "22 Desember 2025",
    productUsed: "Paket Al Barqy 200 Menit dan Juz Amma",
    category: "dewasa",
    title: "Metode Al Barqy beneran anti lupa dan mudah dipahami",
    content:
      "Rumus kata kuncinya nempel terus di ingatan. Selain buat anak anak, metode ini juga enak banget buat ngajarin orang dewasa.",
    highlight: "Mudah untuk Semua Usia",
    verifiedBuyer: true,
    label: "Testimoni Ustadzah Anisa Malang",
  },
  {
    id: "6",
    slug: "testimoni-ibu-maya-kartika",
    name: "Ibu Maya Kartika",
    role: "Bunda dari Alif usia 3 tahun",
    location: "Semarang, Jawa Tengah",
    avatar: "/images/penaameen/testimonials/avatar-ibu-maya.jpg",
    rating: 5,
    date: "14 Desember 2025",
    productUsed: "Flashcard Hijaiyah Ceria dan Poster Edukasi",
    category: "anak",
    title: "Flashcard tebal dan sudutnya membulat aman buat balita",
    content:
      "Kualitas kertas dan warnanya bagus banget. Alif suka minta diajak main kartu hijaiyah setiap pagi bareng bundanya.",
    highlight: "Material Aman untuk Balita",
    verifiedBuyer: true,
    label: "Testimoni Ibu Maya Semarang",
  },
];

export const getTestimonialBySlug = (slug: string) => {
  return testimonials.find((testimonial) => testimonial.slug === slug);
};
