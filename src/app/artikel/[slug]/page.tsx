// src/app/artikel/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getArticleBySlug, getArticles } from "@/lib/content";
import { products } from "@/data/products";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading, Shell, ActionLink } from "@/components/ui/primitives";

// Rendered at request time: queries the database, so it must not be
// statically prerendered at build.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artikel Edukasi | Penerbit Pena Ameen",
    };
  }

  const siteUrl = "https://penaameen.com";
  const ogImage = article.image.startsWith("http")
    ? article.image
    : `${siteUrl}${article.image}`;

  return {
    title: `${article.title} | Penerbit Pena Ameen`,
    description: article.excerpt,
    keywords: [
      "metode albarqy",
      "albarqy 200 menit",
      "metode albarqy anti lupa",
      "belajar membaca alquran",
      "kh muhadjir sulthon",
      "penerbit pena ameen",
      article.category,
    ],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      authors: ["Penerbit Pena Ameen"],
      images: [
        {
          url: ogImage,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [ogImage],
    },
  };
}

function ArticleBodyRenderer({ content }: { content: string }) {
  // Split into paragraphs by double newlines
  const paragraphs = content.split(/\n\n+/);

  return (
    <div className="space-y-6 text-[1.0625rem] leading-[1.85] text-supporting-700 sm:text-lg">
      {paragraphs.map((p, idx) => {
        const trimmed = p.trim();
        if (!trimmed) return null;

        // 1. Major section headings (e.g., "1. Latar Belakang...", "2. Mengapa...", "Kesimpulan")
        const isMajorHeading = /^(\d+\.\s+[^\n]+|Kesimpulan.*)$/.test(trimmed);
        if (isMajorHeading) {
          return (
            <div key={idx} className="pt-8 pb-2 first:pt-0">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary-950 tracking-tight leading-snug">
                {trimmed}
              </h2>
              <div className="mt-3 h-1 w-16 rounded-full bg-primary-600" />
            </div>
          );
        }

        // 2. Quranic verses or Blockquotes
        if (
          trimmed.includes("QS. Al-Qamar") ||
          (trimmed.startsWith('"') && trimmed.endsWith('"'))
        ) {
          return (
            <blockquote
              key={idx}
              className="my-8 rounded-2xl border-l-4 border-primary-700 bg-primary-50/70 p-6 sm:p-8 text-primary-950 font-serif italic text-lg sm:text-xl leading-relaxed shadow-2xs"
            >
              <p>{trimmed}</p>
            </blockquote>
          );
        }

        // 3. Paragraph with FAQ format (• T: ... and J: ...)
        if (trimmed.includes("• T:") || trimmed.includes("T:")) {
          const lines = trimmed.split("\n");
          return (
            <div key={idx} className="space-y-4 my-6">
              {lines.map((line, lIdx) => {
                const cleanLine = line.trim();
                if (
                  cleanLine.startsWith("• T:") ||
                  cleanLine.startsWith("T:")
                ) {
                  const question = cleanLine.replace(/^[•\s]*T:\s*/, "");
                  return (
                    <div
                      key={lIdx}
                      className="rounded-t-2xl border border-primary-200 bg-primary-50/60 p-5"
                    >
                      <h3 className="font-serif font-bold text-primary-950 text-base sm:text-lg flex items-start gap-2">
                        <span className="text-primary-700 font-bold">Q:</span>
                        <span>{question}</span>
                      </h3>
                    </div>
                  );
                } else if (cleanLine.startsWith("J:")) {
                  const answer = cleanLine.replace(/^J:\s*/, "");
                  return (
                    <div
                      key={lIdx}
                      className="-mt-4 mb-4 rounded-b-2xl border-x border-b border-primary-200 bg-white p-5 pl-8 text-supporting-700 text-sm sm:text-base leading-relaxed"
                    >
                      <p>
                        <strong className="text-primary-900 font-medium">
                          Jawaban:{" "}
                        </strong>
                        {answer}
                      </p>
                    </div>
                  );
                } else {
                  return (
                    <p key={lIdx} className="text-supporting-700">
                      {cleanLine}
                    </p>
                  );
                }
              })}
            </div>
          );
        }

        // 4. Bullet lists (• ...)
        if (trimmed.includes("\n•") || trimmed.startsWith("•")) {
          const lines = trimmed.split("\n");
          return (
            <div
              key={idx}
              className="my-5 rounded-2xl border border-supporting-200 bg-white p-6 sm:p-7 shadow-2xs space-y-3"
            >
              {lines.map((line, lIdx) => {
                const cleanLine = line.trim();
                if (cleanLine.startsWith("•")) {
                  const text = cleanLine.replace(/^•\s*/, "");
                  return (
                    <div key={lIdx} className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-primary-600 flex-shrink-0" />
                      <span className="text-supporting-700 text-sm sm:text-base leading-relaxed">
                        {text}
                      </span>
                    </div>
                  );
                }
                return (
                  <p
                    key={lIdx}
                    className="font-semibold text-primary-950 text-base mb-1"
                  >
                    {cleanLine}
                  </p>
                );
              })}
            </div>
          );
        }

        // 5. Numbered sub-list items (1. ..., 2. ...)
        if (/^\d+\.\s+/.test(trimmed) && trimmed.includes("\n")) {
          const lines = trimmed.split("\n");
          return (
            <div key={idx} className="my-5 space-y-3">
              {lines.map((line, lIdx) => {
                const cleanLine = line.trim();
                const match = cleanLine.match(/^(\d+)\.\s+(.*)$/);
                if (match) {
                  return (
                    <div
                      key={lIdx}
                      className="flex items-start gap-3.5 rounded-xl border border-supporting-200 bg-supporting-50/50 p-4 sm:p-5"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-700 text-white font-bold text-xs flex-shrink-0 mt-0.5 shadow-2xs">
                        {match[1]}
                      </span>
                      <span className="text-supporting-700 text-sm sm:text-base leading-relaxed">
                        {match[2]}
                      </span>
                    </div>
                  );
                }
                return (
                  <p
                    key={lIdx}
                    className="text-supporting-700 pl-10 text-sm sm:text-base"
                  >
                    {cleanLine}
                  </p>
                );
              })}
            </div>
          );
        }

        // 6. Regular paragraph
        return (
          <p key={idx} className="text-supporting-700 leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = (await getArticles())
    .filter((a) => a.id !== article.id)
    .slice(0, 2);

  // Contextual related products for Al-Barqy or ACM
  const isAlBarqy =
    slug.includes("albarqy") ||
    slug.includes("mengaji") ||
    article.category.toLowerCase().includes("metode");

  const recommendedProductSlugs = isAlBarqy
    ? [
        "paket-albarqy-200-menit",
        "paket-flashcard-albarqy",
        "paket-poster-albarqy",
      ]
    : ["paket-home-learning-acm", "paket-buku-metode-belajar-membaca-acm-3"];

  const recommendedProducts = products.filter((p) =>
    recommendedProductSlugs.includes(p.slug),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Organization",
      name: "Litbang Penerbit Pena Ameen",
      url: "https://penaameen.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Penerbit Pena Ameen",
      logo: {
        "@type": "ImageObject",
        url: "https://penaameen.com/images/penaameen/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://penaameen.com/artikel/${article.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-background-50">
      {/* Structured Data JSON-LD for Google SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="border-b border-supporting-200 bg-white">
        <Shell className="py-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs text-supporting-500">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-primary-900"
                >
                  Beranda
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/artikel"
                  className="transition-colors hover:text-primary-900"
                >
                  Artikel
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li
                className="font-semibold text-primary-900 truncate max-w-xs sm:max-w-md"
                aria-current="page"
              >
                {article.title}
              </li>
            </ol>
          </nav>
        </Shell>
      </div>

      <article>
        {/* Editorial Masthead */}
        <header>
          <Shell className="pb-10 pt-12 sm:pb-14 sm:pt-16">
            <div className="mx-auto max-w-4xl text-center">
              <Reveal variant="micro">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-800">
                  <span>{article.category}</span>
                  <span aria-hidden="true">•</span>
                  <span>{article.readTime} Menit Baca</span>
                  <span aria-hidden="true">•</span>
                  <span>{article.date}</span>
                </div>
              </Reveal>

              <Reveal variant="large" delay={0.05}>
                <h1 className="display-type mt-6 text-[clamp(2rem,4.5vw,3.5rem)] font-serif font-bold text-primary-950 leading-tight">
                  {article.title}
                </h1>
              </Reveal>

              {article.excerpt ? (
                <Reveal variant="medium" delay={0.1}>
                  <p className="lede mx-auto mt-6 max-w-2xl text-supporting-600 leading-relaxed text-base sm:text-lg">
                    {article.excerpt}
                  </p>
                </Reveal>
              ) : null}
            </div>
          </Shell>

          {article.image && (
            <Reveal variant="medium" delay={0.1}>
              <div className="container-wide">
                <div className="image-frame aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-md">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    priority
                    unoptimized
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </Reveal>
          )}
        </header>

        {/* Reading column */}
        <div className="container-narrow py-12 sm:py-16">
          <Reveal variant="small">
            <ArticleBodyRenderer content={article.content} />
          </Reveal>

          {/* Author & Editorial Attribution Box */}
          <div className="mt-14 rounded-3xl border border-primary-200 bg-primary-50/50 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-700 text-white font-serif font-bold text-2xl flex-shrink-0 shadow-sm">
                PA
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-700">
                  Ditinjau &amp; Diterbitkan Oleh
                </span>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-primary-950">
                  Tim Litbang Penerbit Pena Ameen (Ameen Educare)
                </h2>
                <p className="text-xs sm:text-sm text-supporting-600 leading-relaxed">
                  Penerbit resmi metode revolusioner AL-BARQY (KH. Muhadjir
                  Sulthon) dan ACM (Aku Cepat Membaca) sejak 1995. Kantor Pusat:
                  Graha Al-Barqy, Jl. Gayungsari 1A Surabaya.
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Learning Packages CTA Card */}
          {recommendedProducts.length > 0 && (
            <section className="mt-14 rounded-3xl border border-supporting-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
                    Modul Pembelajaran Resmi
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary-950 mt-2">
                    Mulai Belajar dengan Perangkat Orisinal
                  </h2>
                </div>
                {isAlBarqy && (
                  <ActionLink href="/metode/al-barqy" tone="ghost" size="sm">
                    Pelajari Metodologi Lengkap ↗
                  </ActionLink>
                )}
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                {recommendedProducts.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/produk/${prod.slug}`}
                    className="group rounded-2xl border border-supporting-200 bg-supporting-50/50 p-4 transition-all hover:border-primary-300 hover:shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="image-frame aspect-[4/3] w-full rounded-xl overflow-hidden mb-3">
                        <Image
                          src={prod.image}
                          alt={prod.name}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-serif text-sm font-bold text-primary-950 group-hover:text-primary-700 transition-colors line-clamp-2">
                        {prod.name}
                      </h3>
                    </div>
                    <div className="mt-3 pt-3 border-t border-supporting-200/80 flex items-center justify-between">
                      <span className="text-xs font-bold text-primary-800 font-serif">
                        Rp{prod.price.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[11px] font-bold text-accent-700 group-hover:underline">
                        Beli →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Back & CTA Footer Actions */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-supporting-200 pt-8">
            <Link
              href="/artikel"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary-800 hover:text-primary-950 transition-colors"
            >
              <span>←</span>
              <span>Kembali ke Semua Artikel</span>
            </Link>
            <div className="flex items-center gap-3">
              <ActionLink href="/produk" tone="ink" size="md">
                Katalog Produk Lengkap
              </ActionLink>
            </div>
          </div>
        </div>
      </article>

      {/* Related reading */}
      {related.length > 0 && (
        <section className="border-t border-supporting-200 bg-white section-y">
          <Shell>
            <div className="mb-12">
              <Reveal variant="micro">
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200 mb-3">
                  Wawasan Literasi Lainnya
                </span>
              </Reveal>
              <Reveal variant="medium" delay={0.05}>
                <SectionHeading level={2} className="mt-2">
                  Artikel Edukasi Terkait
                </SectionHeading>
              </Reveal>
            </div>
            <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
              {related.map((item, index) => (
                <Reveal key={item.id} variant="small" delay={index * 0.07}>
                  <article>
                    <Link
                      href={`/artikel/${item.slug}`}
                      className="group block"
                    >
                      <div className="image-frame image-frame-zoom aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-2xs">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                      <p className="meta-type mt-5">
                        {item.category} • {item.readTime} min read
                      </p>
                      <h3 className="mt-2 text-xl font-serif font-bold leading-snug text-supporting-900 transition-colors group-hover:text-accent-700">
                        {item.title}
                      </h3>
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-supporting-600">
                        {item.excerpt}
                      </p>
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
          </Shell>
        </section>
      )}
    </div>
  );
}
