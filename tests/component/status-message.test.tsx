import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusMessage } from "@/presentation/components/foundation/status-message";

describe("StatusMessage", () => {
  it("renders an accessible error state", () => {
    render(
      <StatusMessage kind="error" title="Foundation error">
        Retry safely.
      </StatusMessage>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Foundation error");
    expect(screen.getByRole("alert")).toHaveTextContent("Retry safely.");
  });

  it("renders an informational status without using error semantics", () => {
    render(
      <StatusMessage kind="info" title="Foundation info">
        Provider scope remains blocked.
      </StatusMessage>,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Foundation info");
  });
});
