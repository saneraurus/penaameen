"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/presentation/components/header";
import { Footer } from "@/presentation/components/footer";

export function SiteLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="admin-shell flex min-h-screen flex-col">
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
