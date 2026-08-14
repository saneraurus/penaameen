import Link from "next/link";

import { Container } from "@/presentation/components/foundation/container";
import { StatusMessage } from "@/presentation/components/foundation/status-message";
import { createFoundationMetadata } from "@/presentation/foundation-metadata";

export const metadata = createFoundationMetadata("Foundation home");

export default function HomePage() {
  return (
    <Container>
      <div className="foundation-stack">
        <section>
          <p>Implementation foundation</p>
          <h1>Pena Ameen</h1>
          <p>Belajar Tanpa Mengenal Usia</p>
          <p>
            This executable foundation preserves the approved route, domain,
            accessibility, and provider-boundary architecture without claiming
            unapproved catalog, payment, shipping, or brand data.
          </p>
        </section>
        <StatusMessage kind="info" title="Foundation scope">
          <p>
            Catalog content, provider integrations, source migration, and final
            brand assets remain intentionally deferred until their project gates
            pass.
          </p>
        </StatusMessage>
        <section aria-labelledby="foundation-next-steps">
          <h2 id="foundation-next-steps">Available foundation routes</h2>
          <ul>
            <li>
              <Link href="/shop">Shop foundation</Link>
            </li>
            <li>
              <Link href="/education">Education foundation</Link>
            </li>
            <li>
              <Link href="/search">Search foundation</Link>
            </li>
          </ul>
        </section>
      </div>
    </Container>
  );
}
