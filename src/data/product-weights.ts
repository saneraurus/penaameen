export type ProductWeightGroup = "ACM" | "ABQ";

export interface ProductWeight {
  group: ProductWeightGroup;
  name: string;
  size: string;
  pages: string;
  weightGrams: number;
  sourceWeight: string;
}

// Source: PRODUK/BERAT PRODUK ACM ABQ.xlsx. Package weights are not inferred
// from these component weights because package contents are not confirmed.
export const productWeights: ProductWeight[] = [
  {
    group: "ACM",
    name: "Buku ACM Anak",
    size: "21 x 25 cm",
    pages: "64 + 2 Cover",
    weightGrams: 200,
    sourceWeight: "200gr/buku",
  },
  {
    group: "ACM",
    name: "Buku ACM LKS",
    size: "21 x 25 cm",
    pages: "52 + 2 Cover",
    weightGrams: 190,
    sourceWeight: "190gr/buku",
  },
  {
    group: "ACM",
    name: "Buku Mewarnai",
    size: "21 x 25 cm",
    pages: "29 + 2 Cover",
    weightGrams: 200,
    sourceWeight: "200gr/buku",
  },
  {
    group: "ACM",
    name: "Buku ACM Edisi ABK",
    size: "21 x 25 cm",
    pages: "91 + 2 Cover",
    weightGrams: 220,
    sourceWeight: "220gr/buku",
  },
  {
    group: "ACM",
    name: "ACM Pasca Bisa Membaca",
    size: "21 x 25 cm",
    pages: "58 + 2 Cover",
    weightGrams: 200,
    sourceWeight: "200gr/buku",
  },
  {
    group: "ACM",
    name: "ACM Pasca Bisa Membaca Dewasa",
    size: "21 x 25 cm",
    pages: "78 + 2 Cover",
    weightGrams: 200,
    sourceWeight: "200gr/buku",
  },
  {
    group: "ACM",
    name: "Lembar Mewarnai",
    size: "70gr A4 (21 x 29,7 cm)",
    pages: "7 Lembar",
    weightGrams: 210,
    sourceWeight: "210gr/buku",
  },
  {
    group: "ACM",
    name: "Lembar Menggunting",
    size: "70gr A4 (21 x 29,7 cm)",
    pages: "5 Lembar",
    weightGrams: 150,
    sourceWeight: "150gr/buku",
  },
  {
    group: "ACM",
    name: "Lembar Menempel",
    size: "70gr A4 (21 x 29,7 cm)",
    pages: "7 Lembar",
    weightGrams: 150,
    sourceWeight: "150gr/buku",
  },
  {
    group: "ACM",
    name: "Lembar Melingkari",
    size: "70gr A4 (21 x 29,7 cm)",
    pages: "7 Lembar",
    weightGrams: 150,
    sourceWeight: "150gr/buku",
  },
  {
    group: "ACM",
    name: "Puzzle Kubus ACM bufalo",
    size: "70gr A4 (21 x 29,7 cm)",
    pages: "7 Lembar",
    weightGrams: 150,
    sourceWeight: "150gr/buku",
  },
  {
    group: "ACM",
    name: "Ular Tangga ACM art paper",
    size: "260gr A3+ (32 x 48 cm)",
    pages: "1 Lembar",
    weightGrams: 100,
    sourceWeight: "100gr/buku",
  },
  {
    group: "ACM",
    name: "Ular Tangga ACM vinyl Bantal Dadu",
    size: "3 x 2 meter; 20 x 20 cm (Dadu)",
    pages: "1 Lembar",
    weightGrams: 3000,
    sourceWeight: "3000gr/buku; 1000gr/buku (Dadu)",
  },
  {
    group: "ACM",
    name: "Monopoli ACM",
    size: "260gr A3+ (32 x 48 cm)",
    pages: "1 Lembar",
    weightGrams: 100,
    sourceWeight: "100gr/buku",
  },
  {
    group: "ACM",
    name: "Alat Peraga ACM vinyl",
    size: "80 x 100 cm",
    pages: "19 Lembar",
    weightGrams: 3000,
    sourceWeight: "3000gr/buku",
  },
  {
    group: "ACM",
    name: "Alat Peraga ACM art paper",
    size: "260gr A3+ (32 x 48 cm)",
    pages: "19 Lembar",
    weightGrams: 700,
    sourceWeight: "700gr/buku",
  },
  {
    group: "ACM",
    name: "Alat Peraga Aku Cepat Berhitung",
    size: "260gr A3+ (32 x 48 cm)",
    pages: "11 Lembar",
    weightGrams: 500,
    sourceWeight: "500gr/buku",
  },
  {
    group: "ACM",
    name: "Kartu Baca ACM",
    size: "14 x 14,8 cm",
    pages: "166 Kartu",
    weightGrams: 1300,
    sourceWeight: "1300gr/buku",
  },
  {
    group: "ACM",
    name: "Kartu Baca Mini ACM",
    size: "7 x 10,7 cm",
    pages: "29 Kartu",
    weightGrams: 150,
    sourceWeight: "150gr/buku",
  },
  {
    group: "ACM",
    name: "Pra-Menulis 1",
    size: "21 x 25 cm",
    pages: "62 + 2 Cover",
    weightGrams: 200,
    sourceWeight: "200gr/buku",
  },
  {
    group: "ACM",
    name: "Pra-Menulis 2",
    size: "21 x 25 cm",
    pages: "60 + 2 Cover",
    weightGrams: 200,
    sourceWeight: "200gr/buku",
  },
  {
    group: "ACM",
    name: "Belajar Menulis Angka dan Huruf",
    size: "21 x 25 cm",
    pages: "63 + 2 Cover",
    weightGrams: 200,
    sourceWeight: "200gr/buku",
  },
  {
    group: "ACM",
    name: "Alat Peraga ACM ABK",
    size: "A3+ (32 x 48 cm)",
    pages: "21 Lembar",
    weightGrams: 800,
    sourceWeight: "800gr/buku",
  },
  {
    group: "ABQ",
    name: "Buku ABQ Sistem 8 Jam (ABQ Anak)",
    size: "21 x 25 cm",
    pages: "84 + 2 Cover",
    weightGrams: 220,
    sourceWeight: "220gr/buku",
  },
  {
    group: "ABQ",
    name: "Buku LKS ABQ",
    size: "21 x 25 cm",
    pages: "50 + 2 Cover",
    weightGrams: 190,
    sourceWeight: "190gr/buku",
  },
  {
    group: "ABQ",
    name: "Buku ABQ 200 Menit (ABQ Dewasa)",
    size: "20,5 x 25,7 cm",
    pages: "59 + 2 Cover",
    weightGrams: 190,
    sourceWeight: "190gr/buku",
  },
  {
    group: "ABQ",
    name: "Ular Tangga ABQ art paper",
    size: "260gr A3+ (32 x 48 cm)",
    pages: "1 Lembar",
    weightGrams: 100,
    sourceWeight: "100gr/buku",
  },
  {
    group: "ABQ",
    name: "Buku Mewarnai ABQ",
    size: "70gr A4 (21 x 29,7 cm)",
    pages: "30 Lembar",
    weightGrams: 200,
    sourceWeight: "200gr/buku",
  },
  {
    group: "ABQ",
    name: "Paket Melingkari",
    size: "70gr A4 (21 x 29,7 cm)",
    pages: "7 Lembar",
    weightGrams: 150,
    sourceWeight: "150gr/buku",
  },
  {
    group: "ABQ",
    name: "Paket Menempel",
    size: "70gr A4 (21 x 29,7 cm)",
    pages: "7 Lembar",
    weightGrams: 150,
    sourceWeight: "150gr/buku",
  },
  {
    group: "ABQ",
    name: "Paket Mencocok",
    size: "70gr A4 (21 x 29,7 cm)",
    pages: "7 Lembar",
    weightGrams: 150,
    sourceWeight: "150gr/buku",
  },
  {
    group: "ABQ",
    name: "Lembar Mewarnai",
    size: "70gr A4 (21 x 29,7 cm)",
    pages: "30 Lembar",
    weightGrams: 210,
    sourceWeight: "210gr/buku",
  },
  {
    group: "ABQ",
    name: "Puzzle Kubus ABQ Bufalo",
    size: "70gr A4 (21 x 29,7 cm)",
    pages: "5 Lembar",
    weightGrams: 150,
    sourceWeight: "150gr/buku",
  },
  {
    group: "ABQ",
    name: "Kartu Baca ABQ",
    size: "14 x 14,8 cm",
    pages: "270 Kartu",
    weightGrams: 1500,
    sourceWeight: "1500gr/buku",
  },
  {
    group: "ABQ",
    name: "Kartu Baca Mini ABQ",
    size: "5,5 x 8,5 cm",
    pages: "49 Kartu",
    weightGrams: 200,
    sourceWeight: "200gr/buku",
  },
  {
    group: "ABQ",
    name: "Paket Poster ABQ",
    size: "260gr A3+ (32 x 48 cm)",
    pages: "11 Lembar",
    weightGrams: 400,
    sourceWeight: "400gr/buku",
  },
  {
    group: "ABQ",
    name: "Alat Peraga ABQ art paper",
    size: "260gr A3+ (32 x 48 cm)",
    pages: "60 Lembar",
    weightGrams: 1400,
    sourceWeight: "1400gr/buku",
  },
  {
    group: "ABQ",
    name: "Alat Peraga ABQ vinyl",
    size: "80 x 100 cm",
    pages: "60 Lembar",
    weightGrams: 7000,
    sourceWeight: "7000gr/buku",
  },
];

/**
 * Resolves a product's package weight in grams from its known name.
 *
 * - Exact (case/space-insensitive) name match → trusted weight.
 * - No exact match → falls back to the median weight of the same product
 *   group (ACM/ABQ), derived solely from the weights already declared in
 *   this file. This keeps the shipping route from hard-failing (HTTP 400)
 *   when a product name drifts from the canonical catalogue name, while
 *   never inventing a weight from outside sources. Callers should surface
 *   `estimated: true` to the client/audit trail.
 */
export function resolveProductWeightGrams(name: string): {
  grams: number;
  estimated: boolean;
} {
  const key = name.trim().toLowerCase();
  const exact = productWeights.find((w) => w.name.trim().toLowerCase() === key);
  if (exact) return { grams: exact.weightGrams, estimated: false };

  const group: ProductWeightGroup = key.includes("abq") ? "ABQ" : "ACM";
  const groupWeights = productWeights
    .filter((w) => w.group === group)
    .map((w) => w.weightGrams)
    .sort((a, b) => a - b);
  const midpoint = groupWeights[Math.floor(groupWeights.length / 2)];
  const median = midpoint ?? 200;
  return { grams: median, estimated: true };
}
