// src/app/artikel/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getArticleBySlug, getArticles } from "@/lib/content";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/Reveal";
import { Shell } from "@/components/ui/primitives";

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

  return (
    <div className="min-h-screen bg-background-50">
      {/* Breadcrumb */}
      <div className="border-b border-supporting-200">
        <Shell className="py-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs text-supporting-500">
              <li>
                <Link
                  href="/artikel"
                  className="transition-colors hover:text-primary-900"
                >
                  Kembali ke Daftar Artikel
                </Link>
              </li>
            </ol>
          </nav>
        </Shell>
      </div>

      <article>
        {/* Editorial masthead */}
        <header>
          <Shell className="pb-12 pt-14 sm:pb-16 sm:pt-20">
            <div className="mx-auto max-w-3xl text-center">
              <p className="meta-type">
                {article.category} · {article.date} · {article.readTime} min
                read
              </p>
              <h1 className="display-type mt-6 text-[clamp(2rem,5vw,3.75rem)]">
                {article.title}
              </h1>
              {article.excerpt ? (
                <p className="lede mx-auto mt-7 max-w-2xl">{article.excerpt}</p>
              ) : null}
            </div>
          </Shell>

          {article.image && (
            <div className="container-wide">
              <div className="image-frame aspect-[16/9] w-full">
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
          )}
        </header>

        {/* Reading column */}
        <div className="container-narrow py-16 sm:py-20">
          <div className="whitespace-pre-line text-[1.0625rem] leading-[1.8] text-supporting-700 sm:text-lg">
            {article.content}
          </div>
        </div>
      </article>

      {/* Related reading */}
      {related.length > 0 && (
        <section className="border-t border-supporting-200 bg-white">
          <Shell className="py-16 sm:py-20">
            <h2 className="text-2xl sm:text-3xl">Artikel Terkait</h2>
            <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2">
              {related.map((item, index) => (
                <Reveal key={item.id} variant="small" delay={index * 0.07}>
                  <article>
                    <Link
                      href={`/artikel/${item.slug}`}
                      className="group block"
                    >
                      <div className="image-frame image-frame-zoom aspect-[16/10] w-full">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                      <p className="meta-type mt-5">{item.category}</p>
                      <h3 className="mt-3 text-xl leading-snug text-supporting-900 transition-colors group-hover:text-accent-700">
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
