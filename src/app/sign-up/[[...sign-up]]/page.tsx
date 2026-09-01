import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Shell, SectionHeading, SceneIndex } from "@/components/ui/primitives";

export default function SignUpPage() {
  return (
    <div className="relative min-h-[100vh] bg-background-50">
      {/* Editorial background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/penaameen/hero/hero-family-learning.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-primary-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-950/50 to-primary-950/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-[100vh] items-center justify-center px-4 py-12">
        <Shell width="narrow">
          <Reveal className="mb-10 text-center">
            <SceneIndex index="01" label="Daftar" />
            <SectionHeading className="mt-4 text-background-100">
              Bergabung dengan Pena Ameen
            </SectionHeading>
            <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-relaxed text-background-200">
              Daftar untuk mengakses semua metode belajar dan konten eksklusif
              Pena Ameen.
            </p>
          </Reveal>

          <Reveal
            variant="medium"
            delay={0.1}
            className="flex w-full justify-center"
          >
            <SignUp
              appearance={{
                elements: {
                  rootBox: "mx-auto w-full flex justify-center",
                  cardBox: "mx-auto shadow-none",
                  formButtonPrimary:
                    "bg-background-100 text-primary-950 hover:bg-white rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5",
                  card: "bg-transparent shadow-none border border-background-100/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm",
                  headerTitle:
                    "font-serif text-background-100 text-2xl font-medium mb-2",
                  headerSubtitle: "text-background-200 text-sm mb-6",
                  socialButtonsBlockButton:
                    "bg-background-100/10 border border-background-100/20 text-background-100 hover:bg-background-100/20 rounded-full",
                  formFieldLabel:
                    "text-background-200 text-xs font-semibold uppercase tracking-[0.12em] mb-2",
                  formFieldInput:
                    "bg-background-100/10 border border-background-100/20 text-background-100 placeholder:text-background-100/50 rounded-lg focus:ring-background-100/30 focus:border-background-100/40",
                  footerActionLink: "text-accent-400 hover:text-accent-500",
                  identityPreviewEditButton:
                    "text-background-200 hover:text-background-100",
                  footer: "border-t-0 pt-0",
                  badge: "hidden",
                },
              }}
            />
          </Reveal>
        </Shell>
      </div>
    </div>
  );
}
