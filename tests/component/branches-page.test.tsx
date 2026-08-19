import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BranchListPage from "@/app/cabang/page";
import BranchDetailPage from "@/app/cabang/[slug]/page";

describe("BranchListPage Component", () => {
  it("renders page title and initial branch list with DKI Jakarta badge", () => {
    render(<BranchListPage />);

    expect(
      screen.getByRole("heading", { name: /Jaringan Cabang & Perwakilan/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Cabang DKI Jakarta")).toBeInTheDocument();
    expect(screen.getByText("5 Titik Mitra")).toBeInTheDocument();
  });

  it("filters branch results by search query matching outlet PIC or name", () => {
    render(<BranchListPage />);

    const searchInput = screen.getByPlaceholderText(/Cari wilayah, kota/i);

    // Search for "Kinderhouse"
    fireEvent.change(searchInput, { target: { value: "Kinderhouse" } });
    expect(screen.getByText("Cabang DKI Jakarta")).toBeInTheDocument();
    expect(screen.getByText(/KINDERHOUSE:/i)).toBeInTheDocument();

    // Search for "Dita Yusuf"
    fireEvent.change(searchInput, { target: { value: "Dita Yusuf" } });
    expect(screen.getByText("Cabang DKI Jakarta")).toBeInTheDocument();

    // Search for something non-existent
    fireEvent.change(searchInput, { target: { value: "KotaTidakAda123" } });
    expect(
      screen.getByText(/Tidak ada cabang yang cocok/i),
    ).toBeInTheDocument();
  });
});

describe("BranchDetailPage Component", () => {
  it("renders all 5 outlets for DKI Jakarta", () => {
    render(<BranchDetailPage params={{ slug: "dki-jakarta" }} />);

    expect(
      screen.getByRole("heading", { name: "Cabang DKI Jakarta" }),
    ).toBeInTheDocument();

    // Verify all 5 outlets from the table
    expect(screen.getByText("KINDERHOUSE")).toBeInTheDocument();
    expect(
      screen.getByText("ANINDITYA NAFIANTI / DITA YUSUF"),
    ).toBeInTheDocument();

    expect(screen.getByText("Mitra Tebet")).toBeInTheDocument();
    expect(screen.getByText("EDVIN SOFTARINI")).toBeInTheDocument();

    expect(screen.getByText("MASJID RAYA PONDOK INDAH")).toBeInTheDocument();
    expect(screen.getByText("JUMAL AHMAD")).toBeInTheDocument();

    expect(screen.getByText("AZZAHRA, PAUD")).toBeInTheDocument();
    expect(screen.getByText("NN")).toBeInTheDocument();

    expect(screen.getByText("RESELLER AL-BARQY")).toBeInTheDocument();
    expect(screen.getByText("SURYANTO AL BARQY")).toBeInTheDocument();
  });

  it("allows filtering outlets by sub-city in DKI Jakarta", () => {
    render(<BranchDetailPage params={{ slug: "dki-jakarta" }} />);

    const jakbarBtn = screen.getByRole("button", {
      name: /Jakarta Barat \(2\)/i,
    });
    fireEvent.click(jakbarBtn);

    expect(screen.getByText("KINDERHOUSE")).toBeInTheDocument();
    expect(screen.getByText("AZZAHRA, PAUD")).toBeInTheDocument();
    expect(screen.queryByText("EDVIN SOFTARINI")).not.toBeInTheDocument();
  });
});
