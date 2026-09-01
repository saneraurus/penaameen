"use client";

import { Reveal } from "@/components/motion/Reveal";
import {
  Section,
  Shell,
  SectionHeading,
  Eyebrow,
  TextLink,
} from "@/components/ui/primitives";

export default function GlobalError({
  reset,
}: Readonly<{
  reset: () => void;
}>) {
  return (
    <Section tone="canvas">
      <Shell width="narrow">
        <div className="py-16 md:py-24">
          <Reveal className="text-center">
            <Eyebrow>Terjadi Kesalahan</Eyebrow>
            <SectionHeading className="mt-4">
              Gagal memuat halaman ini
            </SectionHeading>
          </Reveal>

          <Reveal
            variant="medium"
            delay={0.1}
            className="mt-6 text-center text-supporting-600"
          >
            <p className="lede text-measure mx-auto">
              Terjadi gangguan saat memuat fondasi rute ini. Anda dapat mencoba
              kembali, atau kembali ke beranda.
            </p>
          </Reveal>

          <Reveal
            variant="small"
            delay={0.18}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <button
              onClick={reset}
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-primary-950 px-8 py-3.5 text-sm font-semibold text-background-100 transition-all duration-200 hover:bg-primary-900 hover:-translate-y-0.5"
            >
              Coba Lagi
            </button>
            <TextLink href="/">Kembali ke Beranda</TextLink>
          </Reveal>
        </div>
      </Shell>
    </Section>
  );
}
