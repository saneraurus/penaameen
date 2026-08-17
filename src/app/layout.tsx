import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { SiteLayoutWrapper } from "@/presentation/components/SiteLayoutWrapper";
import { createFoundationMetadata } from "@/presentation/foundation-metadata";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/context/CartContext";
import { AmeenProvider } from "@/context/AmeenContext";
import { AmeenAssistant } from "@/presentation/components/assistant/AmeenAssistant";

export const metadata: Metadata = createFoundationMetadata("Beranda");

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#091a0e",
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "PENA AMEEN",
  url: "https://penaameen.com",
  logo: "https://penaameen.com/images/penaameen/logo.png",
  description:
    "Penerbit resmi metode belajar membaca Al-Barqy (200 Menit) dan ACM (Aku Cepat Membaca Tanpa Mengeja) sejak 1995.",
  foundingDate: "1995",
  address: {
    "@type": "PostalAddress",
    addressCountry: "ID",
  },
  sameAs: ["https://www.instagram.com/penaameen"],
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdOrganization),
          }}
        />
      </head>
      <body>
        <ClerkProvider>
          <CartProvider>
            <AmeenProvider>
              <a className="skip-link" href="#main-content">
                Skip to main content
              </a>
              <SiteLayoutWrapper>{children}</SiteLayoutWrapper>
              <AmeenAssistant />
            </AmeenProvider>
          </CartProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
