"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

export function EditorialStorySection() {
  const values = [
    {
      title: "Koneksi Emosional yang Erat",
      desc: "Menjadikan sesi belajar 15 menit sehari di rumah sebagai waktu interaksi berkualitas antara orang tua dan anak.",
    },
    {
      title: "Pondasi Adab & Karakter",
      desc: "Menanamkan kecintaan membaca dan adab memuliakan Al-Qur'an sejak usia dini melalui contoh keteladanan.",
    },
    {
      title: "Kemandirian Seumur Hidup",
      desc: "Membekali anak kemampuan membaca lancar agar mandiri mempelajari ilmu dan wawasan di jenjang pendidikan berikutnya.",
    },
  ];

  return (
    <section className="border-y border-supporting-200 bg-white py-16 sm:py-20">
      <div className="container max-w-6xl">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <Reveal>
              <figure className="m-0">
                <div className="image-frame aspect-[4/3] w-full">
                  <Image
                    src="/images/penaameen/editorial/editorial-family-bonding.jpg"
                    alt="Ibu dan anak membaca buku bersama dengan penuh kehangatan"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-4 border-l border-accent-500 pl-4 font-serif text-sm italic leading-relaxed text-supporting-600">
                  &ldquo;Kemampuan membaca yang kuat berawal dari pendampingan
                  konsisten di rumah.&rdquo;
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal delay={0.12}>
              <p className="scene-index">Manifesto Pena Ameen</p>
              <span aria-hidden="true" className="sr-only">
                MANIFESTO PENA AMEEN
              </span>
              <h2 className="display-type mt-4 text-supporting-900">
                Belajar Bukan Sekadar Bisa. Tapi Menjadi Lebih Dekat.
              </h2>
              <p className="mt-5 max-w-prose text-sm leading-relaxed text-supporting-600 sm:text-base">
                PENA AMEEN berkomitmen menyajikan perangkat belajar yang
                terstruktur secara ilmiah dan ramah anak. Belajar membaca harus
                menjadi pengalaman positif yang menumbuhkan rasa percaya diri
                tanpa paksaan.
              </p>

              <ol className="mt-10 space-y-5 border-t border-supporting-200 pt-6">
                {values.map((val, idx) => (
                  <li key={val.title} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-1 text-[11px] font-medium text-supporting-400"
                    >
                      0{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-snug text-supporting-900">
                        {val.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-supporting-600">
                        {val.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 flex flex-wrap gap-3 border-t border-supporting-200 pt-6">
                <Link
                  href="/tentang"
                  className="inline-flex min-h-10 items-center rounded-full bg-primary-900 px-5 text-sm font-medium text-white transition-colors hover:bg-primary-800"
                >
                  Baca Kisah Lengkap PENA AMEEN →
                </Link>
                <Link
                  href="/cabang"
                  className="inline-flex min-h-10 items-center rounded-full border border-supporting-300 px-5 text-sm font-medium text-supporting-700 transition-colors hover:border-primary-700 hover:text-primary-800"
                >
                  Temukan Komunitas &amp; Cabang
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
