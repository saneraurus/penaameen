import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LearningJourneySection } from "@/components/sections/LearningJourneySection";

describe("LearningJourneySection Component", () => {
  it("renders the main section title and subtitle", () => {
    render(<LearningJourneySection />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Perjalanan Belajar Bersama PENA AMEEN",
    );
    expect(screen.getByText(/Alur Pendampingan Efektif/i)).toBeInTheDocument();
  });

  it("renders all 5 steps and switches active step on click", () => {
    render(<LearningJourneySection />);

    // Step 01 default active
    expect(
      screen.getByText(/Identifikasi Gaya & Kesiapan Belajar/i),
    ).toBeInTheDocument();

    // Click step 02 (Pilih Metode)
    const step2Buttons = screen.getAllByRole("button", {
      name: /Langkah 02: Pilih Metode/i,
    });
    expect(step2Buttons.length).toBeGreaterThan(0);
    fireEvent.click(step2Buttons[0]!);

    expect(
      screen.getByText(/Pilih Jalur Belajar yang Teruji/i),
    ).toBeInTheDocument();

    // Click step 04 (Latih Konsisten)
    const step4Buttons = screen.getAllByRole("button", {
      name: /Langkah 04: Latih Konsisten/i,
    });
    expect(step4Buttons.length).toBeGreaterThan(0);
    fireEvent.click(step4Buttons[0]!);

    expect(
      screen.getByText(/Pendampingan 15–20 Menit Setiap Hari/i),
    ).toBeInTheDocument();
  });

  it("allows navigating using previous and next buttons", () => {
    render(<LearningJourneySection />);

    const nextButton = screen.getByRole("button", {
      name: "Tahap Selanjutnya",
    });
    const prevButton = screen.getByRole("button", { name: "Tahap Sebelumnya" });

    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    fireEvent.click(nextButton);
    expect(
      screen.getByText(/Pilih Jalur Belajar yang Teruji/i),
    ).toBeInTheDocument();
    expect(prevButton).not.toBeDisabled();
  });
});
