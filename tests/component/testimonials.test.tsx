import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";

describe("TestimonialsSection Component", () => {
  it("renders the main title, trust stats, and mother reviews", () => {
    render(<TestimonialsSection />);

    expect(
      screen.getByRole("heading", {
        name: /Kisah Nyata Ibu, Ayah & Guru di Seluruh Indonesia/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(/4.9 \/ 5.0/i)).toBeInTheDocument();
    expect(screen.getByText(/100% Pembeli Terverifikasi/i)).toBeInTheDocument();

    // Check mother name rendering
    expect(screen.getByText("Ibu Siti Nurjanah")).toBeInTheDocument();
    expect(screen.getByText(/Surabaya, Jawa Timur/i)).toBeInTheDocument();
  });

  it("navigates next and previous using carousel control buttons", () => {
    render(<TestimonialsSection />);

    const nextBtn = screen.getByRole("button", {
      name: /Testimoni Selanjutnya/i,
    });
    const prevBtn = screen.getByRole("button", {
      name: /Testimoni Sebelumnya/i,
    });

    expect(nextBtn).toBeInTheDocument();
    expect(prevBtn).toBeInTheDocument();

    // Click next
    fireEvent.click(nextBtn);

    // Click prev
    fireEvent.click(prevBtn);
    expect(screen.getByText("Ibu Siti Nurjanah")).toBeInTheDocument();
  });

  it("filters testimonials when clicking category tabs", () => {
    render(<TestimonialsSection />);

    const guruTab = screen.getByRole("button", { name: /Guru & TPQ/i });
    expect(guruTab).toBeInTheDocument();

    fireEvent.click(guruTab);
    expect(screen.getByText(/Ustadzah dr. Anisa Fitri/i)).toBeInTheDocument();
  });

  it("opens and closes screenshot proof modal", () => {
    render(<TestimonialsSection />);

    const proofBtns = screen.getAllByRole("button", { name: /Bukti Chat/i });
    expect(proofBtns.length).toBeGreaterThan(0);

    fireEvent.click(proofBtns[0]!);
    expect(screen.getByText(/Bukti Ulasan Asli:/i)).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "✕" });
    fireEvent.click(closeBtn);
    expect(screen.queryByText(/Bukti Ulasan Asli:/i)).not.toBeInTheDocument();
  });
});
