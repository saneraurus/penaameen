import { describe, expect, it } from "vitest";
import { getGalleryHealth } from "@/lib/media/gallery-health";
import { getRedirectInventoryHealth } from "@/lib/seo/redirect-inventory";

describe("Step 6 media and redirect boundaries", () => {
  it("reports local gallery availability without approving rights", () => {
    const health = getGalleryHealth();
    expect(health.source).toBe("local-static-gallery");
    expect(health.rightsState).toBe("unknown");
  });
  it("keeps redirect inventory blocked until migration evidence exists", () => {
    expect(getRedirectInventoryHealth()).toMatchObject({
      state: "blocked",
      total: 0,
      validated: 0,
    });
  });
});
