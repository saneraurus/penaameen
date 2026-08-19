// src/app/artikel/ArticleListClient.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Article } from "@/data/articles";

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

  return (
    <main className="py-12">
      <div className="container px-4 mx-auto">
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              placeholder="Cari artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-supporting-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 border border-supporting-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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

        {/* Article Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/artikel/${article.slug}`}
                className="group block bg-white rounded-xl overflow-hidden shadow-sm border border-supporting-200 hover:shadow-md transition-all"
              >
                <div className="relative aspect-[4/3] bg-supporting-200">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <span className="mb-2 inline-flex items-center px-2.5 py-0.5 bg-primary-100 text-primary-800 text-xs font-medium rounded">
                    {article.category}
                  </span>
                  <h3 className="mb-3 text-lg font-serif text-primary-600">
                    {article.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-supporting-600">
                    {article.excerpt}
                  </p>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="mr-3 text-supporting-500">
                      {article.date}
                    </span>
                    <span>•</span>
                    <span className="ml-3 text-supporting-500">
                      {article.readTime} min read
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-supporting-600">
                Tidak ada artikel yang ditemukan.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
