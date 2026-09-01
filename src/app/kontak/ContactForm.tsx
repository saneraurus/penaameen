"use client";

import { Eyebrow, SectionHeading } from "@/components/ui/primitives";

/**
 * Contact form for the /kontak page. Kept as a client component because it
 * uses an `onSubmit` handler (event handlers are not allowed on Server
 * Components). The form is a placeholder: submissions are directed to the
 * official email/mailto link, not a backend endpoint.
 */
export function ContactForm() {
  return (
    <div>
      <Eyebrow>Tulis Pesan</Eyebrow>
      <SectionHeading level={3} className="mt-4">
        Kirim Pesan
      </SectionHeading>
      <p className="mt-3 text-sm text-supporting-600">
        Formulir ini belum terhubung ke kanal penerimaan pesan. Gunakan WhatsApp
        atau email resmi di atas agar pesan tidak hilang.
      </p>
      <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-supporting-700"
          >
            Nama
          </label>
          <input
            id="name"
            type="text"
            placeholder="Nama Anda"
            className="w-full rounded-lg border border-supporting-300 bg-white px-4 py-3 text-sm text-supporting-900 placeholder:text-supporting-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-700"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-supporting-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="alamat@email.com"
            className="w-full rounded-lg border border-supporting-300 bg-white px-4 py-3 text-sm text-supporting-900 placeholder:text-supporting-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-700"
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-supporting-700"
          >
            Pesan
          </label>
          <textarea
            id="message"
            rows={5}
            placeholder="Tulis pesan Anda di sini..."
            className="w-full rounded-lg border border-supporting-300 bg-white px-4 py-3 text-sm text-supporting-900 placeholder:text-supporting-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-700"
          />
        </div>
        <a
          href="mailto:cs.penaameen@yahoo.com"
          className="inline-flex w-full items-center justify-center rounded-full bg-primary-950 px-8 py-3.5 text-sm font-semibold text-background-100 transition-all duration-200 hover:bg-primary-900 hover:-translate-y-0.5"
        >
          Kirim melalui Email
        </a>
      </form>
    </div>
  );
}
