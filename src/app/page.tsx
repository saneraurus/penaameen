import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

import { Reveal } from "@/components/motion/Reveal";
import { HeroSection } from "@/components/sections/HeroSection";
import {
  CinematicScene,
  EditorialFigure,
  PullQuote,
  SplitScene,
} from "@/components/story/StoryScene";
import {
  ActionLink,
  Eyebrow,
  Lede,
  SceneIndex,
  Section,
  SectionHeading,
  Shell,
  TextLink,
} from "@/components/ui/primitives";

// Below-the-fold interactive scenes stay dynamically imported to protect TBT.
const LearningJourneySection = dynamic(
  () =>
    import("@/components/sections/LearningJourneySection").then(
      (m) => m.LearningJourneySection,
    ),
  { ssr: true },
);

const TestimonialsSection = dynamic(
  () =>
    import("@/components/sections/TestimonialsSection").then(
      (m) => m.TestimonialsSection,
    ),
  { ssr: true },
);

const FeaturedProductSection = dynamic(
  () =>
    import("@/components/sections/FeaturedProductSection").then(
      (m) => m.FeaturedProductSection,
    ),
  { ssr: true },
);

const ProductCatalogSection = dynamic(
  () =>
    import("@/components/sections/ProductCatalogSection").then(
      (m) => m.ProductCatalogSection,
    ),
  { ssr: true },
);

const articles = [
  {
    slug: "belajar-cepat-mengaji-untuk-anak",
    title:
      "Belajar Cepat Mengaji untuk Anak: Kunci Konsistensi 15 Menit Sehari",
    category: "Tips Belajar",
    image: "/images/penaameen/editorial/anak-belajar-mengaji.jpg",
    date: "12 Januari 2026",
    readTime: "5 min read",
    excerpt:
      "Panduan mendampingi anak belajar membaca Al-Qur'an di rumah tanpa rasa bosan dan tanpa paksaan melalui pendekatan fonetik alami.",
  },
  {
    slug: "metode-albarqy-anti-lupa",
    title: "Mengenal Formula Kata Bunyi Anti-Lupa pada Metode AL-BARQY",
    category: "Metode Al-Qur'an",
    image: "/images/penaameen/methods/logoantilupa.png",
    date: "10 Januari 2026",
    readTime: "6 min read",
    excerpt:
      "Mengapa rumus kata kunci A-DA-RA-JA mampu mengunci ingatan membaca Al-Qur'an seumur hidup hanya dalam 200 menit.",
  },
  {
    slug: "keunggulan-metode-acm",
    title: "Mengapa Metode ACM Efektif Mengajarkan Anak Membaca Tanpa Mengeja",
    category: "Literasi Anak",
    image: "/images/penaameen/methods/albarqy.png",
    date: "8 Januari 2026",
    readTime: "4 min read",
    excerpt:
      "Ulasan ilmiah mengapa menghafal abjad A–Z di awal memperlambat kemampuan membaca anak dan bagaimana ACM mengatasinya.",
  },
] as const;

/** Audiences the catalogue already serves. Copy and imagery are existing. */
const audiences = [
  {
    title: "Anak Usia Dini (PAUD/TK)",
    description: "Lancar membaca huruf Latin tanpa mengeja dan bebas stres.",
    image: "/images/penaameen/products/aktivitas.jpg",
    badge: "Metode ACM",
  },
  {
    title: "Orang Tua di Rumah",
    description: "Modul pendampingan mandiri praktis 15 menit per hari.",
    image: "/images/penaameen/products/home-learning.jpg",
    badge: "Home Learning",
  },
  {
    title: "Guru & Pengajar TPQ",
    description:
      "Perangkat peraga klasikal dinding dan panduan kurikulum kelas.",
    image: "/images/penaameen/products/flashcard.jpg",
    badge: "Alat Peraga Guru",
  },
  {
    title: "Remaja, Dewasa & Mualaf",
    description: "Kuasai membaca Al-Qur'an tartil dalam 200 menit tuntas.",
    image: "/images/penaameen/products/poster.jpg",
    badge: "Al-Barqy 200 Menit",
  },
] as const;

export default function HomePage() {
  return (
    <div className="bg-background-50 text-supporting-900">
      <HeroSection />

      <CinematicScene
        image="/images/penaameen/editorial/anak-belajar-mengaji.jpg"
        imageAlt="Suasana belajar mengaji dan membaca bersama keluarga Penerbit Pena Ameen"
        height="medium"
        overlay="soft"
        eyebrow={
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-300">
            Sejak 1995
          </span>
        }
        headline={
          <>
            Belajar membaca.
            <span className="block text-accent-200">Tanpa mengenal usia.</span>
          </>
        }
        body={
          <p>
            Penerbit resmi metode AL-BARQY dan ACM — mendampingi anak, orang
            tua, guru, dan siapa pun yang ingin mulai membaca hari ini.
          </p>
        }
        actions={
          <>
            <ActionLink href="/metode" tone="inverse" size="lg">
              Pelajari 2 Metode Unggulan
            </ActionLink>
            <ActionLink
              href="/tentang"
              tone="ghost"
              size="lg"
              className="text-background-100 hover:text-white"
            >
              Kenali Profil Lengkap
            </ActionLink>
          </>
        }
      />

      {/* SCENE 03 — Manifesto */}
      <Section tone="paper">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Reveal variant="micro">
              <SceneIndex index="01" label="Tentang Pena Ameen" />
            </Reveal>
            <Reveal variant="medium" delay={0.06}>
              <SectionHeading className="mt-6">
                Metode yang menemani, bukan menuntut.
              </SectionHeading>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal variant="small" delay={0.1}>
              <Lede>
                PENA AMEEN menerbitkan metode <strong>AL-BARQY</strong> (Cepat
                Baca Al-Qur&apos;an 200 Menit Anti-Lupa) dan{" "}
                <strong>ACM</strong> (Aku Cepat Membaca Tanpa Mengeja).
              </Lede>
            </Reveal>
            <Reveal variant="small" delay={0.16}>
              <p className="mt-6 text-measure leading-relaxed text-supporting-600">
                Kami telah mendampingi lebih dari 8.000+ keluarga dan 500+
                TPQ/sekolah di Indonesia dan Asia Tenggara.
              </p>
            </Reveal>
            <Reveal variant="small" delay={0.22}>
              <div className="mt-10">
                <TextLink href="/tentang">Kenali profil lengkap</TextLink>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* SCENE 04 — Editorial pillars */}
      <Section tone="canvas" tight>
        <div className="border-y border-supporting-200">
          <div className="grid md:grid-cols-3">
            {[
              {
                index: "01",
                title: "Formula Fonetik Anti-Lupa",
                desc: "Mengunci ingatan jangka panjang melalui asosiasi bunyi kata alami bahasa Indonesia.",
              },
              {
                index: "02",
                title: "15–20 Menit Sehari di Rumah",
                desc: "Pendampingan mandiri yang menyenangkan tanpa stres dan tanpa paksaan.",
              },
              {
                index: "03",
                title: "30+ Tahun Teruji & Bersertifikasi",
                desc: "Standar kurikulum resmi ratusan lembaga TPQ, sekolah dasar, dan program literasi.",
              },
            ].map((pillar) => (
              <Reveal
                key={pillar.title}
                variant="small"
                className="border-supporting-200 px-6 py-10 md:border-r md:last:border-r-0"
              >
                <div>
                  <span className="scene-index">{pillar.index}</span>
                  <h3 className="mt-5 text-lg font-medium text-supporting-900">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-supporting-600">
                    {pillar.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <SplitScene
        image="/images/penaameen/methods/method-albarqy.jpg"
        imageAlt="Santri dan murid belajar membaca Al-Qur'an dengan metode Al-Barqy anti lupa"
        ratio="portrait"
        tone="paper"
        eyebrow={<SceneIndex index="02" label="Metode Al-Barqy" />}
        headline={
          <>
            200 menit untuk membaca
            <span className="block text-accent-700">seumur hidup.</span>
          </>
        }
        actions={
          <>
            <ActionLink href="/metode/al-barqy" tone="ink">
              Metode Al-Barqy
            </ActionLink>
            <TextLink href="/produk">Lihat paket terkait</TextLink>
          </>
        }
      >
        <p>
          Formula fonetik kata kunci A-DA-RA-JA mengunci ingatan tanpa mengeja
          huruf satu per satu — untuk anak hingga dewasa.
        </p>
      </SplitScene>

      <SplitScene
        image="/images/penaameen/methods/method-acm.jpg"
        imageAlt="Anak-anak antusias belajar membaca dengan buku dan materi metode ACM"
        ratio="portrait"
        tone="canvas"
        reverse
        eyebrow={<SceneIndex index="03" label="Metode ACM" />}
        headline={
          <>
            Membaca kata utuh,
            <span className="block text-accent-700">tanpa mengeja.</span>
          </>
        }
        actions={
          <>
            <ActionLink href="/metode/acm" tone="ink">
              Metode ACM
            </ActionLink>
            <TextLink href="/produk">Lihat produk ACM</TextLink>
          </>
        }
      >
        <p>
          Berbasis kata lembaga dan lagu edukatif ceria, dirancang untuk PAUD,
          TK, SD awal, hingga anak berkebutuhan khusus.
        </p>
      </SplitScene>

      <LearningJourneySection />

      <Section tone="paper">
        <div className="max-w-2xl">
          <Reveal variant="micro">
            <SceneIndex index="04" label="Untuk Siapa" />
          </Reveal>
          <Reveal variant="medium" delay={0.06}>
            <SectionHeading className="mt-6">
              Satu ekosistem, banyak titik mulai.
            </SectionHeading>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((item, index) => (
            <Reveal key={item.title} variant="small" delay={index * 0.07}>
              <Link href="/produk" className="group block">
                <div className="image-frame image-frame-zoom aspect-[3/4] w-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-700">
                  {item.badge}
                </p>
                <h3 className="mt-2 text-[15px] font-medium leading-snug text-supporting-900 transition-colors group-hover:text-accent-700">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-supporting-600">
                  {item.description}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <FeaturedProductSection />

      <ProductCatalogSection />

      <TestimonialsSection />

      <Section tone="canvas">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Reveal variant="micro">
              <SceneIndex index="05" label="Galeri Kegiatan" />
            </Reveal>
            <Reveal variant="medium" delay={0.06}>
              <SectionHeading className="mt-6">
                Pelatihan, workshop, dan kelas yang terus berjalan.
              </SectionHeading>
            </Reveal>
          </div>
          <Reveal variant="small" delay={0.12}>
            <TextLink href="/galeri-kegiatan">Lihat seluruh galeri</TextLink>
          </Reveal>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-0 border border-supporting-200 md:grid-cols-4">
          {[
            {
              src: "/images/penaameen/gallery/kegiatan-01.jpg",
              ratio: "square" as const,
            },
            {
              src: "/images/penaameen/gallery/kegiatan-04.jpg",
              ratio: "square" as const,
            },
            {
              src: "/images/penaameen/gallery/kegiatan-09.jpg",
              ratio: "square" as const,
            },
            {
              src: "/images/penaameen/gallery/kegiatan-14.jpg",
              ratio: "square" as const,
            },
          ].map((item, index) => (
            <Reveal
              key={item.src}
              variant="small"
              delay={index * 0.06}
              className="border-supporting-200 [&:nth-child(odd)]:border-r md:[&:nth-child(2)]:border-r"
            >
              <EditorialFigure
                image={item.src}
                imageAlt="Dokumentasi kegiatan dan pelatihan PENA AMEEN"
                ratio={item.ratio}
                sizes="(max-width: 768px) 50vw, 25vw"
                className="rounded-none"
              />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="paper" tight>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8 lg:col-start-3">
            <PullQuote
              quote="Belajar membaca bukan perlombaan. Ia perjalanan yang boleh dimulai kapan saja."
              attribution="Manifesto Pena Ameen"
            />
          </div>
        </div>
      </Section>

      <Section tone="canvas">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Reveal variant="micro">
              <SceneIndex index="06" label="Wawasan" />
            </Reveal>
            <Reveal variant="medium" delay={0.06}>
              <SectionHeading className="mt-6">
                Catatan untuk pendamping belajar.
              </SectionHeading>
            </Reveal>
          </div>
          <Reveal variant="small" delay={0.12}>
            <TextLink href="/artikel">Semua artikel</TextLink>
          </Reveal>
        </div>
        <div className="mt-14">
          <div className="grid gap-0 divide-y divide-supporting-200 border-y border-supporting-200 md:grid-cols-3 md:divide-x md:divide-y-0">
            {articles.map((article, index) => (
              <Reveal
                key={article.slug}
                variant="small"
                delay={index * 0.07}
                className="py-8 md:px-6 md:py-10 md:first:pl-0 md:last:pr-0"
              >
                <article>
                  <Link
                    href={`/artikel/${article.slug}`}
                    className="group block"
                  >
                    <div className="image-frame image-frame-zoom aspect-[4/3] w-full">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <p className="meta-type mt-5">
                      {article.category} · {article.readTime}
                    </p>
                    <h3 className="mt-3 text-[17px] font-medium leading-snug text-supporting-900 transition-colors group-hover:text-accent-700">
                      {article.title}
                    </h3>
                    <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-supporting-600">
                      {article.excerpt}
                    </p>
                    <p className="mt-4 text-[11px] text-supporting-400">
                      {article.date}
                    </p>
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <section className="relative isolate overflow-hidden bg-primary-950 py-24 text-background-50 sm:py-32">
        <div className="absolute inset-0 opacity-25">
          <Image
            src="/images/penaameen/editorial/editorial-family-bonding.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          className="absolute inset-0 bg-primary-950/70"
          aria-hidden="true"
        />
        <Shell className="relative z-10 text-center">
          <Reveal variant="micro">
            <Eyebrow className="justify-center text-background-300">
              Mulai hari ini
            </Eyebrow>
          </Reveal>
          <Reveal variant="large" delay={0.06}>
            <p className="display-type mx-auto mt-6 max-w-3xl text-background-50">
              Tidak ada yang terlambat untuk mulai membaca.
            </p>
          </Reveal>
          <Reveal variant="small" delay={0.14}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ActionLink href="/produk" tone="inverse" size="lg">
                Jelajahi Paket &amp; Produk
              </ActionLink>
              <ActionLink
                href="/kontak"
                tone="ghost"
                size="lg"
                className="text-background-100 hover:text-white"
              >
                Bicara dengan tim kami
              </ActionLink>
            </div>
          </Reveal>
        </Shell>
      </section>
    </div>
  );
}
