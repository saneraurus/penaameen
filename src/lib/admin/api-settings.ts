import fs from "fs";
import path from "path";

export interface ApiSettings {
  midtrans: {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
    merchantId: string;
    webhookUrl: string;
  };
  rajaongkir: {
    apiKey: string;
    tier: "starter" | "basic" | "pro";
    originCityId: string;
    originCityName: string;
    enabledCouriers: string[];
  };
  autoEmail: {
    provider: "resend" | "smtp" | "sendgrid";
    apiKey: string;
    smtpHost: string;
    smtpPort: string;
    smtpUser: string;
    smtpPass: string;
    senderEmail: string;
    senderName: string;
    sendInvoiceOnPaid: boolean;
    sendTrackingOnShipped: boolean;
    notifyAdminOnOrder: boolean;
  };
  emailForwarding: {
    forwardingEmail: string;
    whatsappAdminPhone: string;
    enableWhatsappNotification: boolean;
  };
  clerkAuth: {
    publishableKey: string;
    secretKey: string;
    adminEmails: string;
  };
}

const SETTINGS_FILE = path.join(process.cwd(), "src/data/api_settings.json");

export function getApiSettings(): ApiSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed as ApiSettings;
      }
    }
  } catch (e) {
    console.warn("Could not read api_settings.json:", e);
  }

  // Initial defaults
  const defaults: ApiSettings = {
    midtrans: {
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey: process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-[REDACTED]",
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SB-Mid-client-[REDACTED]",
      merchantId: "G982341209",
      webhookUrl: "https://penaameen.com/api/webhooks/midtrans",
    },
    rajaongkir: {
      apiKey: process.env.RAJAONGKIR_API_KEY || "ro_key_sandbox_9823471029",
      tier: "starter",
      originCityId: "444",
      originCityName: "Surabaya, Jawa Timur",
      enabledCouriers: ["jne", "jnt", "sicepat", "pos"],
    },
    autoEmail: {
      provider: "resend",
      apiKey: process.env.RESEND_API_KEY || "re_[REDACTED]",
      smtpHost: "smtp.resend.com",
      smtpPort: "587",
      smtpUser: "resend",
      smtpPass: "",
      senderEmail: "noreply@penaameen.com",
      senderName: "Pena Ameen Official",
      sendInvoiceOnPaid: true,
      sendTrackingOnShipped: true,
      notifyAdminOnOrder: true,
    },
    emailForwarding: {
      forwardingEmail: "ihsanzz099@gmail.com",
      whatsappAdminPhone: "08123456789",
      enableWhatsappNotification: true,
    },
    clerkAuth: {
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_...",
      secretKey: process.env.CLERK_SECRET_KEY || "sk_tes-[REDACTED]...",
      adminEmails: process.env.ADMIN_EMAILS || "ihsanzz099@gmail.com,admin@penaameen.com",
    },
  };

  saveApiSettings(defaults);
  return defaults;
}

export function saveApiSettings(settings: ApiSettings): void {
  try {
    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write api_settings.json:", e);
  }
}
