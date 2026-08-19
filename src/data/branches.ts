// src/data/branches.ts

export interface BranchOutlet {
  id: string;
  name: string; // e.g. "KINDERHOUSE", "MASJID RAYA PONDOK INDAH", "AZZAHRA, PAUD", "RESELLER AL-BARQY", "Mitra Tebet"
  pic: string; // Penanggung Jawab
  address: string;
  contact: string;
  city: string; // e.g. "Jakarta Barat", "Jakarta Selatan"
  type?: string; // e.g. "Mitra Lembaga", "Perwakilan / Mitra", "Mitra Masjid", "PAUD / Sekolah", "Reseller Resmi"
}

export interface Branch {
  id: string;
  slug: string;
  region: string;
  city: string;
  address: string;
  contact: string;
  isVerified?: boolean;
  outlets?: BranchOutlet[];
}

export const branches: Branch[] = [
  {
    id: "1",
    slug: "dki-jakarta",
    region: "DKI Jakarta",
    city: "Jakarta (Barat & Selatan)",
    address: "Jakarta Barat & Jakarta Selatan (5 Titik Cabang / Mitra Resmi)",
    contact: "087775084244",
    isVerified: true,
    outlets: [
      {
        id: "dki-1",
        name: "KINDERHOUSE",
        pic: "ANINDITYA NAFIANTI / DITA YUSUF",
        address: "Jl. Aster No. 11 Jati Pulo Jakarta Barat",
        contact: "087775084244",
        city: "Jakarta Barat",
        type: "Mitra Lembaga",
      },
      {
        id: "dki-2",
        name: "Mitra Tebet",
        pic: "EDVIN SOFTARINI",
        address: "Jl. Manggarai Utara V No. 08 Tebet Jakarta Selatan",
        contact: "081333316800",
        city: "Jakarta Selatan",
        type: "Perwakilan / Mitra",
      },
      {
        id: "dki-3",
        name: "MASJID RAYA PONDOK INDAH",
        pic: "JUMAL AHMAD",
        address:
          "Jln. Moh. Kahfi No. 02 Gg. Cupang No. 30 Ciganjur - Jagakarsa - Jakarta Selatan 12630",
        contact: "085719647457",
        city: "Jakarta Selatan",
        type: "Mitra Masjid / Lembaga",
      },
      {
        id: "dki-4",
        name: "AZZAHRA, PAUD",
        pic: "NN",
        address:
          "Jl. Tali IX No. 71 RT. 02/09 Bambu Selatan Palmerah - Kota Administrasi Jakarta Barat - DKI Jakarta",
        contact: "08988013437",
        city: "Jakarta Barat",
        type: "PAUD / Sekolah Mitra",
      },
      {
        id: "dki-5",
        name: "RESELLER AL-BARQY",
        pic: "SURYANTO AL BARQY",
        address:
          "d/a Ibu Mega Jl. Kebagusan Raya No. 76 Ruko Mash Refleksi Samping Ruko JNE Depan Taman Spatodea Jagakarsa - Jakarta Selatan",
        contact: "08581023913",
        city: "Jakarta Selatan",
        type: "Reseller Resmi",
      },
    ],
  },
  {
    id: "2",
    slug: "jawa-barat",
    region: "Jawa Barat",
    city: "Bandung, Bekasi, Bogor, Depok, Garut, Subang, Majalengka",
    address:
      "Bandung, Bekasi, Bogor, Depok, Garut, Subang, Majalengka (21 Titik Mitra Terdaftar)",
    contact: "085220091647",
    isVerified: true,
    outlets: [
      // Bandung (7)
      {
        id: "jbr-1",
        name: "Trainer Al-Barqy Situ Aksan",
        pic: "DARIS TAMIN",
        address:
          "Jl. Pagarsih gg Madrasah RT. 05/03 No. 01 Situ Aksan - Bandung",
        contact: "085220091647",
        city: "Bandung",
        type: "Trainer Resmi",
      },
      {
        id: "jbr-2",
        name: "LTQ JULUL QUR'AN AL ISLAMI",
        pic: "Asep Suhermin",
        address: "Pacet Kab Bandung",
        contact: "088809452028",
        city: "Bandung",
        type: "Lembaga Tahfidz & Quran",
      },
      {
        id: "jbr-3",
        name: "Mitra Bandung",
        pic: "Bayti Haridoso",
        address: "Bandung",
        contact: "08122054003",
        city: "Bandung",
        type: "Perwakilan / Pribadi",
      },
      {
        id: "jbr-4",
        name: "PUSDAI BANDUNG",
        pic: "RAHMAT ALAMSYAH, M.Ag",
        address: "Jl. Diponegoro 63 Bandung - Jawa Barat",
        contact: "081910142422",
        city: "Bandung",
        type: "Mitra Dakwah / PUSDAI",
      },
      {
        id: "jbr-5",
        name: "Trainer Al-Barqy Bojongsoang",
        pic: "SUTARYANA, SE",
        address:
          "Komplek Griya Permata Asri Blok A-6 No. 40 RT. 03/13 Ds. Lengkong Kec. Bojongsoang Bandung 40287",
        contact: "082217222120",
        city: "Bandung",
        type: "Trainer Resmi",
      },
      {
        id: "jbr-6",
        name: "Lembaga Kursus Awibitung",
        pic: "LILIS",
        address: "Jl. Awibitung No. 229/143 B Bandung",
        contact: "085324833361",
        city: "Bandung",
        type: "Lembaga Kursus",
      },
      {
        id: "jbr-7",
        name: "BINA UMAT NURUL IMAN",
        pic: "WATI",
        address: "Jl Sri Suci No. 08 RT. 04/06 Bandung 40254",
        contact: "08179228040",
        city: "Bandung",
        type: "Mitra Lembaga",
      },

      // Bekasi (4)
      {
        id: "jbr-8",
        name: "TK AL HIDAYAH",
        pic: "ANIS",
        address: "Jl. Borobudur No. 125 Bendogerit - Sananwetan - Blitar",
        contact: "08563553138",
        city: "Bekasi",
        type: "TK / PAUD Mitra",
      },
      {
        id: "jbr-9",
        name: "TK Karang Bahagia",
        pic: "DAAN DINI / BUNDA HANAN",
        address:
          "Komplek Unilever No. 157 A RT. 01/03 Sukaraya Karang Bahagia 17535, Bekasi Jabar",
        contact: "087741588690",
        city: "Bekasi",
        type: "TK / PAUD Mitra",
      },
      {
        id: "jbr-10",
        name: "TK IT CAHAYA ISLAM",
        pic: "FITRI HARIYANTI",
        address:
          "Perum Puri Mutiara Indah 2, Jl. Cakalang 8 Blok CJ 42 Ds. Karang Raharja Kec. Cikarang Utara Bekasi 17530",
        contact: "081219081800",
        city: "Bekasi",
        type: "TK IT / Sekolah Mitra",
      },
      {
        id: "jbr-11",
        name: "SD ISLAM AL HUSNA",
        pic: "HUSNA",
        address:
          "Jl. Guntur 1 No. 1 Komplek Keuangan Kayuringin Jaya Bekasi Selatan 17148",
        contact: "081298884571",
        city: "Bekasi",
        type: "Sekolah Dasar Islam",
      },

      // Bogor (1)
      {
        id: "jbr-12",
        name: "TAHFIDZ QUR'AN YAYASAN FATHAN MUBINA",
        pic: "TAUFIQ BOGOR",
        address:
          "Ds. Bojongkulur RT. 3/3 gg H Noing Bin Saboih Gunung Putri - Bogor",
        contact: "08128610732",
        city: "Bogor",
        type: "Yayasan / Tahfidz Quran",
      },

      // Banten (1)
      {
        id: "jbr-13",
        name: "PONPES DAR EL QOMAR",
        pic: "MUBAROK",
        address:
          "Jln. Mayabon Polda Banten Cipocok Jaya Kota Serang - Banten",
        contact: "081911135011",
        city: "Banten",
        type: "Pondok Pesantren",
      },

      // Depok (5)
      {
        id: "jbr-14",
        name: "PONPES TAHFIDZ ARRAHMAN",
        pic: "FATHURRAHMAN",
        address:
          "Jl. Pendowo Lapangan Bola Relis No. 188 RT. 09/09 Limo - Depok",
        contact: "081380773828",
        city: "Depok",
        type: "Pondok Pesantren Tahfidz",
      },
      {
        id: "jbr-15",
        name: "YAYASAN ASSALAM",
        pic: "H. FAISAL AGUS",
        address: "Jl. Pitara No. 03 RT. 01/16 Pancoran Mas - Depok 16436",
        contact: "085959507932",
        city: "Depok",
        type: "Yayasan Mitra",
      },
      {
        id: "jbr-16",
        name: "Mitra Cilodong Depok",
        pic: "MUJIATI",
        address:
          "Perum Taman Anyelir 2 Blok G1 No. 05 RT. 03/10 Kebon Duren - Kalimulya - Cilodong - Depok Jabar",
        contact: "081280838850",
        city: "Depok",
        type: "Perwakilan / Mitra",
      },
      {
        id: "jbr-17",
        name: "Mitra Sukmajaya Depok",
        pic: "SHASA",
        address:
          "Jl. Haji Japat No. 478 Abadijaya Sukmajaya - Depok (Depan Warung Bakso H. Suparno)",
        contact: "083878444729",
        city: "Depok",
        type: "Perwakilan / Mitra",
      },
      {
        id: "jbr-18",
        name: "Lembaga Kursus Studio Alam",
        pic: "UPIK ANDAYANI",
        address:
          "Perum Studio Alam Indah Blok E1/3-4 Jl. Raden Saleh Sukmajaya Depok 16412",
        contact: "085717858555",
        city: "Depok",
        type: "Lembaga Kursus",
      },

      // Garut (1)
      {
        id: "jbr-19",
        name: "SDITQ AL FURQAN",
        pic: "HERI RAHMAT S",
        address:
          "Kp Simarasa 1/6 Ds. Cibiuk Kaler Kec. Cibiuk Garut - Jawa Barat",
        contact: "085295264746",
        city: "Garut",
        type: "SDITQ / Sekolah Quran",
      },

      // Subang (1)
      {
        id: "jbr-20",
        name: "PONPES RAHMATIKA AL-ATASARI",
        pic: "ABU SYAIMAH M IQBAL",
        address:
          "Jl. Raya Dayeuhkolot RT 05/02 Kec. Sagalaherang Subang - Jawa Barat 41282",
        contact: "082295016446",
        city: "Subang",
        type: "Pondok Pesantren",
      },

      // Majalengka (1)
      {
        id: "jbr-21",
        name: "Mitra Sekolah Leuwimunding",
        pic: "IKAH ATIKAH, S.Pd.I",
        address:
          "Jl. Pekauman RT. 01/06 Blok Jum'at Kulon Ds. Leuwimunding Kec. Leuwimunding - Majalengka - Jawa Barat",
        contact: "082316425773",
        city: "Majalengka",
        type: "Sekolah / Mitra Pendidik",
      },
    ],
  },
  {
    id: "3",
    slug: "jawa-timur",
    region: "Jawa Timur",
    city: "Surabaya",
    address: "GRAHA AL BARQY Jl. Gayungsari 1A Surabaya, Jawa Timur",
    contact: "082231239158",
    isVerified: true,
  },
  {
    id: "4",
    slug: "jawa-tengah",
    region: "Jawa Tengah",
    city: "Semarang / Surakarta",
    address: "[ALAMAT CABANG]",
    contact: "[NOMOR TELEPON]",
  },
  {
    id: "5",
    slug: "sumatera",
    region: "Sumatera",
    city: "Medan / Palembang",
    address: "[ALAMAT CABANG]",
    contact: "[NOMOR TELEPON]",
  },
  {
    id: "6",
    slug: "sulawesi",
    region: "Sulawesi",
    city: "Makassar",
    address: "[ALAMAT CABANG]",
    contact: "[NOMOR TELEPON]",
  },
  {
    id: "7",
    slug: "kalimantan",
    region: "Kalimantan",
    city: "Balikpapan / Banjarmasin",
    address: "[ALAMAT CABANG]",
    contact: "[NOMOR TELEPON]",
  },
  {
    id: "8",
    slug: "papua",
    region: "Papua",
    city: "Jayapura",
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
