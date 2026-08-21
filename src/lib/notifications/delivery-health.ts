import { getApiSettings } from "@/lib/admin/api-settings";
import { getNotificationStoreHealth } from "@/lib/admin/notifications";

export function getNotificationDeliveryHealth() {
  const settings = getApiSettings();
  const apiKey = settings.autoEmail.apiKey;
  const configured = Boolean(apiKey) && !/REDACTED|\.\.\./i.test(apiKey);
  return {
    store: getNotificationStoreHealth(),
    email: {
      provider: settings.autoEmail.provider,
      state: configured
        ? ("configured_unverified" as const)
        : ("blocked" as const),
      detail: configured
        ? "Provider credentials present; delivery/domain verification still required."
        : "Email provider credentials are missing or placeholder.",
    },
  };
}
