import { describe, expect, it } from "vitest";
import {
  branches,
  getBranchBySlug,
  getBranchesByRegion,
} from "@/data/branches";

describe("branches data", () => {
  it("exposes all regional branches with valid slugs and regions", () => {
    expect(branches.length).toBeGreaterThanOrEqual(8);

    const slugs = branches.map((b) => b.slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    const ids = branches.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("contains 5 verified outlets for DKI Jakarta", () => {
    const dki = getBranchBySlug("dki-jakarta");
    expect(dki).toBeDefined();
    expect(dki?.region).toBe("DKI Jakarta");
    expect(dki?.isVerified).toBe(true);
    expect(dki?.outlets).toHaveLength(5);

    const outlets = dki!.outlets!;

    // 1. KINDERHOUSE
    expect(outlets[0]?.name).toBe("KINDERHOUSE");
    expect(outlets[0]?.pic).toBe("ANINDITYA NAFIANTI / DITA YUSUF");
    expect(outlets[0]?.address).toContain("Jati Pulo Jakarta Barat");
    expect(outlets[0]?.contact).toBe("087775084244");

    // 2. EDVIN SOFTARINI
    expect(outlets[1]?.pic).toBe("EDVIN SOFTARINI");
    expect(outlets[1]?.address).toContain("Tebet Jakarta Selatan");
    expect(outlets[1]?.contact).toBe("081333316800");

    // 3. MASJID RAYA PONDOK INDAH
    expect(outlets[2]?.name).toBe("MASJID RAYA PONDOK INDAH");
    expect(outlets[2]?.pic).toBe("JUMAL AHMAD");
    expect(outlets[2]?.address).toContain(
      "Ciganjur - Jagakarsa - Jakarta Selatan",
    );
    expect(outlets[2]?.contact).toBe("085719647457");

    // 4. AZZAHRA, PAUD
    expect(outlets[3]?.name).toBe("AZZAHRA, PAUD");
    expect(outlets[3]?.pic).toBe("NN");
    expect(outlets[3]?.address).toContain("Bambu Selatan Palmerah");
    expect(outlets[3]?.contact).toBe("08988013437");

    // 5. RESELLER AL-BARQY
    expect(outlets[4]?.name).toContain("RESELLER");
    expect(outlets[4]?.pic).toBe("SURYANTO AL BARQY");
    expect(outlets[4]?.address).toContain("Kebagusan Raya");
    expect(outlets[4]?.contact).toBe("08581023913");
  });

  it("filters branches correctly by region and slug", () => {
    const jkt = getBranchesByRegion("DKI Jakarta");
    expect(jkt).toHaveLength(1);
    expect(jkt[0]?.slug).toBe("dki-jakarta");

    const nonExistent = getBranchBySlug("non-existent");
    expect(nonExistent).toBeUndefined();
  });
});
