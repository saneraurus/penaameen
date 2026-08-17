import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { SiteLayoutWrapper } from "@/presentation/components/SiteLayoutWrapper";
import { createFoundationMetadata } from "@/presentation/foundation-metadata";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = createFoundationMetadata("Foundation");

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id">
      <body>
        <ClerkProvider>
          <CartProvider>
            <a className="skip-link" href="#main-content">
              Skip to main content
            </a>
            <SiteLayoutWrapper>{children}</SiteLayoutWrapper>
          </CartProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}