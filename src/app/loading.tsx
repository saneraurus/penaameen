import { Reveal } from "@/components/motion/Reveal";
import {
  Section,
  Shell,
  SectionHeading,
  Eyebrow,
} from "@/components/ui/primitives";

export default function Loading() {
  return (
    <Section tone="canvas">
      <Shell width="narrow">
        <div
          aria-live="polite"
          role="status"
          className="flex min-h-[60vh] items-center justify-center"
        >
          <Reveal className="text-center">
            <div className="mx-auto mb-6 h-12 w-12 animate-spin-slow rounded-full border-2 border-supporting-300 border-t-primary-950" />
            <Eyebrow plain className="justify-center">
              Memuat konten
            </Eyebrow>
            <SectionHeading level={3} className="mt-4">
              Mohon Tunggu
            </SectionHeading>
            <p className="mt-3 text-sm text-supporting-500">
              Fondasi konten sedang disiapkan untuk Anda.
            </p>
          </Reveal>
        </div>
      </Shell>
    </Section>
  );
}
