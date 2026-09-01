import { Container } from "@/presentation/components/foundation/container";
import { StatusMessage } from "@/presentation/components/foundation/status-message";
import { createFoundationMetadata } from "@/presentation/foundation-metadata";

export const metadata = createFoundationMetadata("Education foundation");

export default function EducationFoundationPage() {
  return (
    <Container>
      <div className="foundation-stack py-16 md:py-24">
        <section className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary-950 mb-6">
            Education
          </h1>
          <p className="text-measure text-base leading-relaxed text-supporting-600 mx-auto mb-8">
            AL-BARQY and ACM remain approved education pillars. Their final hub
            content, media, taxonomy treatment, and product relations are gated
            by the documented content and catalog decisions.
          </p>
        </section>
        <div className="max-w-2xl mx-auto">
          <StatusMessage kind="info" title="Content governance preserved">
            <p>
              The foundation does not publish source articles, educational
              claims, product family data, or migration-sensitive metadata.
            </p>
          </StatusMessage>
        </div>
      </div>
    </Container>
  );
}
