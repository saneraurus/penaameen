import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EditorialStorySection } from "@/components/sections/EditorialStorySection";

describe("EditorialStorySection Component", () => {
  it("renders the main manifesto headline and badge", () => {
    render(<EditorialStorySection />);

    expect(
      screen.getByRole("heading", {
        name: /Belajar Bukan Sekadar Bisa.*Tapi Menjadi Lebih Dekat/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("MANIFESTO PENA AMEEN")).toBeInTheDocument();
  });

  it("renders all 3 value pillars", () => {
    render(<EditorialStorySection />);

    expect(screen.getByText("Koneksi Emosional yang Erat")).toBeInTheDocument();
    expect(screen.getByText("Pondasi Adab & Karakter")).toBeInTheDocument();
    expect(screen.getByText("Kemandirian Seumur Hidup")).toBeInTheDocument();
  });

  it("renders the action links to /tentang and /cabang", () => {
    render(<EditorialStorySection />);

    const aboutLink = screen.getByRole("link", {
      name: /Baca Kisah Lengkap PENA AMEEN/i,
    });
    expect(aboutLink).toHaveAttribute("href", "/tentang");

    const branchLink = screen.getByRole("link", {
      name: /Temukan Komunitas & Cabang/i,
    });
    expect(branchLink).toHaveAttribute("href", "/cabang");
  });
});
