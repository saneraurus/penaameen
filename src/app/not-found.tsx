import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import {
  Section,
  Shell,
  SectionHeading,
  Eyebrow,
} from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <Section tone="canvas">
      <Shell width="narrow">
        <div className="py-16 md:py-24">
          <Reveal className="text-center">
            <Eyebrow>Halaman Tidak Ditemukan</Eyebrow>
            <SectionHeading className="mt-4">404</SectionHeading>
          </Reveal>

          <Reveal
            variant="medium"
            delay={0.1}
            className="mt-6 text-center text-supporting-600"
          >
            <p className="lede text-measure mx-auto">
              Rute yang Anda tuju tidak tersedia atau telah dipindah. Kembali ke
              beranda untuk melanjutkan eksplorasi.
            </p>
          </Reveal>

          <Reveal
            variant="small"
            delay={0.18}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-primary-950 px-8 py-3.5 text-sm font-semibold text-background-100 transition-all duration-200 hover:bg-primary-900 hover:-translate-y-0.5"
            >
              Kembali ke Beranda
            </Link>
          </Reveal>
        </div>
      </Shell>
    </Section>
  );
}
