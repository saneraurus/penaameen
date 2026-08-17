import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HistoryTimelineSection } from "@/components/sections/HistoryTimelineSection";
import { historyMilestones } from "@/data/history";

/**
 * Only the active milestone panel stays in the accessibility tree: inactive
 * panels keep the `hidden` attribute, so role queries expose exactly one.
 * Visibility assertions are avoided because the `Reveal` wrapper starts at
 * `opacity: 0` and jsdom never fires the mocked IntersectionObserver.
 */
const exposedPanel = () => {
  const panels = screen.getAllByRole("tabpanel");
  expect(panels).toHaveLength(1);
  return panels[0]!;
};

describe("HistoryTimelineSection Component", () => {
  it("renders the section heading and one tab per milestone", () => {
    render(<HistoryTimelineSection />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Enam Babak Perjalanan",
    );
    expect(screen.getAllByRole("tab")).toHaveLength(historyMilestones.length);
  });

  it("keeps every milestone narrative in the DOM so the history stays crawlable", () => {
    render(<HistoryTimelineSection />);

    for (const milestone of historyMilestones) {
      expect(screen.getByText(milestone.narrative)).toBeInTheDocument();
    }
  });

  it("exposes only the first milestone panel initially", () => {
    render(<HistoryTimelineSection />);

    const first = historyMilestones[0]!;

    expect(exposedPanel()).toHaveTextContent(first.title);
    expect(exposedPanel()).toHaveAttribute(
      "aria-labelledby",
      `sejarah-tab-${first.id}`,
    );
  });

  it("switches the exposed panel when another tab is clicked", () => {
    render(<HistoryTimelineSection />);

    const target = historyMilestones[3]!;
    const tab = screen.getByRole("tab", { name: /PENA AMEEN/i });
    fireEvent.click(tab);

    expect(tab).toHaveAttribute("aria-selected", "true");
    expect(exposedPanel()).toHaveAttribute(
      "aria-labelledby",
      `sejarah-tab-${target.id}`,
    );
    expect(exposedPanel()).toHaveTextContent(target.title);
  });

  it("moves selection with arrow, Home, and End keys", () => {
    render(<HistoryTimelineSection />);

    const tabs = screen.getAllByRole("tab");
    const last = historyMilestones[historyMilestones.length - 1]!;

    fireEvent.keyDown(tabs[0]!, { key: "ArrowDown" });
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(exposedPanel()).toHaveTextContent(historyMilestones[1]!.title);

    fireEvent.keyDown(tabs[1]!, { key: "ArrowUp" });
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(tabs[0]!, { key: "End" });
    expect(tabs[tabs.length - 1]).toHaveAttribute("aria-selected", "true");
    expect(exposedPanel()).toHaveTextContent(last.title);

    fireEvent.keyDown(tabs[tabs.length - 1]!, { key: "Home" });
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });

  it("uses a roving tabindex so the tablist is a single tab stop", () => {
    render(<HistoryTimelineSection />);

    const tabs = screen.getAllByRole("tab");

    expect(tabs[0]).toHaveAttribute("tabindex", "0");
    for (const tab of tabs.slice(1)) {
      expect(tab).toHaveAttribute("tabindex", "-1");
    }
  });

  it("disables the sequential control at each end of the timeline", () => {
    render(<HistoryTimelineSection />);

    const previous = screen.getByRole("button", { name: "Babak sebelumnya" });
    const next = screen.getByRole("button", { name: "Babak selanjutnya" });

    expect(previous).toBeDisabled();
    expect(next).not.toBeDisabled();

    fireEvent.click(next);
    expect(previous).not.toBeDisabled();
    expect(exposedPanel()).toHaveTextContent(historyMilestones[1]!.title);

    fireEvent.keyDown(screen.getAllByRole("tab")[1]!, { key: "End" });
    expect(next).toBeDisabled();
    expect(previous).not.toBeDisabled();
  });
});
