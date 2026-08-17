// src/app/artikel/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getArticleBySlug, articles, Article } from "@/data/articles";
import { notFound } from "next/navigation";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background-50">
      <header className="bg-white/90 backdrop-blur-sm sticky top-0 z-20 border-b border-supporting-200">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <Link
              href="/artikel"
              className="text-supporting-600 hover:text-primary-600"
            >
              ← Kembali ke Daftar Artikel
            </Link>
            <h1 className="text-2xl font-serif text-primary-600">
              {article.title}
            </h1>
          </div>
        </div>
      </header>

      <main className="py-12">
        <div className="container px-4 mx-auto">
          <div className="space-y-8">
            {/* Article Header */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <span className="mr-3 flex-shrink-0">
                  <span className="px-3 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded">
                    {article.category}
                  </span>
                </span>
                <span className="text-supporting-500">
                  {article.date} • {article.readTime} min read
                </span>
              </div>
              <h1 className="mb-4 text-3xl font-serif text-primary-600">
                {article.title}
              </h1>
              {/* In a real app, we would display the featured image here if desired */}
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none text-supporting-600">
              {/* We'll use the content from the mock data */}
              <p>{article.content}</p>
              {/* In a real app, we would have multiple paragraphs, images, etc. */}
            </div>

            {/* Related Articles (placeholder) */}
            <div className="mt-12 pt-8 border-t border-supporting-200">
              <h2 className="mb-6 text-2xl font-serif text-primary-600">
                Artikel Terkait
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {/* We'll show two related articles for now */}
                {articles
                  .filter((a: Article) => a.id !== article.id)
                  .slice(0, 2)
                  .map((related: Article) => (
                    <Link
                      key={related.id}
                      href={`/artikel/${related.slug}`}
                      className="block bg-white rounded-xl overflow-hidden shadow-sm border border-supporting-200 hover:shadow-md transition-all"
                    >
                      <div className="relative aspect-[4/3] bg-supporting-200">
                        <Image
                          src={related.image}
                          alt={related.title}
                          fill
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="mb-2 text-lg font-serif text-primary-600">
                          {related.title}
                        </h3>
                        <p className="line-clamp-2 text-supporting-600">
                          {related.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
