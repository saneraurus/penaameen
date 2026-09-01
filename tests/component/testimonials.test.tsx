import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";

describe("TestimonialsSection Component", () => {
  it("renders the main title, trust stats, and parent & teacher reviews", () => {
    render(<TestimonialsSection />);

    expect(
      screen.getByRole("heading", {
        name: /Kisah Nyata Ibu, Ayah dan Guru di Seluruh Indonesia/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(/4.9 \/ 5.0/i)).toBeInTheDocument();
    expect(screen.getByText(/100% Pembeli Terverifikasi/i)).toBeInTheDocument();

    // Check all 6 distinct reviewers are rendered
    expect(screen.getByText("Ibu Siti Nurjanah")).toBeInTheDocument();
    expect(screen.getByText(/Surabaya, Jawa Timur/i)).toBeInTheDocument();
    expect(screen.getByText("Ustadz Ahmad Fauzi")).toBeInTheDocument();
    expect(screen.getByText(/Bandung, Jawa Barat/i)).toBeInTheDocument();
    expect(screen.getByText("Bapak Hendra Pratama")).toBeInTheDocument();
    expect(screen.getByText("Ibu Dewi Anggraeni")).toBeInTheDocument();
    expect(screen.getByText("Ustadzah Anisa Fitri")).toBeInTheDocument();
    expect(screen.getByText("Ibu Maya Kartika")).toBeInTheDocument();
  });
});
