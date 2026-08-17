import type { Metadata } from "next";
import GaleriKegiatanPage from "./page";

export const metadata: Metadata = {
  title: "Galeri Kegiatan | PENA AMEEN",
  description:
    "Dokumentasi foto kegiatan PENA AMEEN — pelatihan guru Al-Barqy, workshop nasional, dan kegiatan komunitas belajar Al-Qur'an di seluruh Indonesia sejak 1995.",
  openGraph: {
    title: "Galeri Kegiatan PENA AMEEN",
    description:
      "Foto dokumentasi kegiatan pelatihan, workshop, dan komunitas belajar Al-Qur'an PENA AMEEN.",
    images: ["/images/penaameen/gallery/kegiatan-01.jpg"],
  },
  alternates: {
    canonical: "/galeri-kegiatan",
  },
};

export default function GaleriKegiatanLayout() {
  return <GaleriKegiatanPage />;
}
