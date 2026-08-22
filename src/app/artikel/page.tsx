// src/app/artikel/page.tsx
import Link from "next/link";
import { getArticles } from "@/lib/content";
import { ArticleListClient } from "./ArticleListClient";

import { SceneIndex, SectionHeading, Shell } from "@/components/ui/primitives";

export default async function ArticleListPage() {
  const articles = await getArticles();
  return (
    <div className="min-h-screen bg-background-50">
      <header className="border-b border-supporting-200 bg-white">
        <Shell className="py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs text-supporting-500">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-primary-900"
                >
                  Kembali ke Beranda
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-supporting-800">Artikel</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <SceneIndex index="01" label="Wawasan" />
            <SectionHeading level={1} className="mt-5">
              Artikel
            </SectionHeading>
            <p className="lede mt-5">
              Catatan, panduan, dan wawasan untuk pendamping belajar membaca dan
              mengaji.
            </p>
          </div>
        </Shell>
      </header>

      <ArticleListClient articles={articles} />
    </div>
  );
}
