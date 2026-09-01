import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FeaturedProductSection } from "@/components/sections/FeaturedProductSection";

describe("FeaturedProductSection Component", () => {
  it("renders the main featured title, badge, and price", () => {
    render(<FeaturedProductSection />);

    expect(
      screen.getByRole("heading", { name: /Paket Home Learning/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Pilihan Belajar Utama/i)).toBeInTheDocument();
    expect(screen.getByText("Rp966.000")).toBeInTheDocument();
    expect(screen.getByText(/Hemat Rp284.000/i)).toBeInTheDocument();
  });

  it("toggles Isi Paket and Keunggulan dropdowns", () => {
    render(<FeaturedProductSection />);

    // Initially collapsed
    expect(
      screen.queryByText("Buku Utama & Modul Praktik AL-BARQY"),
    ).not.toBeInTheDocument();

    // Click "Isi Paket Box" dropdown
    const isiBtn = screen.getByRole("button", {
      name: /Isi Paket Box/i,
    });
    fireEvent.click(isiBtn);

    expect(
      screen.getByText("Buku Utama & Modul Praktik AL-BARQY"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Bonus Tas Kanvas Eksklusif PENA AMEEN"),
    ).toBeInTheDocument();

    // Click "Keunggulan Metode" dropdown
    const keunggulanBtn = screen.getByRole("button", {
      name: /Keunggulan Metode/i,
    });
    fireEvent.click(keunggulanBtn);

    expect(
      screen.getByText(/Sistem Cepat 200 Menit Tuntas/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Formula Kata Kunci Anti Lupa/i),
    ).toBeInTheDocument();
  });

  it("renders link buttons to product detail and contact", () => {
    render(<FeaturedProductSection />);

    const productLink = screen.getByRole("link", {
      name: /Lihat Detail/i,
    });
    expect(productLink).toHaveAttribute(
      "href",
      "/produk/paket-home-learning-albarqy",
    );

    const contactLink = screen.getByRole("link", { name: /Tanya CS/i });
    expect(contactLink).toHaveAttribute("href", "/kontak");
  });
});
