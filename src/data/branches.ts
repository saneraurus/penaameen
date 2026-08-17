// src/data/branches.ts
export interface Branch {
  id: string;
  slug: string;
  region: string;
  city: string;
  address: string; // We'll use placeholder if real data not available
  contact: string; // We'll use placeholder if real data not available
}

export const branches: Branch[] = [
  {
    id: "1",
    slug: "dki-jakarta",
    region: "DKI Jakarta",
    city: "Jakarta",
    address: "[ALAMAT CABANG]",
    contact: "[NOMOR TELEPON]",
  },
  {
    id: "2",
    slug: "jawa-barat",
    region: "Jawa Barat",
    city: "Bandung",
    address: "[ALAMAT CABANG]",
    contact: "[NOMOR TELEPON]",
  },
  {
    id: "3",
    slug: "jawa-timur",
    region: "Jawa Timur",
    city: "Surabaya",
    address: "[ALAMAT CABANG]",
    contact: "[NOMOR TELEPON]",
  },
  {
    id: "4",
    slug: "jawa-tengah",
    region: "Jawa Tengah",
    city: "[NAMA KOTA]",
    address: "[ALAMAT CABANG]",
    contact: "[NOMOR TELEPON]",
  },
  {
    id: "5",
    slug: "sumatera",
    region: "Sumatera",
    city: "[NAMA KOTA]",
    address: "[ALAMAT CABANG]",
    contact: "[NOMOR TELEPON]",
  },
  {
    id: "6",
    slug: "sulawesi",
    region: "Sulawesi",
    city: "[NAMA KOTA]",
    address: "[ALAMAT CABANG]",
    contact: "[NOMOR TELEPON]",
  },
  {
    id: "7",
    slug: "kalimantan",
    region: "Kalimantan",
    city: "[NAMA KOTA]",
    address: "[ALAMAT CABANG]",
    contact: "[NOMOR TELEPON]",
  },
  {
    id: "8",
    slug: "papua",
    region: "Papua",
    city: "[NAMA KOTA]",
    address: "[ALAMAT CABANG]",
    contact: "[NOMOR TELEPON]",
  },
];

export const getBranchesByRegion = (region: string) => {
  return branches.filter(
    (branch) => branch.region.toLowerCase() === region.toLowerCase(),
  );
};

export const getBranchBySlug = (slug: string) => {
  return branches.find((branch) => branch.slug === slug);
};
