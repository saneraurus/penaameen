// src/app/metode/page.tsx
import Link from "next/link";
import Image from "next/image";
import { methods } from "@/data/methods";
import { Reveal } from "@/components/motion/Reveal";
import { SceneIndex, Lede, Shell } from "@/components/ui/primitives";
import { SplitScene } from "@/components/story/StoryScene";

export default function MethodListPage() {
  const heroImage =
    methods[0]?.image ?? "/images/penaameen/methods/method-albarqy.jpg";

  return (
    <div className="min-h-screen bg-background-50">
      {/* Editorial Hero */}
      <section className="relative overflow-hidden bg-primary-950 text-white">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            unoptimized
            className="object-cover opacity-20"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/90 to-primary-950/70" />
        <Shell className="relative z-10 py-20 md:py-28">
          <Reveal variant="micro">
            <SceneIndex index="01" label="Program & Metode" />
          </Reveal>
          <Reveal variant="large" delay={0.05}>
            <h1 className="display-type mt-5 text-[clamp(2.5rem,7vw,5rem)] text-background-50">
              Program &amp; Metode
            </h1>
          </Reveal>
          <Reveal variant="medium" delay={0.12}>
            <Lede className="mt-6 max-w-2xl text-background-200">
              Temukan metode belajar membaca Al-Qur&apos;an dan Latin yang tepat
              untuk buah hati Anda. Setiap program dirancang dengan riset
              pedagogik mendalam.
            </Lede>
          </Reveal>
        </Shell>
      </section>

      {/* Methods — Split compositions */}
      <main className="section-y">
        <Shell>
          <div className="space-y-24 md:space-y-32">
            {methods.map((method, index) => (
              <Reveal key={method.id} variant="medium" delay={index * 0.05}>
                <SplitScene
                  image={method.image}
                  imageAlt={method.name}
                  eyebrow={
                    <span className="text-xs font-bold uppercase tracking-wider text-primary-300">
                      Metode {index + 1} dari {methods.length}
                    </span>
                  }
                  headline={method.name}
                  tone="canvas"
                  reverse={index % 2 === 1}
                  caption={method.tagline}
                  actions={
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/metode/${method.slug}`}
                        className="inline-flex items-center gap-2 rounded-full bg-background-100 text-primary-950 px-6 py-3 text-sm font-bold hover:bg-white transition-colors"
                      >
                        <span>Pelajari Metode Ini</span>
                        <span>→</span>
                      </Link>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-300 bg-primary-800/50 px-3 py-1.5 rounded-full border border-primary-700/50">
                        Untuk: {method.suitableFor}
                      </span>
                    </div>
                  }
                >
                  <p className="text-measure text-base leading-relaxed text-supporting-600">
                    {method.description}
                  </p>
                  <div className="mt-6 space-y-3">
                    {method.benefits.slice(0, 3).map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex-shrink-0">
                          ✓
                        </span>
                        <span className="text-sm text-supporting-700">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </SplitScene>
              </Reveal>
            ))}
          </div>
        </Shell>
      </main>
    </div>
  );
}
