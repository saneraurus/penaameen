import { products } from "@/data/products";
import { methods } from "@/data/methods";
import { branches } from "@/data/branches";
import { articles } from "@/data/articles";

const formatIdr = (value: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

function buildProductsSection(): string {
  return products
    .map((p) => {
      return `- ${p.name} (Kategori: ${p.category}) | Harga: ${formatIdr(p.price)} | Deskripsi: ${p.description}`;
    })
    .join("\n");
}

function buildMethodsSection(): string {
  return methods
    .map((m) => {
      const stats = m.keyStats
        .map((s) => `${s.label}: ${s.value} (${s.detail})`)
        .join("; ");
      return [
        `Nama: ${m.name}`,
        `Tagline: ${m.tagline}`,
        `Referensi: ${m.officialReference}`,
        `Deskripsi: ${m.description}`,
        `Durasi target: ${m.targetDuration}`,
        `Cocok untuk: ${m.suitableFor}`,
        `Statistik kunci: ${stats}`,
        `Langkah: ${m.steps.map((s) => `${s.step} - ${s.title}`).join(" | ")}`,
      ].join("\n");
    })
    .join("\n\n");
}

function buildBranchesSection(): string {
  return branches
    .map((b) => {
      if (b.outlets && b.outlets.length > 0) {
        const outletList = b.outlets
          .map(
            (o) =>
              `  * ${o.name} (PIC: ${o.pic}): ${o.address} | Telp: ${o.contact}`,
          )
          .join("\n");
        return `- ${b.region} (${b.city}):\n${outletList}`;
      }
      return `- ${b.region} (${b.city}): ${b.address} | Kontak: ${b.contact}`;
    })
    .join("\n");
}

function buildArticlesSection(): string {
  return articles
    .map(
      (a) =>
        `- ${a.title} (Kategori: ${a.category}, ${a.readTime} menit baca) - ${a.excerpt.slice(0, 200)}`,
    )
    .join("\n");
}

function buildSiteMapSection(): string {
  return [
    "/ - Beranda (hero, produk unggulan, metode, sejarah singkat, testimoni)",
    "/produk - Daftar produk Pena Ameen (bisa dicari dan difilter per kategori)",
    "/produk/[slug] - Detail produk dan tombol tambah ke keranjang",
    "/metode - Halaman metode (ACM & AL-BARQY)",
    "/metode/acm - Metode ACM (Aku Cepat Membaca)",
    "/metode/al-barqy - Metode AL-BARQY 200 Menit",
    "/sejarah - Sejarah Pena Ameen",
    "/tentang - Tentang Pena Ameen",
    "/cabang - Daftar cabang/region layanan",
    "/artikel - Artikel edukasi dan profil",
    "/kontak - Kontak resmi Pena Ameen",
    "/orders - Pesanan saya & tracking resi (perlu login)",
    "/checkout/address - Alamat pengiriman saat checkout",
    "/checkout/payment - Pembayaran saat checkout",
  ].join("\n");
}

export function buildWebsiteKnowledge(): string {
  return [
    "=== TENTANG PENA AMEEN ===",
    "Pena Ameen (Ameen Educare) adalah penerbit dan lembaga riset edukasi Islam yang mengembangkan metode belajar membaca Al-Qur'an dan membaca Latin (ACM). Kantor pusat: GRAHA AL BARQY Jl. Gayungsari 1A Surabaya, Jawa Timur, Indonesia. Telepon: +6231 829 4393, Mobile: +62822 3123 9158, Email: cs.penaameen@yahoo.com. Website: penaameen.com.",
    "",
    "=== METODE BELAJAR ===",
    buildMethodsSection(),
    "",
    "=== PRODUK (19 produk, harga resmi) ===",
    buildProductsSection(),
    "",
    "=== ARTIKEL / EDUKASI ===",
    buildArticlesSection(),
    "",
    "=== CABANG & MITRA RESMI ===",
    "Daftar cabang, perwakilan, dan mitra resmi Pena Ameen tersedia di bawah ini. Arahkan pelanggan ke halaman /cabang atau /kontak untuk informasi lebih lanjut.",
    buildBranchesSection(),
    "",
    "=== STATUS PESANAN ===",
    "- PENDING_PAYMENT: Menunggu pembayaran (pelanggan perlu menyelesaikan pembayaran).",
    "- PAID: Pembayaran terverifikasi.",
    "- PROCESSING: Sedang dikemas di gudang.",
    "- SHIPPED: Dalam pengiriman (ada nomor resi).",
    "- DELIVERED: Pesanan selesai.",
    "- CANCELLED: Dibatalkan.",
    "",
    "=== PETA HALAMAN WEBSITE ===",
    buildSiteMapSection(),
  ].join("\n");
}
