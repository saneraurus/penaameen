// src/app/artikel/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getArticles } from "@/lib/content";
import { ArticleListClient } from "./ArticleListClient";

// Rendered at request time: the list queries the database, so it must not be
// statically prerendered at build (which would require a live DB during
// `next build`). See also artikel/[slug] and sitemap.ts.
export const dynamic = "force-dynamic";

import {
  SceneIndex,
  SectionHeading,
  Lede,
  Shell,
} from "@/components/ui/primitives";

export default async function ArticleListPage() {
  const articles = await getArticles();
  return (
    <div className="min-h-screen bg-background-50">
      {/* Editorial Header */}
      <section className="relative overflow-hidden bg-primary-950 text-white">
        <div className="absolute inset-0">
          {articles[0]?.image && (
            <Image
              src={articles[0].image}
              alt=""
              fill
              priority
              unoptimized
              className="object-cover opacity-20"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/90 to-primary-950/70" />
        <Shell className="relative z-10 py-20 md:py-28">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs text-background-300">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-background-100"
                >
                  Kembali ke Beranda
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-background-100">Artikel</li>
            </ol>
          </nav>

          <SceneIndex index="01" label="Wawasan" />
          <SectionHeading level={1} className="mt-5 text-background-50">
            Artikel
          </SectionHeading>
          <Lede className="mt-5 text-background-200">
            Catatan, panduan, dan wawasan untuk pendamping belajar membaca dan
            mengaji.
          </Lede>
        </Shell>
      </section>

      <ArticleListClient articles={articles} />
    </div>
  );
}
