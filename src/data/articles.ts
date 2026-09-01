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
    title:
      "Mengenal Lebih Dekat Penerbit Pena Ameen: Pelopor Revolusi Belajar Membaca & Mengaji Anti Lupa",
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
    title:
      "Mengenal Al-Barqy: Metode Cepat Baca Al-Qur'an 200 Menit Anti Lupa Karya KH. Muhadjir Sulthon",
    excerpt:
      "Kupas tuntas filosofi asosiasi bunyi kata berirama (A-DA-RA-JA), rahasia kurikulum sistematis 200 menit, dan panduan praktis metode legendaris Al-Barqy yang terbukti membimbing lebih dari 1 juta santri dan pembelajar di Indonesia.",
    content: `Metode Al-Barqy telah diakui secara luas di dunia pendidikan Islam Indonesia dan mancanegara sebagai pelopor metode membaca Al-Qur'an tercepat, paling sistematis, dan berkarakteristik "Anti Lupa".

Sejak pertama kali dirumuskan pada tahun 1965 oleh ulama dan pakar pedagogi Al-Qur'an KH. Muhadjir Sulthon di Surabaya, Al-Barqy telah membimbing lebih dari 1.000.000 santri, pemula dewasa, mualaf, hingga kaum lansia untuk mampu membaca kalam Ilahi secara tartil, lancar, dan percaya diri.

1. Latar Belakang: Mengurai Problem Belajar Mengaji Konvensional
Selama puluhan tahun, banyak umat Muslim di Indonesia menghadapi kendala besar dalam belajar membaca Al-Qur'an. Metode tradisional yang mengandalkan sistem ejaan huruf per huruf (seperti Alif jabar A, Alif je-er I, Ba jabar BA) kerap membutuhkan waktu berbulan-bulan bahkan hingga bertahun-tahun.

Akibat proses yang panjang dan bertele-tele tersebut, muncul berbagai hambatan psikologis:
• Anak-anak dan pemula merasa jenuh, tertekan, dan cepat bosan saat menghadapi buku jilid yang tebal.
• Muncul fenomena "cepat lupa" — santri yang libur mengaji selama beberapa pekan seringkali lupa kembali bentuk huruf yang mirip (seperti Ba, Ta, Tsa, Nun, Ya).
• Orang dewasa, mualaf, dan lansia merasa minder dan enggan belajar karena malu harus mengeja dari awal seperti anak kecil.

Melihat kegelisahan umat tersebut, KH. Muhadjir Sulthon melakukan penelitian mendalam terhadap psikolinguistik, cara kerja memori manusia, dan karakteristik fonetik bahasa Arab agar selaras dengan lidah orang Nusantara. Lahirlah sebuah metode revolusioner bernama "Al-Barqy", yang secara harfiah bermakna "Kilat" — cepat, terang, dan menancap kuat.

2. Mengapa Disebut Formula "Anti Lupa"? (The Associative Memory Method)
Sebutan "Anti Lupa" bukanlah sekadar slogan komersial, melainkan prinsip sains kognitif yang menjadi inti kekuatan Al-Barqy. Otak manusia secara alami jauh lebih mudah mengingat pola kata yang memiliki makna dan rima berirama daripada mengingat simbol-simbol grafis abstrak yang terpisah-pisah.

Metode Al-Barqy mengelompokkan 28 huruf hijaiyah ke dalam rumus kata kunci fonetik berirama 4 huruf yang sangat akrab di telinga:
• Kata Kunci Utama: A - DA - RA - JA (اَ دَ رَ جَ)
• Kata Kunci Kedua: MA - HA - KA - YA (مَ هَ كَ يَ)
• Kata Kunci Ketiga: QA - THA - FA - LA (قَ طَ فَ لَ)
• Kata Kunci Keempat: BA - TA - TSA - NA (بَ تَ ثَ نَ)
• Kata Kunci Kelima: JA - HA - KHO - 'A (جَ حَ خَ عَ)
• dan seterusnya hingga mencakup seluruh huruf hijaiyah.

Melalui teknik asosiasi kata lembaga ini:
1. Santri tidak perlu menghafal nama huruf satu per satu (Alif, Ba, Ta) dengan ejaan rumit di awal.
2. Santri langsung membaca bunyi kata utuh secara spontan layaknya membaca bahasa sehari-hari.
3. Ketika menjumpai huruf tertentu di kemudian hari, memori otak langsung memanggil kata kuncinya. Pola asosiasi inilah yang mengunci ingatan di memori jangka panjang (Anti Lupa).

3. Rahasia Sistem 200 Menit (8 Sesi Belajar Terstruktur)
Keunggulan monumental Al-Barqy terletak pada efisiensi kurikulumnya. Seluruh materi membaca Al-Qur'an dari nol hingga mahir dirancang tuntas dalam total durasi belajar efektif 200 menit.

Waktu 200 menit ini umumnya dibagi ke dalam 8 sesi pertemuan @ 25 menit (atau 10 sesi @ 20 menit), dengan tahapan terstruktur:
• Sesi 1 – 2: Pengenalan Huruf Tunggal melalui Rumus Kata Kunci Fonetik (A-DA-RA-JA, MA-HA-KA-YA). Santri langsung lancar membaca variasi huruf tanpa mengeja.
• Sesi 3 – 4: Pengenalan Huruf Bersambung & Baris Panjang (Mad Thobi'i). Santri memahami perubahan bentuk huruf di awal, tengah, dan akhir kata serta panjang pendek 2 harakat secara intuitif.
• Sesi 5 – 6: Pengenalan Tanda Baca Sukun, Tasydid, & Tanwin. Santri dilatih melafalkan konsonan mati, dengung (Ghunnah), dan penekanan huruf secara fasih.
• Sesi 7 – 8: Pemantapan Tajwid Aplikatif & Praktik Membaca Al-Qur'an. Santri langsung mempraktikkan bacaan tartil pada ayat-ayat Al-Qur'an dengan makhraj yang benar.

4. Komparasi: Metode Al-Barqy vs Metode Mengeja Tradisional
Berikut adalah perbandingan mendasar antara pendekatan Al-Barqy dengan metode mengeja konvensional:

• Waktu Ketuntasan:
  - Al-Barqy: Tuntas dalam total 200 menit belajar efektif (rata-rata 1–2 bulan pendampingan santai).
  - Konvensional: Membutuhkan waktu 6 bulan hingga 2 tahun dengan banyak jilid bertingkat.
• Pendekatan Belajar:
  - Al-Barqy: Langsung membaca kata kunci berima bermakna (Tanpa Mengeja).
  - Konvensional: Mengeja nama huruf dan harakat satu per satu (Alif jabar A, dsb).
• Retensi Daya Ingat:
  - Al-Barqy: Terkunci di memori jangka panjang dengan formula kata asosiatif (Anti Lupa).
  - Konvensional: Rawan lupa dan sering tertukar bentuk huruf saat jeda belajar.
• Beban Psikologis:
  - Al-Barqy: Ceria, logis, membangkitkan rasa percaya diri pembelajar dari segala usia.
  - Konvensional: Cenderung monoton, rawan menimbulkan kejenuhan dan rasa takut salah.

5. Sasaran Pengguna: Solusi Inklusif Lintas Generasi
Metode Al-Barqy dirancang dengan fleksibilitas tinggi sehingga sangat efektif diaplikasikan untuk berbagai kalangan:
• Anak Usia Dini & Siswa SD: Membangun fondasi cinta membaca Al-Qur'an sejak kecil tanpa trauma atau paksaan.
• Remaja & Santri Pesantren: Akselerasi membaca lancar sebelum memasuki tahapan tahfidz (hafalan Al-Qur'an).
• Mahasiswa & Pemula Dewasa: Pendekatan yang sangat logis dan sistematis, memampukan orang dewasa belajar mandiri tanpa rasa canggung.
• Mualaf: Memudahkan pengenalan huruf Arab dari nol dengan analogi fonetik bahasa Indonesia yang ramah.
• Lansia: Sarana memperlancar bacaan Al-Qur'an dan menyempurnakan makhraj dengan ritme yang tenang dan mudah diingat.

6. Tips Praktis Pendampingan di Rumah (Home Learning)
Bagi orang tua dan pendamping di rumah, berikut adalah rekomendasi terbaik dalam membimbing putra-putri dengan Al-Barqy:
1. Konsistensi Waktu: Luangkan waktu 15–20 menit setiap hari secara teratur (misalnya ba'da Maghrib atau ba'da Subuh). Konsistensi harian jauh lebih efektif dibanding belajar 2 jam sekaligus di akhir pekan.
2. Gunakan Media Visual: Manfaatkan Flashcard Hijaiyah Interaktif dan Poster Edukasi Dinding Al-Barqy untuk menciptakan suasana belajar yang interaktif dan menyenangkan.
3. Berikan Apresiasi: Rayakan setiap keberhasilan kecil anak dalam menyelesaikan satu kata kunci. Hindari mengoreksi dengan nada tinggi agar anak tetap antusias.
4. Terapkan Komposisi Seimbang: Padukan 80% membaca aktif dengan 20% latihan menulis rasm Utsmani untuk melatih koordinasi motorik dan memperkuat daya rekam visual.

7. Ekosistem Perangkat Belajar Resmi Al-Barqy Pena Ameen
Untuk menunjang keberhasilan proses belajar, Penerbit Pena Ameen menyediakan ekosistem produk orisinal berstandar resmi:
1. Paket Home Learning Al-Barqy (Box Set 5-in-1): Solusi terlengkap untuk keluarga di rumah, berisi Buku Utama Jilid 1–3, Flashcard Hijaiyah 2 Sisi, 12 Poster Edukasi Klasikal, Buku Panduan Orang Tua, dan Tas Kanvas Eksklusif.
2. Buku Modul Al-Barqy 200 Menit: Modul kurikulum inti yang ringkas dan padat untuk penggunaan di TPQ, sekolah Islam, dan bimbingan privat.
3. Alat Peraga Klasikal & Poster: Media peraga ukuran besar untuk guru di kelas madrasah dan majelis taklim.
4. Program Pelatihan & Sertifikasi Guru: Workshop berkala yang diselenggarakan oleh Graha Al-Barqy Surabaya untuk mencetak pengajar Al-Qur'an yang profesional dan tersertifikasi.

8. Tanya Jawab Populer (FAQ)
• T: Apakah benar pemula bisa lancar membaca Al-Qur'an hanya dalam 200 menit?
  J: Benar. Waktu 200 menit adalah total durasi belajar terfokus (misalnya 8 sesi x 25 menit). Jutaan alumni santri telah membuktikan efektivitas sistem ini selama lebih dari 30 tahun.
• T: Apakah Al-Barqy mengajarkan hukum tajwid?
  J: Tentu saja. Tajwid diajarkan secara aplikatif langsung pada ayat Al-Qur'an, sehingga santri langsung mempraktikkan hukum mad, ghunnah, ikhfa, dan waqaf secara benar tanpa dibebani hafalan definisi rumit di awal.
• T: Di mana saya bisa mendapatkan buku dan modul resmi Al-Barqy?
  J: Seluruh produk resmi Penerbit Pena Ameen dapat dipesan langsung melalui website resmi penaameen.com atau melalui mitra cabang resmi di seluruh Indonesia.

Kesimpulan
Belajar membaca Al-Qur'an adalah gerbang pembuka keberkahan hidup setiap muslim. Allah SWT telah berfirman dalam Al-Qur'an Surah Al-Qamar ayat 17: "Dan sesungguhnya telah Kami mudahkan Al-Qur'an untuk pelajaran, maka adakah orang yang mengambil pelajaran?"

Dengan Metode Al-Barqy, proses belajar mengaji bukan lagi menjadi perjalanan yang sulit atau menakutkan, melainkan pengalaman yang membahagiakan, cepat, dan melekat seumur hidup. Mari hadirkan cahaya Al-Qur'an di rumah kita hari ini.`,
    date: "2026-01-10",
    category: "Metode Membaca",
    image: "/images/penaameen/methods/method-albarqy.jpg",
    readTime: 9,
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
