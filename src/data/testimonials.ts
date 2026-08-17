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
  image: string;
  label: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    slug: "testimoni-ibu-siti-nurjanah",
    name: "Ibu Siti Nurjanah",
    role: "Bunda dari Rayhan (5 tahun)",
    location: "Surabaya, Jawa Timur",
    avatar: "/images/penaameen/testimonials/avatar-ibu-siti.jpg",
    rating: 5,
    date: "12 Februari 2026",
    productUsed: "Paket Home Learning Al-Barqy",
    category: "orangtua",
    title: "Anak 5 tahun langsung lancar baca hijaiyah dalam 2 minggu tanpa drama!",
    content:
      "Awalnya Rayhan sering malas kalau diajak belajar mengaji konvensional karena cepat bosan dan bingung menghafal huruf yang mirip-mirip. Begitu coba metode Al-Barqy lewat Paket Home Learning dari PENA AMEEN, masyaAllah langsung antusias! Kartu dan bukunya sangat interaktif. Dalam 14 hari sudah hafal pola huruf dan sekarang sudah masuk juz amma. Pendampingan di rumah jadi sangat tenang dan menyenangkan.",
    highlight: "Lancar Mengaji dlm 14 Hari",
    verifiedBuyer: true,
    image: "/images/penaameen/testimonials/ss-nur-1.png",
    label: "Testimoni Ibu Siti - Home Learning",
  },
  {
    id: "2",
    slug: "testimoni-ustadzah-anisa-fitri",
    name: "Ustadzah dr. Anisa Fitri, S.Pd.I",
    role: "Kepala TPQ & Pengajar Qur'an",
    location: "Bandung, Jawa Barat",
    avatar: "/images/penaameen/testimonials/avatar-ustadzah-anisa.jpg",
    rating: 5,
    date: "28 Januari 2026",
    productUsed: "Paket Klasikal & Alat Peraga Guru TPQ",
    category: "guru",
    title: "Metode Al-Barqy 200 Menit sangat membantu ketuntasan santri di kelas",
    content:
      "Kami menerapkan metode Al-Barqy untuk 80+ santri baru di TPQ kami. Luar biasa, poster klasikal besar dan kartu peraga guru sangat memudahkan pengajaran massal. Formula asosiasi kata bunyi Al-Barqy benar-benar 'Anti Lupa'—anak yang biasanya butuh 6 bulan untuk kenal makhraj huruf, sekarang selesai dalam hitungan pekan. Modul kurikulumnya sangat terstruktur untuk guru.",
    highlight: "Digunakan di 80+ Santri TPQ",
    verifiedBuyer: true,
    image: "/images/penaameen/testimonials/siti-nur-1.png",
    label: "Testimoni Ustadzah Anisa - Klasikal Guru",
  },
  {
    id: "3",
    slug: "testimoni-ibu-dewi-anggraeni",
    name: "Ibu Dewi Anggraeni, M.Pd",
    role: "Ibu Bekerja • Bunda dari Naura (4 tahun)",
    location: "Jakarta Selatan, DKI Jakarta",
    avatar: "/images/penaameen/testimonials/avatar-ibu-dewi.jpg",
    rating: 5,
    date: "18 Januari 2026",
    productUsed: "Paket Flashcard & Buku Aktivitas ACM",
    category: "anak",
    title: "Belajar membaca latin jadi momen bermain paling ditunggu setiap sore!",
    content:
      "Sebagai ibu bekerja, waktu saya mendampingi anak terbatas hanya 30 menit sepulang kantor. Metode ACM ini penyelamat banget! Bukunya penuh ilustrasi ceria, tanpa ejaan mengeja yang bikin anak frustasi. Naura menganggap belajar ini seperti main tebak kartu. Usia 4 tahun sudah bisa membaca kata-kata pendek dengan fasih dan penuh rasa percaya diri.",
    highlight: "Hanya 20-30 Menit Sehari",
    verifiedBuyer: true,
    image: "/images/penaameen/testimonials/wali-murid-1.png",
    label: "Testimoni Ibu Dewi - Metode ACM",
  },
  {
    id: "4",
    slug: "testimoni-ibu-ratna-kusuma",
    name: "Ibu Ratna Kusuma Wardhani",
    role: "Bunda dari Kenzo (6 tahun)",
    location: "Yogyakarta, D.I. Yogyakarta",
    avatar: "/images/penaameen/testimonials/avatar-ibu-siti.jpg",
    rating: 5,
    date: "5 Januari 2026",
    productUsed: "Paket Pintar Membaca & Menulis Ceria",
    category: "orangtua",
    title: "Persiapan masuk SD jadi sangat matang dan tanpa tekanan",
    content:
      "Kenzo tipe anak yang kinestetik dan gampang bosan. Modul aktivitas PENA AMEEN yang menggabungkan mewarnai, menempel kartu, dan latihan menulis bergaris besar sangat pas. Dia tidak merasa dipaksa, tapi kemampuan membaca dan motorik halusnya berkembang pesat. Hasil tes kematangan masuk SD kemarin dapat nilai sangat memuaskan!",
    highlight: "Sukses Persiapan Masuk SD",
    verifiedBuyer: true,
    image: "/images/penaameen/testimonials/ss-nur-1.png",
    label: "Testimoni Ibu Ratna - Persiapan Masuk SD",
  },
  {
    id: "5",
    slug: "testimoni-ibu-fauziyah-malang",
    name: "Ibu Fauziyah Hanum",
    role: "Wali Santri & Koordinator Home Learning",
    location: "Malang, Jawa Timur",
    avatar: "/images/penaameen/testimonials/avatar-ustadzah-anisa.jpg",
    rating: 5,
    date: "22 Desember 2025",
    productUsed: "Paket Al-Barqy 200 Menit & Juz Amma",
    category: "dewasa",
    title: "Membantu nenek dan anak belajar mengaji bersama di rumah",
    content:
      "Paket 200 Menit ini kami pakai tidak hanya untuk anak, tapi juga neneknya yang ingin memperlancar bacaan Qur'an kembali. Hurufnya jelas, panduannya bertahap tanpa membingungkan. Formula bunyinya sangat mudah diingat bahkan untuk lansia. Sangat berkah dan bermanfaat untuk keluarga besar kami.",
    highlight: "Cocok untuk Semua Generasi",
    verifiedBuyer: true,
    image: "/images/penaameen/testimonials/wali-murid-1.png",
    label: "Testimoni Ibu Fauziyah - Lintas Usia",
  },
  {
    id: "6",
    slug: "testimoni-ibu-maya-kartika",
    name: "Ibu Maya Kartika Sari",
    role: "Bunda dari Alif (3.5 tahun)",
    location: "Semarang, Jawa Tengah",
    avatar: "/images/penaameen/testimonials/avatar-ibu-dewi.jpg",
    rating: 5,
    date: "14 Desember 2025",
    productUsed: "Flashcard Hijaiyah Ceria & Poster Edukasi",
    category: "anak",
    title: "Flashcard tebal, warna cerah, dan sangat tahan lama dipakai balita",
    content:
      "Kualitas cetak dan material produk PENA AMEEN juara. Flashcard-nya tebal dan ujungnya rounded jadi aman dipegang balita. Alif usia 3,5 tahun setiap hari minta diajak main kartu hijaiyah. Daya ingat visualnya meningkat drastis. Recommended banget untuk bunda-bunda di luar sana!",
    highlight: "Material Premium & Aman Anak",
    verifiedBuyer: true,
    image: "/images/penaameen/testimonials/siti-nur-1.png",
    label: "Testimoni Ibu Maya - Flashcard Ceria",
  },
];

export const getTestimonialBySlug = (slug: string) => {
  return testimonials.find((testimonial) => testimonial.slug === slug);
};

