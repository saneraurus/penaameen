// src/app/artikel/ArticleListClient.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Article } from "@/data/articles";

import { Reveal } from "@/components/motion/Reveal";
import { EmptyState, Shell } from "@/components/ui/primitives";

export function ArticleListClient({ articles }: { articles: Article[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "" ||
      article.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(articles.map((article) => article.category))];

  const [lead, ...rest] = filteredArticles;

  return (
    <main>
      <Shell className="py-14 sm:py-20">
        {/* Search and filter */}
        <div className="flex flex-col gap-6 border-b border-supporting-200 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0 flex-1 md:max-w-md">
            <label htmlFor="article-search" className="sr-only">
              Cari artikel
            </label>
            <div className="flex items-center border-b border-supporting-300 transition-colors focus-within:border-primary-700">
              <svg
                className="h-4 w-4 shrink-0 text-supporting-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                id="article-search"
                type="text"
                placeholder="Cari artikel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-supporting-400"
              />
            </div>
          </div>

          <div>
            <label htmlFor="article-category" className="sr-only">
              Kategori artikel
            </label>
            <select
              id="article-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="min-h-11 rounded-full border border-supporting-300 bg-transparent px-5 text-sm text-supporting-800 outline-none transition-colors focus:border-primary-700"
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <EmptyState
            title="Tidak ada artikel yang ditemukan."
            description="Coba kata kunci lain atau pilih kategori yang berbeda."
          />
        ) : (
          <>
            {/* Lead story */}
            {lead ? (
              <Reveal variant="medium">
                <article className="mt-14">
                  <Link
                    href={`/artikel/${lead.slug}`}
                    className="group grid gap-8 lg:grid-cols-12 lg:gap-14"
                  >
                    <div className="lg:col-span-7">
                      <div className="image-frame image-frame-zoom aspect-[16/10] w-full">
                        <Image
                          src={lead.image}
                          alt={lead.title}
                          fill
                          priority
                          sizes="(max-width: 1024px) 100vw, 58vw"
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col justify-center lg:col-span-5">
                      <p className="meta-type">{lead.category}</p>
                      <h2 className="display-type mt-4 text-[clamp(1.75rem,3.2vw,2.75rem)] text-supporting-900 transition-colors group-hover:text-accent-700">
                        {lead.title}
                      </h2>
                      <p className="mt-5 text-measure text-sm leading-relaxed text-supporting-600 sm:text-base">
                        {lead.excerpt}
                      </p>
                      <p className="mt-6 text-xs text-supporting-400">
                        {lead.date} · {lead.readTime} min read
                      </p>
                    </div>
                  </Link>
                </article>
              </Reveal>
            ) : null}

            {/* Remaining stories */}
            {rest.length > 0 ? (
              <div className="mt-20 grid gap-x-8 gap-y-14 border-t border-supporting-200 pt-14 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((article, index) => (
                  <Reveal
                    key={article.id}
                    variant="small"
                    delay={(index % 3) * 0.07}
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
                        <p className="meta-type mt-5">{article.category}</p>
                        <h3 className="mt-3 text-xl leading-snug text-supporting-900 transition-colors group-hover:text-accent-700">
                          {article.title}
                        </h3>
                        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-supporting-600">
                          {article.excerpt}
                        </p>
                        <p className="mt-4 text-xs text-supporting-400">
                          {article.date} · {article.readTime} min read
                        </p>
                      </Link>
                    </article>
                  </Reveal>
                ))}
              </div>
            ) : null}
          </>
        )}
      </Shell>
    </main>
  );
}
