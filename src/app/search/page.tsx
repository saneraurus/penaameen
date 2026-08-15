import { Container } from "@/presentation/components/foundation/container";
import { StatusMessage } from "@/presentation/components/foundation/status-message";
import { createFoundationMetadata } from "@/presentation/foundation-metadata";

export const metadata = createFoundationMetadata("Search foundation");

export default function SearchFoundationPage() {
  return (
    <Container>
      <div className="foundation-stack">
        <section>
          <p>Search route boundary</p>
          <h1>Search</h1>
          <p>
            Search is modeled as a provider-neutral, PostgreSQL-first
            capability. Query execution, synonyms, ranking, catalog content, and
            analytics remain deferred until approved implementation gates pass.
          </p>
        </section>
        <StatusMessage kind="unavailable" title="Search interaction deferred">
          <p>
            The route is intentionally non-indexable foundation scaffolding and
            does not return fabricated results.
          </p>
        </StatusMessage>
      </div>
    </Container>
  );
}
