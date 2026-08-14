import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "@/presentation/components/foundation/site-header";

describe("SiteHeader accessibility foundation", () => {
  it("provides a labeled primary navigation with canonical foundation links", () => {
    render(<SiteHeader />);

    expect(
      screen.getByRole("navigation", { name: "Primary navigation" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop" })).toHaveAttribute(
      "href",
      "/shop",
    );
    expect(screen.getByRole("link", { name: "Education" })).toHaveAttribute(
      "href",
      "/education",
    );
  });
});
