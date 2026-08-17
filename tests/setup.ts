import "@testing-library/jest-dom/vitest";

// Mock IntersectionObserver for framer-motion and viewport animations
if (typeof window !== "undefined") {
  class MockIntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: ReadonlyArray<number> = [];
    disconnect() {}
    observe() {}
    takeRecords() {
      return [];
    }
    unobserve() {}
  }

  window.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
  global.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
}
