// src/app/artikel/page.tsx
import Link from "next/link";
import { getArticles } from "@/lib/content";
import { ArticleListClient } from "./ArticleListClient";

export default async function ArticleListPage() {
  const articles = await getArticles();
  return (
    <div className="min-h-screen bg-background-50">
      <header className="bg-white/90 backdrop-blur-sm sticky top-0 z-20 border-b border-supporting-200">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <Link
              href="/"
              className="text-supporting-600 hover:text-primary-600"
            >
              ← Kembali ke Beranda
            </Link>
            <h1 className="text-2xl font-serif text-primary-600">Artikel</h1>
          </div>
        </div>
      </header>

      <ArticleListClient articles={articles} />
    </div>
  );
}
