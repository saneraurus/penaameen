import { getContentSeoHealth } from "@/lib/seo/content-health";
import { getGalleryHealth } from "@/lib/media/gallery-health";
import { getRedirectInventoryHealth } from "@/lib/seo/redirect-inventory";
import { getNotificationDeliveryHealth } from "@/lib/notifications/delivery-health";

export async function getOperationalAnalytics() {
  const [content, notification] = await Promise.all([
    getContentSeoHealth(),
    Promise.resolve(getNotificationDeliveryHealth()),
  ]);

  return {
    state: "partial" as const,
    provider: "not_selected" as const,
    consent: "not_configured" as const,
    kpis: {
      orders: {
        state: "unknown" as const,
        detail:
          "Analytics provider and approved KPI policy are not configured.",
      },
      revenue: {
        state: "unknown" as const,
        detail: "Authoritative finance data is not an analytics KPI source.",
      },
      conversion: {
        state: "unknown" as const,
        detail: "Consent and funnel measurement policy are not approved.",
      },
    },
    operational: {
      content,
      gallery: getGalleryHealth(),
      redirects: getRedirectInventoryHealth(),
      notifications: notification,
    },
  };
}
