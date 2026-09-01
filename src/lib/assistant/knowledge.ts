import { products } from "@/data/products";
import { methods } from "@/data/methods";
import { branches } from "@/data/branches";
import { articles } from "@/data/articles";
import { getArticles, getBranches, getMethods } from "@/lib/content";

const formatIdr = (value: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

function buildProductsSection(list = products): string {
  return list
    .map((p) => {
      const price = formatIdr(p.price);
      const cat = p.category;
      // include slug for direct linking
      return `- ${p.name} (slug: ${p.slug}, Kategori: ${cat}) | Harga: ${price} | Deskripsi: ${p.description}`;
    })
    .join("\n");
}

function buildMethodsSection(list = methods): string {
  return list
    .map((m) => {
      const stats = m.keyStats
        .map((s) => `${s.label}: ${s.value} (${s.detail})`)
        .join("; ");
      const advantages = m.advantages.map((a) => `${a.title}`).join(", ");
      const faqs = m.faqs
        .slice(0, 2)
        .map((f) => `Q: ${f.question} A: ${f.answer.slice(0, 120)}`)
        .join(" | ");
      return [
        `Nama: ${m.name} (slug: ${m.slug})`,
        `Tagline: ${m.tagline}`,
        `Referensi: ${m.officialReference} (${m.officialDomain})`,
        `Deskripsi: ${m.description}`,
        `Filosofi: ${m.philosophy.slice(0, 200)}`,
        `Durasi target: ${m.targetDuration} | Cocok untuk: ${m.suitableFor}`,
        `Komposisi: ${m.composition.reading} / ${m.composition.writing} / ${m.composition.concept}`,
        `Statistik kunci: ${stats}`,
        `Keunggulan: ${advantages}`,
        `Langkah: ${m.steps.map((s) => `${s.step} - ${s.title}`).join(" | ")}`,
        `Manfaat: ${m.benefits.slice(0, 3).join("; ")}`,
        `FAQ ringkas: ${faqs}`,
      ].join("\n");
    })
    .join("\n\n");
}

function buildBranchesSection(list = branches): string {
  return list
    .map((b) => {
      if (b.outlets && b.outlets.length > 0) {
        const outletList = b.outlets
          .map(
            (o) =>
              `  * ${o.name} (PIC: ${o.pic}, Kota: ${o.city}, Tipe: ${o.type ?? "-"}): ${o.address} | Telp: ${o.contact}`,
          )
          .join("\n");
        return `- ${b.region} (${b.city}) — ${b.address} | Kontak pusat: ${b.contact}:\n${outletList}`;
      }
      return `- ${b.region} (${b.city}): ${b.address} | Kontak: ${b.contact}`;
    })
    .join("\n");
}

function buildArticlesSection(list = articles): string {
  return list
    .map(
      (a) =>
        `- ${a.title} (slug: ${a.slug}, Kategori: ${a.category}, ${a.readTime} menit baca) — ${a.excerpt.slice(0, 180)}`,
    )
    .join("\n");
}

function buildSiteMapSection(): string {
  return [
    "/ — Beranda (hero, produk unggulan 6 teratas, metode ACM & AL-BARQY, sejarah singkat, testimoni, CTA)",
    "/produk — Katalog produk (22 produk, filter kategori Al-Barqy/ACM/Umum, pencarian live, sortir, tambah keranjang)",
    "/produk/[slug] — Detail produk (harga, stok, deskripsi lengkap, box contents, keunggulan, spesifikasi penulis KH. Muhadjir Sulthon / Tim Pena Ameen, panduan 4 tahap, FAQ, produk terkait, tambah keranjang & beli sekarang, JSON-LD SEO)",
    "/metode — Daftar metode (ACM & AL-BARQY, komposisi, keunggulan, langkah, FAQ, produk terkait)",
    "/metode/acm — Detail Metode ACM (Aku Cepat Membaca) — tanpa mengeja, 16–24 pertemuan, untuk PAUD/TK/ABK & dewasa buta aksara",
    "/metode/al-barqy — Detail Metode AL-BARQY 200 Menit Anti Lupa — karya KH. Muhadjir Sulthon sejak 1965, formula A-DA-RA-JA / MA-HA-KA-YA, 8 sesi 25 menit, 1juta+ alumni",
    "/sejarah — Sejarah Pena Ameen (timeline 1995 PENA SUCI → 2013 PENA AMEEN joint venture PENA SUCI + AL AMEEN SERVE HOLDING, GR AHA AL BARQY Surabaya)",
    "/tentang — Tentang kami (manifest, visi, keunggulan 30+ tahun, workshop)",
    "/cabang — Cabang & Mitra Resmi (8 region, 30+ titik — DKI Jakarta 5, Jabar 21, Jatim pusat Surabaya Jl Gayungsari 1A)",
    "/cabang/[slug] — Detail cabang per region",
    "/artikel — Artikel edukasi & parenting (filter kategori, search)",
    "/artikel/[slug] — Detail artikel",
    "/kontak — Kontak resmi (GRAHA AL BARQY Jl Gayungsari 1A Surabaya, tel +6231 829 4393, WA +62822 3123 9158, email cs.penaameen@yahoo.com, jam operasional, form)",
    "/galeri-kegiatan — Galeri foto pelatihan & komunitas",
    "/keranjang / cart — (via ikon cart di header) — ringkasan keranjang",
    "/checkout/address — Checkout langkah 1: alamat pengiriman (RajaOngkir cek ongkir otomatis)",
    "/checkout/payment — Checkout langkah 2: pembayaran (Casaku QRIS dinamis expiry 15 menit + Midtrans backup, QR ditampilkan, instruksi bayar)",
    "/orders — Pesanan saya (login wajib) — daftar 10 pesanan terbaru, filter status, tracking resi, detail, riwayat status",
    "/orders/[id] — Detail pesanan individual",
    "/sign-in — Login (Clerk)",
    "/sign-up — Daftar akun (Clerk)",
    "/api/cart — API keranjang (GET/POST)",
    "/api/assistant — API TANYA AMEEN (komunikasi bot)",
  ].join("\n");
}

function buildPaymentShippingSection(): string {
  return [
    "Pembayaran:",
    "- Utama: Casaku QRIS Dinamis — QR unik per transaksi, expiry 15 menit, verifikasi amount unik, webhook ke /api/webhooks/casaku, instruksi di /checkout/payment.",
    "- Backup: Midtrans Snap — Snap token, QRIS/e-wallet/VA, webhook ke /api/webhooks/midtrans.",
    "- Mata uang IDR, harga produk statis di DB (prices.ts & Prisma), exclude ongkir sampai checkout.",
    "Pengiriman:",
    "- Provider: RajaOngkir — hitung ongkir realtime di checkout/address berdasarkan alamat, kota, provinsi, kodepos, berat paket (product weight di product-rich-details, contoh 1.8kg untuk Home Learning Albarqy).",
    "- Kurir: JNE, POS, TIKI, dll tergantung rate RajaOngkir; resi diinput admin di /admin/orders dan tampil di /orders.",
    "- Biaya ongkir ditambah ke subtotal menjadi total akhir di Order.total.",
    "Status pesanan (OrderStatus): PENDING_PAYMENT → PAID → PROCESSING (dikemas) → SHIPPED (ada trackingNumber & shippedAt) → DELIVERED → CANCELLED/REFUNDED. History di OrderStatusHistory.",
  ].join("\n");
}

function buildShoppingGuideSection(): string {
  return [
    "Alur belanja untuk pembeli:",
    "1. Cari produk di /produk (ketik di header hero atau /produk search) → klik detail /produk/[slug] → pilih qty → Tambah Keranjang (optimistic localStorage penaameen_local_cart + POST /api/cart jika login).",
    "2. Buka ikon keranjang di header (badge jumlah) → cek item, update qty, hapus, lihat subtotal.",
    "3. Checkout: jika belum login diarahkan /sign-in → isi alamat di /checkout/address (pilih alamat tersimpan atau baru) → hitung ongkir RajaOngkir → lanjut /checkout/payment → bayar QRIS Casaku (scan 15 menit) atau Midtrans → redirect konfirmasi → pesanan masuk /orders.",
    "4. Pantau pesanan di /orders (status label Indonesia: Menunggu Pembayaran, Pembayaran Terverifikasi, Sedang Dikemas, Dalam Pengiriman, Pesanan Selesai, Dibatalkan). Resi setelah SHIPPED.",
    "Tips: keranjang guest disimpan localStorage penaameen_local_cart, setelah login disinkronkan ke DB Cart. Stok realtime dari DB Product.stock, jika habis tombol disabled. Garansi 100% orisinal & retur cacat kirim.",
  ].join("\n");
}

function buildAccountSessionSection(): string {
  return [
    "Akun & Sesi:",
    "- Auth: Clerk — NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY / CLERK_SECRET_KEY. Header menampilkan avatar + nama (CustomerMenu) jika signed-in, badge Pesanan, tombol Masuk/Daftar jika guest. Mobile drawer juga.",
    "- Sesi chat TANYA AMEEN: ChatSession + ChatMessage di Prisma. Logged-in: satu ChatSession per userId (upsert), history 12 pesan terakhir. Guest: sessionId UUID di localStorage penaameen_ameen_session, chat disimpan localStorage penaameen_ameen_chat sebagai fallback, dan di DB sebagai guest session (userId null). Isolasi: guest tidak bisa reuse session milik user lain.",
    "- Konteks yang dikirim bot setiap request: pagePath, pageTitle, pageUrl, searchQuery (dari AmeenContext), cartSnapshot (nama/qty/price 8 teratas) + cartItemCount + cartTotal, isSignedIn, userLabel (name/email), 10 orders terbaru (orderNumber/status/total/items). Bot harus jawab spesifik berdasarkan konteks tersebut.",
    "- Rate limit: 30 requests per 10 menit per IP (x-forwarded-for).",
    "- Penyimpanan chat: persist hanya 2 pesan terakhir (user + assistant) per turn jika dbSessionId ada.",
  ].join("\n");
}

function buildContactSection(): string {
  return [
    "Kontak Resmi & Sosial:",
    "- Kantor Pusat: GRAHA AL BARQY Jl. Gayungsari 1A Surabaya, Jawa Timur, Indonesia.",
    "- Telepon: +6231 829 4393, Mobile/WhatsApp: +62822 3123 9158, Email: cs.penaameen@yahoo.com, Website: https://penaameen.com.",
    "- Admin/Staff allowlist via ADMIN_EMAILS env.",
    "- Untuk jawaban tidak tahu: arahkan ke /kontak atau WA/email di atas.",
  ].join("\n");
}

export function buildWebsiteKnowledge(): string {
  return [
    "=== TENTANG PENA AMEEN ===",
    "Pena Ameen (Ameen Educare) adalah penerbit & lembaga riset edukasi Islam yang mengembangkan metode belajar membaca Al-Qur'an AL-BARQY (200 Menit Anti Lupa, karya KH. Muhadjir Sulthon sejak 1965) dan metode belajar membaca Latin ACM (Aku Cepat Membaca tanpa mengeja, tanpa hafal A-Z di awal). Didirikan sebagai joint venture PENA SUCI (1995) + AL AMEEN SERVE HOLDING menjadi PENA AMEEN 2013. Telah dipercaya 500+ sekolah/TPQ, 1juta+ alumni, 30+ tahun dedikasi.",
    buildContactSection(),
    "",
    "=== METODE BELAJAR (lengkap) ===",
    buildMethodsSection(),
    "",
    "=== PRODUK (22 produk, harga resmi, slug untuk linking) ===",
    buildProductsSection(),
    "",
    "=== ARTIKEL / EDUKASI ===",
    buildArticlesSection(),
    "",
    "=== CABANG & MITRA RESMI (30+ titik) ===",
    "Pusat di Surabaya (GRAHA AL BARQY). 8 region. Detail per outlet: nama, PIC, alamat, kontak, tipe (Mitra Lembaga, Trainer, TK, Pesantren, Reseller). Arahkan ke /cabang atau /cabang/[slug] untuk detail.",
    buildBranchesSection(),
    "",
    "=== PEMBAYARAN & PENGIRIMAN ===",
    buildPaymentShippingSection(),
    "",
    "=== CARA BELANJA & CHECKOUT (alursesi) ===",
    buildShoppingGuideSection(),
    "",
    "=== AKUN, KERANJANG & SESI CHAT (konteks personalisasi) ===",
    buildAccountSessionSection(),
    "",
    "=== STATUS PESANAN ===",
    "- PENDING_PAYMENT: Menunggu pembayaran (pelanggan perlu menyelesaikan pembayaran QRIS 15 menit).",
    "- PAID: Pembayaran terverifikasi.",
    "- PROCESSING: Sedang dikemas di gudang.",
    "- SHIPPED: Dalam pengiriman (ada nomor resi trackingNumber, cek di /orders).",
    "- DELIVERED: Pesanan selesai (deliveredAt).",
    "- CANCELLED/REFUNDED: Dibatalkan/direfund.",
    "",
    "=== PETA LENGKAP HALAMAN WEBSITE & API ===",
    buildSiteMapSection(),
  ].join("\n");
}

export async function buildLiveWebsiteKnowledge(): Promise<string> {
  try {
    const [liveArticles, liveBranches, liveMethods] = await Promise.all([
      getArticles(),
      getBranches(),
      getMethods(),
    ]);

    // Build dengan data live jika tersedia, fallback ke static jika DB kosong/error
    const articlesList =
      liveArticles.length > 0
        ? (liveArticles as unknown as typeof articles)
        : articles;
    const branchesList =
      liveBranches.length > 0
        ? (liveBranches as unknown as typeof branches)
        : branches;
    const methodsList =
      liveMethods.length > 0
        ? (liveMethods as unknown as typeof methods)
        : methods;

    return [
      "=== TENTANG PENA AMEEN ===",
      "Pena Ameen (Ameen Educare) adalah penerbit & lembaga riset edukasi Islam yang mengembangkan metode belajar membaca Al-Qur'an AL-BARQY (200 Menit Anti Lupa, karya KH. Muhadjir Sulthon sejak 1965) dan metode belajar membaca Latin ACM (Aku Cepat Membaca tanpa mengeja). Joint venture 2013, 30+ tahun, 500+ sekolah/TPQ.",
      buildContactSection(),
      "",
      "=== METODE BELAJAR (live) ===",
      buildMethodsSection(methodsList),
      "",
      "=== PRODUK (22 produk, harga resmi) ===",
      buildProductsSection(),
      "",
      "=== ARTIKEL / EDUKASI (live) ===",
      buildArticlesSection(articlesList),
      "",
      "=== CABANG & MITRA RESMI (live) ===",
      buildBranchesSection(branchesList),
      "",
      "=== PEMBAYARAN & PENGIRIMAN ===",
      buildPaymentShippingSection(),
      "",
      "=== CARA BELANJA & CHECKOUT ===",
      buildShoppingGuideSection(),
      "",
      "=== AKUN, KERANJANG & SESI CHAT ===",
      buildAccountSessionSection(),
      "",
      "=== STATUS PESANAN ===",
      "- PENDING_PAYMENT → PAID → PROCESSING → SHIPPED (resi) → DELIVERED / CANCELLED",
      "",
      "=== PETA HALAMAN LENGKAP ===",
      buildSiteMapSection(),
    ].join("\n");
  } catch {
    return buildWebsiteKnowledge();
  }
}
