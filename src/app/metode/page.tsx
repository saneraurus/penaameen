// src/app/metode/page.tsx
import Link from "next/link";
import Image from "next/image";
import { methods } from "@/data/methods";

export default function MethodListPage() {
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
            <h1 className="text-2xl font-serif text-primary-600">
              Program / Metode
            </h1>
          </div>
        </div>
      </header>

      <main className="py-12">
        <div className="container px-4 mx-auto">
          <h2 className="mb-8 text-3xl font-serif text-center text-primary-600">
            Temukan Metode Belajar yang Tepat
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {methods.map((method) => (
              <Link
                key={method.id}
                href={`/metode/${method.slug}`}
                className="group block bg-white rounded-xl p-8 shadow-sm border border-supporting-200 hover:shadow-md transition-all"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Image
                      src={method.image}
                      alt={method.name}
                      width={96}
                      height={96}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="ml-6 flex-1">
                    <h3 className="mb-2 text-xl font-serif text-primary-600">
                      {method.name}
                    </h3>
                    <p className="mb-4 text-supporting-600">
                      {method.description}
                    </p>
                    <div className="mb-4 space-y-2 text-sm text-supporting-500">
                      {method.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start">
                          <svg
                            className="mt-0.5 h-4 w-4 text-primary-400 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 00-1.947 1.947"
                            />
                          </svg>
                          <span className="ml-2">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <span className="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-600 text-sm rounded-md">
                      Untuk: {method.suitableFor}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
