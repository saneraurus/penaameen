import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { HeroSection } from "@/components/sections/HeroSection";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

describe("HeroSection Component", () => {
  it("renders the main hero headline and primary CTA", () => {
    render(<HeroSection />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /Kuasai Membaca & Mengaji/i,
    );
    expect(
      screen.getByRole("link", { name: /Jelajahi Paket & Produk/i }),
    ).toBeInTheDocument();
  });

  it("renders showcase multi-view switcher tabs and switches content on click", () => {
    render(<HeroSection />);

    const homeLearningTab = screen.getByRole("button", {
      name: /Home Learning/i,
    });
    const albarqyTab = screen.getByRole("button", {
      name: /Metode Al-Barqy/i,
    });
    const acmTab = screen.getByRole("button", { name: /Metode ACM/i });
    const perangkatTab = screen.getByRole("button", {
      name: /Kit & Alat Peraga/i,
    });

    expect(homeLearningTab).toBeInTheDocument();
    expect(albarqyTab).toBeInTheDocument();
    expect(acmTab).toBeInTheDocument();
    expect(perangkatTab).toBeInTheDocument();

    // Default is "Home Learning Keluarga"
    expect(screen.getByText(/Solusi Belajar di Rumah/i)).toBeInTheDocument();

    // Click "Metode Al-Barqy (200 Menit)"
    fireEvent.click(albarqyTab);
    expect(
      screen.getByText(/Metode Anti Lupa Revolusioner/i),
    ).toBeInTheDocument();

    // Click "Metode ACM Ceria Anak"
    fireEvent.click(acmTab);
    expect(
      screen.getByText(/Aku Cepat Membaca \(3–8 Tahun\)/i),
    ).toBeInTheDocument();
  });

  it("renders search input and triggers search navigation", () => {
    render(<HeroSection />);

    const searchInput = screen.getByLabelText("Cari produk atau metode");
    const searchButton = screen.getByRole("button", { name: /Cari/i });

    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "Al-Barqy" } });
    fireEvent.click(searchButton);

    expect(mockPush).toHaveBeenCalledWith("/produk?q=Al-Barqy");

    expect(
      screen.getAllByRole("link", { name: /Jelajahi Paket|Lihat Paket/i })
        .length,
    ).toBeGreaterThan(0);
  });
});
