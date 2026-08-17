import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { Header } from "@/presentation/components/header";
import { Footer } from "@/presentation/components/footer";
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
            <div className="min-h-screen flex flex-col">
              <Header />
              <main id="main-content">{children}</main>
              <Footer />
            </div>
          </CartProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}