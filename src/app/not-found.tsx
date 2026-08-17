import Link from "next/link";

import { Container } from "@/presentation/components/foundation/container";
import { StatusMessage } from "@/presentation/components/foundation/status-message";

export default function NotFound() {
  return (
    <Container>
      <div className="foundation-stack">
        <StatusMessage kind="error" title="Route not found">
          <p>
            This route has no approved foundation destination. Legacy URL
            treatment remains governed by the migration and redirect registry.
          </p>
          <p>
            <Link href="/">Return to foundation home</Link>
          </p>
        </StatusMessage>
      </div>
    </Container>
  );
}
