import { Container } from "@/presentation/components/foundation/container";
import { StatusMessage } from "@/presentation/components/foundation/status-message";
import { createFoundationMetadata } from "@/presentation/foundation-metadata";

export const metadata = createFoundationMetadata("Education foundation");

export default function EducationFoundationPage() {
  return (
    <Container>
      <div className="foundation-stack">
        <section>
          <p>Education route boundary</p>
          <h1>Education</h1>
          <p>
            AL-BARQY and ACM remain approved education pillars. Their final hub
            content, media, taxonomy treatment, and product relations are gated
            by the documented content and catalog decisions.
          </p>
        </section>
        <StatusMessage kind="info" title="Content governance preserved">
          <p>
            The foundation does not publish source articles, educational claims,
            product family data, or migration-sensitive metadata.
          </p>
        </StatusMessage>
      </div>
    </Container>
  );
}
