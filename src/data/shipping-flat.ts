/**
 * Flat shipping rates from Surabaya.
 *
 * Admin: edit this table directly to tune pricing.
 * Matching order: exact city → province → fallback default.
 * The first match wins.
 */

export interface FlatRateEntry {
  city?: string;
  province?: string;
  label: string;
  cost: number;
  etd: string;
}

export const FLAT_SHIPPING_RATES: FlatRateEntry[] = [
  // Exact city overrides
  {
    city: "Surabaya",
    province: "Jawa Timur",
    label: "Surabaya",
    cost: 15000,
    etd: "1 hari",
  },
  {
    city: "Sidoarjo",
    province: "Jawa Timur",
    label: "Sidoarjo",
    cost: 18000,
    etd: "1-2 hari",
  },
  {
    city: "Gresik",
    province: "Jawa Timur",
    label: "Gresik",
    cost: 20000,
    etd: "1-2 hari",
  },
  {
    city: "Malang",
    province: "Jawa Timur",
    label: "Malang",
    cost: 25000,
    etd: "1-2 hari",
  },
  {
    city: "Pasuruan",
    province: "Jawa Timur",
    label: "Pasuruan",
    cost: 25000,
    etd: "1-2 hari",
  },
  {
    city: "Probolinggo",
    province: "Jawa Timur",
    label: "Probolinggo",
    cost: 30000,
    etd: "2-3 hari",
  },
  {
    city: "Banyuwangi",
    province: "Jawa Timur",
    label: "Banyuwangi",
    cost: 40000,
    etd: "2-4 hari",
  },

  // Province-wide fallbacks (exact match on province)
  { province: "Jawa Timur", label: "Jawa Timur", cost: 35000, etd: "2-4 hari" },
  {
    province: "Jawa Tengah",
    label: "Jawa Tengah",
    cost: 40000,
    etd: "2-4 hari",
  },
  { province: "Jawa Barat", label: "Jawa Barat", cost: 45000, etd: "2-4 hari" },
  {
    province: "DI Yogyakarta",
    label: "DI Yogyakarta",
    cost: 40000,
    etd: "2-4 hari",
  },
  { province: "Banten", label: "Banten", cost: 45000, etd: "2-4 hari" },
  { province: "Bali", label: "Bali", cost: 50000, etd: "2-4 hari" },
  { province: "NTT", label: "NTT", cost: 80000, etd: "3-6 hari" },
  { province: "NTB", label: "NTB", cost: 70000, etd: "3-6 hari" },
  {
    province: "Sumatera Utara",
    label: "Sumatera Utara",
    cost: 70000,
    etd: "3-5 hari",
  },
  {
    province: "Sumatera Barat",
    label: "Sumatera Barat",
    cost: 80000,
    etd: "3-6 hari",
  },
  { province: "Riau", label: "Riau", cost: 75000, etd: "3-5 hari" },
  {
    province: "Kepulauan Riau",
    label: "Kepulauan Riau",
    cost: 85000,
    etd: "3-6 hari",
  },
  {
    province: "Sumatera Selatan",
    label: "Sumatera Selatan",
    cost: 80000,
    etd: "3-6 hari",
  },
  { province: "Lampung", label: "Lampung", cost: 70000, etd: "3-5 hari" },
  {
    province: "Kalimantan Timur",
    label: "Kalimantan Timur",
    cost: 90000,
    etd: "3-6 hari",
  },
  {
    province: "Kalimantan Selatan",
    label: "Kalimantan Selatan",
    cost: 100000,
    etd: "3-7 hari",
  },
  {
    province: "Kalimantan Tengah",
    label: "Kalimantan Tengah",
    cost: 100000,
    etd: "3-7 hari",
  },
  {
    province: "Kalimantan Utara",
    label: "Kalimantan Utara",
    cost: 110000,
    etd: "4-7 hari",
  },
  {
    province: "Kalimantan Barat",
    label: "Kalimantan Barat",
    cost: 110000,
    etd: "4-7 hari",
  },
  {
    province: "Sulawesi Selatan",
    label: "Sulawesi Selatan",
    cost: 90000,
    etd: "3-6 hari",
  },
  {
    province: "Sulawesi Utara",
    label: "Sulawesi Utara",
    cost: 120000,
    etd: "4-7 hari",
  },
  {
    province: "Sulawesi Tengah",
    label: "Sulawesi Tengah",
    cost: 120000,
    etd: "4-7 hari",
  },
  {
    province: "Sulawesi Barat",
    label: "Sulawesi Barat",
    cost: 130000,
    etd: "4-7 hari",
  },
  { province: "Gorontalo", label: "Gorontalo", cost: 130000, etd: "4-7 hari" },
  {
    province: "Sulawesi Tenggara",
    label: "Sulawesi Tenggara",
    cost: 130000,
    etd: "4-7 hari",
  },
  { province: "Maluku", label: "Maluku", cost: 140000, etd: "5-8 hari" },
  {
    province: "Maluku Utara",
    label: "Maluku Utara",
    cost: 150000,
    etd: "5-8 hari",
  },
  { province: "Papua", label: "Papua", cost: 180000, etd: "5-10 hari" },
  {
    province: "Papua Barat",
    label: "Papua Barat",
    cost: 180000,
    etd: "5-10 hari",
  },
  {
    province: "Papua Selatan",
    label: "Papua Selatan",
    cost: 190000,
    etd: "5-10 hari",
  },
  {
    province: "Papua Tengah",
    label: "Papua Tengah",
    cost: 190000,
    etd: "5-10 hari",
  },
  {
    province: "Papua Pegunungan",
    label: "Papua Pegunungan",
    cost: 200000,
    etd: "6-10 hari",
  },
  { province: "Aceh", label: "Aceh", cost: 90000, etd: "3-6 hari" },

  // Default fallback if nothing matches
  { label: "Indonesia", cost: 150000, etd: "estimasi 5-10 hari" },
];

export function resolveFlatShippingRate(city?: string, province?: string) {
  const normalizedCity = city?.trim() ?? "";
  const normalizedProvince = province?.trim() ?? "";

  const entry =
    FLAT_SHIPPING_RATES.find(
      (r) =>
        r.city &&
        normalizedCity &&
        r.city.toLowerCase() === normalizedCity.toLowerCase() &&
        (!r.province ||
          !normalizedProvince ||
          r.province.toLowerCase() === normalizedProvince.toLowerCase()),
    ) ||
    FLAT_SHIPPING_RATES.find(
      (r) =>
        r.province &&
        normalizedProvince &&
        r.province.toLowerCase() === normalizedProvince.toLowerCase(),
    ) ||
    FLAT_SHIPPING_RATES.find((r) => r.label === "Indonesia");

  if (!entry) {
    return {
      courier: "manual-flat",
      courierName: "Ongkir Flat",
      service: "Flat Rate",
      description: "Tarif tetap dari Surabaya",
      cost: 150000,
      etd: "estimasi 5-10 hari",
      note: "estimasi",
    };
  }

  return {
    courier: "manual-flat",
    courierName: "Ongkir Flat",
    service: entry.label,
    description: `Tarif tetap dari Surabaya ke ${entry.label}`,
    cost: entry.cost,
    etd: entry.etd,
    note: "flat",
  };
}
