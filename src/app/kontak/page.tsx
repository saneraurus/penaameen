import Image from "next/image";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import {
  Section,
  Shell,
  SectionHeading,
  Eyebrow,
  SceneIndex,
  TextLink,
} from "@/components/ui/primitives";
import { ContactForm } from "./ContactForm";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background-50">
      {/* Editorial hero */}
      <Section tone="none" className="section-y-tight">
        <Shell>
          <RevealGroup>
            <SceneIndex index="01" label="Hubungi Kami" />
            <SectionHeading>Kontak</SectionHeading>
            <p className="lede text-measure mt-6">
              Kami ingin mendengar dari Anda. Baik untuk bertanya, beri masukan,
              atau memulai percakapan tentang metode belajar Pena Ameen.
            </p>
            <div className="mt-8">
              <TextLink href="/">← Kembali ke Beranda</TextLink>
            </div>
          </RevealGroup>
        </Shell>
      </Section>

      {/* Story / Image block */}
      <Section tone="none">
        <Shell>
          <div className="grid gap-8 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7">
              <Reveal variant="large">
                <div className="image-frame image-frame-zoom aspect-[4/3] md:aspect-[16/9]">
                  <Image
                    src="/images/penaameen/editorial/tentang-hero-family.jpg"
                    alt="Keluarga yang belajar bersama di rumah"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 75vw"
                  />
                </div>
              </Reveal>
            </div>
            <div className="md:col-span-5 md:pl-8">
              <Reveal variant="medium" delay={0.12}>
                <Eyebrow>Pena Ameen</Eyebrow>
                <SectionHeading level={3} className="mt-4">
                  Kantor Pusat
                </SectionHeading>
                <div className="mt-6 space-y-3 text-sm leading-relaxed text-supporting-700">
                  <p>
                    GRAHA AL BARQY
                    <br />
                    Jl. Gayungsari 1A
                    <br />
                    Surabaya, Jawa Timur – INDONESIA
                  </p>
                  <p>Phone: +6231 829 4393</p>
                  <p>Mobile: +62822 3123 9158</p>
                  <p>Email: cs.penaameen@yahoo.com</p>
                </div>
              </Reveal>
            </div>
          </div>
        </Shell>
      </Section>

      {/* Social + minimal form */}
      <Section tone="canvas">
        <Shell>
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            {/* Social */}
            <div>
              <Reveal>
                <Eyebrow>Terhubung</Eyebrow>
                <SectionHeading level={3} className="mt-4">
                  Media Sosial
                </SectionHeading>
                <p className="lede text-measure-tight mt-4 text-supporting-600">
                  Ikuti kami untuk update terbaru tentang produk dan metode
                  belajar kami.
                </p>
              </Reveal>
              <RevealGroup className="mt-8 flex gap-3">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-950 text-background-100 transition-colors hover:bg-primary-900"
                  aria-label="Facebook"
                >
                  <svg
                    className="h-5 w-5"
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
                </span>
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-950 text-background-100 transition-colors hover:bg-primary-900"
                  aria-label="Instagram"
                >
                  <svg
                    className="h-5 w-5"
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
                </span>
                <a
                  href="https://wa.me/6282231239158"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-950 text-background-100 transition-colors hover:bg-primary-900"
                  aria-label="WhatsApp"
                >
                  <svg
                    className="h-5 w-5"
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
              </RevealGroup>
            </div>

            {/* Minimal form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </Shell>
      </Section>
    </div>
  );
}
