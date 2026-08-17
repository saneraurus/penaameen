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
    id: "profil-lengkap-penerbit-pena-ameen",
    slug: "profil-lengkap-penerbit-pena-ameen",
    title: "Mengenal Lebih Dekat Penerbit Pena Ameen: Pelopor Revolusi Belajar Membaca & Mengaji Anti Lupa",
    excerpt:
      "Ulasan lengkap perjalanan, visi, dan filosofi Penerbit Pena Ameen (Ameen Educare) dalam menghadirkan metode Al-Barqy 200 Menit dan ACM yang terbukti membimbing jutaan keluarga dan santri di Indonesia.",
    content: `Penerbit Pena Ameen (dikenal luas juga sebagai Ameen Educare) merupakan lembaga penerbitan dan riset edukasi Islam yang telah berdedikasi selama lebih dari tiga dekade dalam menghadirkan terobosan metode belajar membaca Al-Qur'an dan huruf Latin di Indonesia.

1. Latar Belakang & Sejarah Lahirnya Pena Ameen
Selama puluhan tahun, proses belajar membaca Al-Qur'an di Indonesia seringkali menghadapi tantangan besar. Metode konvensional seperti mengeja huruf satu per satu (Alif jabar A, Alif je-er I, Alif pe-es U) kerap memakan waktu bertahun-tahun, membuat anak-anak dan pemula merasa jenuh, cepat lupa, dan bahkan mengalami krisis percaya diri saat berhadapan dengan mushaf Al-Qur'an.

Melihat kegelisahan tersebut, para pakar pendidikan Islam merumuskan metode Al-Barqy (Metode Cepat Baca Al-Qur'an Sistem 200 Menit) yang dipelopori oleh Ust. Muhadjir Sulthon. Metode ini menggunakan pendekatan asosiasi struktur bunyi kata berpasangan (A-DA-RA-JA, MA-HA-KA-YA, dsb.) yang selaras dengan cara kerja memori otak manusia. Melalui sistem ini, santri pemula dapat membaca huruf sambung Al-Qur'an hanya dalam hitungan jam dan memiliki ingatan yang melekat seumur hidup (Anti Lupa).

2. Filosofi & Visi Pena Ameen
Pena Ameen berpijak pada keyakinan bahwa: "Setiap insan berhak merasakan kebahagiaan saat belajar membaca dan mengaji, tanpa rasa takut salah, tanpa tekanan, dan tanpa batasan usia."

Visi utama kami adalah menjadi pusat penerbitan dan pembinaan literasi Al-Qur'an terdepan yang inklusif, inovatif, dan membahagiakan. Kami ingin mengubah paradigma belajar mengaji dari sekadar rutinitas yang kaku menjadi momen bonding yang hangat antara orang tua dan anak di rumah, serta suasana kelas yang dinamis di TPQ dan sekolah.

3. 4 Pilar Keunggulan Metodologi Kami
• Formula Anti Lupa (Associative Memory Method): Menggunakan pola bunyi kata berima yang mudah diingat dan cepat dipahami santri dari segala usia.
• Konsep Belajar Ceria (Fun & Active Learning): Diwujudkan melalui metode ACM (Aku Cepat Membaca) dengan kartu edukasi bergambar penuh warna dan aktivitas motorik untuk anak usia 3–8 tahun.
• Pendekatan Home Learning Terpadu: Menyediakan buku panduan orang tua mandiri, lembar pantau harian, dan petunjuk langkah demi langkah agar ayah dan bunda dapat membimbing anak secara santai namun terarah.
• Inklusivitas Lintas Generasi: Sangat efektif digunakan oleh anak usia dini, remaja, santri pesantren, mahasiswa, hingga orang tua dan lansia yang ingin memulai kembali belajar mengaji dari nol tanpa rasa canggung.

4. Ekosistem Produk & Pembinaan
Hingga saat ini, ekosistem Pena Ameen mencakup:
1. Paket Al-Barqy 200 Menit: Modul buku utama, flashcard huruf hijaiyah, dan buku latihan tajwid praktis.
2. Paket ACM (Aku Cepat Membaca): Buku aktivitas bertahap, kartu kata ceria, dan panduan belajar membaca Latin untuk anak pra-sekolah.
3. Alat Peraga Klasikal Guru & Lembaga: Poster dinding berukuran besar, kartu peraga guru, dan modul kurikulum standar untuk lebih dari 500+ TPQ binaan.
4. Workshop & Sertifikasi Guru: Pelatihan berkala untuk ribuan pengajar Al-Qur'an di berbagai provinsi agar memiliki standar kompetensi mengajar yang ramah anak dan profesional.

Pena Ameen terus berkomitmen untuk berinovasi melalui media digital dan fisik, memastikan bahwa cahaya literasi Al-Qur'an dapat menyinari setiap rumah tangga di seluruh pelosok Nusantara.`,
    date: "2026-02-15",
    category: "Profil & Sejarah",
    image: "/images/penaameen/editorial/tentang-hero-family.jpg",
    readTime: 7,
  },
  {
    id: "1",
    slug: "belajar-cepat-mengaji-untuk-anak",
    title: "Belajar Cepat Mengaji Untuk Anak, Apakah Bisa?",
    excerpt:
      "Artikel ini membahas tentang efektivitas metode belajar cepat mengaji untuk anak dan bagaimana orang tua dapat mendukung proses belajarnya di rumah.",
    content: `Mengajarkan anak mengaji sejak usia dini adalah dambaan setiap orang tua muslim. Namun, pertanyaan yang sering muncul adalah: "Apakah mungkin anak usia balita atau sekolah dasar bisa lancar mengaji dalam waktu singkat tanpa merasa terbebani?"

Jawabannya adalah: SANGAT BISA, asalkan menggunakan metode yang tepat dan sesuai dengan psikologi perkembangan anak.

Anak-anak belajar melalui pola visual, bunyi ritmis, dan asosiasi benda yang konkret. Metode Al-Barqy dan ACM dari Pena Ameen dirancang khusus dengan memperhatikan aspek ini. Alih-alih menghafal 28 huruf hijaiyah satu per satu dengan ejaan rumit, anak diajak mengenali kata kunci berirama seperti "A-DA-RA-JA" yang mudah diucapkan dan langsung dapat digabungkan dengan huruf lainnya.

Peran orang tua di rumah bukanlah sebagai penguji yang galak, melainkan sebagai fasilitator yang memberikan apresiasi dan menciptakan suasana belajar yang santai, ceria, dan konsisten 10–15 menit setiap hari.`,
    date: "2026-01-12",
    category: "Tips Belajar",
    image: "/images/penaameen/editorial/anak-belajar-mengaji.jpg",
    readTime: 5,
  },
  {
    id: "2",
    slug: "metode-albarqy-anti-lupa",
    title: "Mengenal Al-Barqy: Metode Cepat Baca Al-Qur'an 200 Menit Anti Lupa",
    excerpt:
      "Membedah rahasia di balik sistem struktur bunyi kata Al-Barqy yang membuat santri mampu membaca Al-Qur'an dengan cepat dan melekat seumur hidup.",
    content: `Metode Al-Barqy dikenal luas di dunia pendidikan Islam sebagai metode "Anti Lupa". Nama ini bukan sekadar slogan, melainkan hasil dari riset metodologi yang teruji selama puluhan tahun.

Keunggulan utama sistem Al-Barqy adalah teknik "Struktur Bunyi Kata Berpasangan". Santri tidak dibebani dengan rumus tajwid yang abstrak di awal, melainkan langsung dibimbing mempraktikkan bunyi huruf sambung melalui kata kunci inti.

Hanya dalam total durasi 200 menit bimbingan efektif, pemula yang awalnya buta huruf hijaiyah dapat membaca rangkaian ayat-ayat Al-Qur'an dengan lancar, makhraj yang benar, dan kepercayaan diri yang tinggi.`,
    date: "2026-01-10",
    category: "Metode Membaca",
    image: "/images/penaameen/methods/method-albarqy.jpg",
    readTime: 6,
  },
  {
    id: "3",
    slug: "keunggulan-metode-acm",
    title: "Metode ACM: Mengembangkan Kemampuan Membaca Latin dengan Ceria",
    excerpt:
      "Mengapa metode ACM menjadi pilihan utama bagi ribuan TK/PAUD dan orang tua untuk menumbuhkan minat baca anak sejak usia 3 tahun.",
    content: `Metode ACM (Aku Cepat Membaca) adalah solusi literasi anak usia dini yang mengusung prinsip "Bermain Sambil Belajar". 

Buku dan kartu peraga ACM menyajikan ilustrasi karakter yang ramah anak, warna-warna cerah, dan tahapan modul yang terstruktur. Anak tidak merasa sedang 'belajar keras', melainkan sedang menikmati permainan menebak gambar dan kata.

Hasilnya, kemampuan membaca huruf Latin anak berkembang pesat dengan rasa gembira, membangun rasa percaya diri, dan menumbuhkan kecintaan terhadap buku sejak usia dini.`,
    date: "2026-01-08",
    category: "Untuk Guru",
    image: "/images/penaameen/methods/method-acm.jpg",
    readTime: 4,
  },
];

export const getArticlesByCategory = (category: string) => {
  return articles.filter(
    (article) => article.category.toLowerCase() === category.toLowerCase(),
  );
};

export const getArticleBySlug = (slug: string) => {
  return articles.find((article) => article.slug === slug);
};
