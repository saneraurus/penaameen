import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { SiteFooter } from "@/presentation/components/foundation/site-footer";
import { SiteHeader } from "@/presentation/components/foundation/site-header";
import { createFoundationMetadata } from "@/presentation/foundation-metadata";

export const metadata: Metadata = createFoundationMetadata("Foundation");

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <div className="foundation-shell">
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
