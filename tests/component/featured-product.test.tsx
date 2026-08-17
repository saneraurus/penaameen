import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FeaturedProductSection } from "@/components/sections/FeaturedProductSection";

describe("FeaturedProductSection Component", () => {
  it("renders the main featured title, badge, and price", () => {
    render(<FeaturedProductSection />);

    expect(
      screen.getByRole("heading", { name: "Paket Home Learning ALBARQY" }),
    ).toBeInTheDocument();
    expect(screen.getByText("PILIHAN BELAJAR UTAMA")).toBeInTheDocument();
    expect(screen.getByText("Rp966.000")).toBeInTheDocument();
    expect(screen.getByText(/Hemat Rp284.000/i)).toBeInTheDocument();
  });

  it("switches between Isi Paket and Keunggulan tabs", () => {
    render(<FeaturedProductSection />);

    // Default tab is "Isi Paket"
    expect(
      screen.getByText("Buku Utama & Modul Praktik AL-BARQY"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Bonus Tas Eksklusif PENA AMEEN"),
    ).toBeInTheDocument();

    // Click "Keunggulan Metode" tab
    const keunggulanTab = screen.getByRole("button", {
      name: /Keunggulan Metode/i,
    });
    fireEvent.click(keunggulanTab);

    expect(screen.getByText("Sistem Cepat 200 Menit")).toBeInTheDocument();
    expect(screen.getByText("Formula Kata Anti-Lupa")).toBeInTheDocument();

    // Click back to "Isi Paket" tab
    const isiTab = screen.getByRole("button", { name: /Isi Paket Box/i });
    fireEvent.click(isiTab);

    expect(
      screen.getByText("Flashcard Hijaiyah Interaktif"),
    ).toBeInTheDocument();
  });

  it("renders link buttons to product detail and contact", () => {
    render(<FeaturedProductSection />);

    const productLink = screen.getByRole("link", {
      name: /Lihat Detail Produk/i,
    });
    expect(productLink).toHaveAttribute(
      "href",
      "/produk/paket-home-learning-albarqy",
    );

    const contactLink = screen.getByRole("link", { name: /Tanya CS/i });
    expect(contactLink).toHaveAttribute("href", "/kontak");
  });
});
