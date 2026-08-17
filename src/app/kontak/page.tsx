// src/app/kontak/page.tsx
import Link from "next/link";

export default function ContactPage() {
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
            <h1 className="text-2xl font-serif text-primary-600">Kontak</h1>
          </div>
        </div>
      </header>

      <main className="py-12">
        <div className="container px-4 mx-auto">
          <div className="space-y-12">
            {/* Contact Info */}
            <section>
              <h2 className="mb-6 text-3xl font-serif text-primary-600">
                Hubungi Kami
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-primary-600">
                    Kantor Pusat
                  </h3>
                  <p className="mb-4">
                    GRAHA AL BARQY Jl. Gayungsari 1A Surabaya Jawa Timur –
                    INDONESIA
                  </p>
                  <p className="mb-4">Phone: +6231 829 4393</p>
                  <p className="mb-4">Mobile: +62822 3123 9158</p>
                  <p className="mb-4">Email: cs.penaameen@yahoo.com</p>
                </div>
                <div className="bg-supporting-50 rounded-xl p-6">
                  <h3 className="mb-4 text-xl font-semibold text-primary-600">
                    Media Sosial
                  </h3>
                  <p className="mb-4 text-supporting-600">
                    Ikuti kami untuk update terbaru tentang produk dan metode
                    belajar kami.
                  </p>
                  <div className="flex space-x-4">
                    {/* We'll use placeholder links for social media */}
                    <a
                      href="#"
                      className="flex items-center justify-center w-10 h-10 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors"
                      aria-label="Facebook"
                    >
                      <svg
                        className="h-5 w-5 text-primary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
                        />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center w-10 h-10 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors"
                      aria-label="Instagram"
                    >
                      <svg
                        className="h-5 w-5 text-primary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 4v16a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2H4a2 2 0 00-2 2z"
                        />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center w-10 h-10 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors"
                      aria-label="WhatsApp"
                    >
                      <svg
                        className="h-5 w-5 text-primary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-3z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Form (placeholder) */}
            <section>
              <h2 className="mb-6 text-3xl font-serif text-primary-600">
                Kirim Pesan
              </h2>
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-supporting-900"
                  >
                    Nama
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Nama Anda"
                    className="w-full px-4 py-2 border border-supporting-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-supporting-900"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="alamat@email.com"
                    className="w-full px-4 py-2 border border-supporting-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium text-supporting-900"
                  >
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tulis pesan Anda di sini..."
                    className="w-full px-4 py-2 border border-supporting-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
                >
                  Kirim Pesan
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
