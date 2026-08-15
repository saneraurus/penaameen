"use client";

import { Container } from "@/presentation/components/foundation/container";
import { StatusMessage } from "@/presentation/components/foundation/status-message";

type ErrorBoundaryProps = Readonly<{
  reset: () => void;
}>;

export default function GlobalError({ reset }: ErrorBoundaryProps) {
  return (
    <Container>
      <div className="foundation-stack">
        <StatusMessage
          kind="error"
          title="Unable to load this foundation route"
        >
          <p>
            The foundation preserved a safe recovery path. Retry the route or
            return to the home page.
          </p>
          <button onClick={reset} type="button">
            Retry
          </button>
        </StatusMessage>
      </div>
    </Container>
  );
}
