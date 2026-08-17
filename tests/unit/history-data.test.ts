import { describe, expect, it } from "vitest";

import {
  historyFacts,
  historyFounders,
  historyMilestones,
  historyReach,
  literacyPartners,
  methodTraits,
} from "@/data/history";

describe("history content", () => {
  it("exposes six milestones with unique ids and complete fields", () => {
    expect(historyMilestones).toHaveLength(6);

    const ids = historyMilestones.map((milestone) => milestone.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const milestone of historyMilestones) {
      expect(milestone.period.length).toBeGreaterThan(0);
      expect(milestone.navLabel.length).toBeGreaterThan(0);
      expect(milestone.title.length).toBeGreaterThan(0);
      expect(milestone.summary.length).toBeGreaterThan(0);
      expect(milestone.narrative.length).toBeGreaterThan(0);
      expect(milestone.highlights.length).toBeGreaterThan(0);
      expect(milestone.image.startsWith("/images/")).toBe(true);
      expect(milestone.imageAlt.length).toBeGreaterThan(0);
    }
  });

  it("keeps the milestones in chronological order of the source history", () => {
    expect(historyMilestones.map((milestone) => milestone.period)).toEqual([
      "1995",
      "Pengembangan",
      "Kemitraan",
      "2013",
      "2013–2015",
      "Kini",
    ]);
  });

  it("records both founding companies with their origin", () => {
    expect(historyFounders.map((founder) => founder.name)).toEqual([
      "PENA SUCI",
      "AL AMEEN SERVE HOLDING",
    ]);
    expect(historyFounders.map((founder) => founder.origin)).toEqual([
      "Indonesia",
      "Malaysia",
    ]);
  });

  it("lists only the countries and partners named in the source history", () => {
    expect(historyReach.map((place) => place.country)).toEqual([
      "Indonesia",
      "Malaysia",
      "Singapura",
      "Thailand",
    ]);
    expect(literacyPartners.map((partner) => partner.name)).toEqual([
      "Kabupaten Malang",
      "NTB",
      "Sampoerna Agro Tbk",
    ]);
  });

  it("states the two founding years and both method traits sets", () => {
    const facts = historyFacts.map((fact) => fact.value);
    expect(facts).toContain("1995");
    expect(facts).toContain("2013");

    expect(methodTraits).toEqual([
      "Mudah",
      "Cepat",
      "Menyenangkan",
      "Anti lupa",
    ]);
  });
});
