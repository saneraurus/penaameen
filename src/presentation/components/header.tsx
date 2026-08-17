"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  Package,
  LogIn,
  UserPlus,
  Menu,
  X,
  LogOut,
  BookText,
  GraduationCap,
  MapPin,
  LayoutGrid,
  Layers,
  NotebookPen,
  Info,
  Building2,
  Images,
  type LucideIcon,
} from "lucide-react";
import { Show } from "@clerk/nextjs";
import { CartIcon } from "@/components/cart/CartIcon";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

type NavItem = {
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

const programItems: NavItem[] = [
  {
    title: "Metode Al-Barqy",
    href: "/metode",
    description:
      "Metode cepat membaca Al-Qur'an dalam 200 menit yang teruji sejak 1965.",
    icon: BookText,
  },
  {
    title: "Paket Home Learning",
    href: "/produk",
    description: "Panduan lengkap belajar mandiri di rumah bersama keluarga.",
    icon: GraduationCap,
  },
  {
    title: "Jaringan Cabang & Bimbingan",
    href: "/cabang",
    description: "Temukan cabang bimbingan dan pelatihan guru di kota Anda.",
    icon: MapPin,
  },
];

const productItems: NavItem[] = [
  {
    title: "Katalog Produk",
    href: "/produk",
    description: "Jelajahi buku materi, paket panduan, dan media belajar.",
    icon: LayoutGrid,
  },
  {
    title: "Flashcard Al-Barqy",
    href: "/produk",
    description: "Kartu visual interaktif untuk huruf hijaiyah dengan ceria.",
    icon: Layers,
  },
  {
    title: "Buku Aktivitas & Latihan",
    href: "/produk",
    description:
      "Buku kerja menulis arab, mewarnai islami, dan latihan tajwid.",
    icon: NotebookPen,
  },
];

const aboutItems: NavItem[] = [
  {
    title: "Tentang PENA AMEEN",
    href: "/tentang",
    description:
      "Mengenal dedikasi, visi, dan perjalanan pendidikan Al-Qur'an.",
    icon: Info,
  },
  {
    title: "Jaringan Cabang",
    href: "/cabang",
    description: "Daftar alamat dan kontak cabang resmi di seluruh Indonesia.",
    icon: Building2,
  },
  {
    title: "Galeri Kegiatan",
    href: "/galeri-kegiatan",
    description:
      "Foto dokumentasi pelatihan, workshop, dan kegiatan komunitas PENA AMEEN.",
    icon: Images,
  },
];

function DropdownPanel({ items }: { items: NavItem[] }) {
  return (
    <ul className="grid w-[460px] gap-1 rounded-2xl border border-supporting-200 bg-white p-3 shadow-xl">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.title}>
            <NavigationMenuLink asChild>
              <Link
                href={item.href}
                className="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-primary-50/80"
              >
                <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-primary-900 group-hover:text-primary-700">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-supporting-500">
                    {item.description}
                  </span>
                </span>
              </Link>
            </NavigationMenuLink>
          </li>
        );
      })}
    </ul>
  );
}

function CustomerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!isLoaded || !user) return null;

  const displayName = user.fullName || user.firstName || "Akun";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl p-1.5 text-supporting-700 transition-colors hover:bg-supporting-100/80"
        aria-label="Akun"
        aria-expanded={isOpen}
      >
        <Image
          src={user.imageUrl}
          alt={displayName}
          width={28}
          height={28}
          unoptimized
          className="rounded-full object-cover ring-1 ring-supporting-200"
        />
        <span className="hidden text-xs font-medium sm:block">
          {displayName}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-supporting-200 bg-white py-1.5 shadow-xl animate-fade-in">
          <div className="px-3.5 py-2.5 border-b border-supporting-100">
            <p className="text-xs font-semibold text-supporting-900 truncate">
              {displayName}
            </p>
            <p className="text-[11px] text-supporting-500 truncate">
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="flex w-full items-center gap-2 px-3.5 py-2.5 text-xs font-medium text-supporting-700 transition-colors hover:bg-primary-50 hover:text-primary-700"
          >
            <LogOut className="h-3.5 w-3.5" />
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { signOut } = useClerk();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isMobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-supporting-200/80 bg-white/80 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between gap-4 py-3.5">
          {/* Brand */}
          <Link
            href="/"
            className="group flex items-center py-1"
            aria-label="PENA AMEEN"
          >
            <span className="relative block h-11 w-44 sm:h-12 sm:w-52">
              <Image
                src="/images/logo.png"
                alt="PENA AMEEN"
                fill
                className="object-contain object-left transition-transform duration-200 group-hover:scale-[1.02]"
                priority
                unoptimized
              />
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav
            className="hidden lg:flex items-center"
            aria-label="Navigasi utama"
          >
            <NavigationMenu viewport={false}>
              <NavigationMenuList className="gap-1">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link
                      href="/"
                      className={`relative px-4 font-medium transition-colors ${
                        isActive("/")
                          ? "text-primary-700"
                          : "text-supporting-700 hover:text-primary-700"
                      }`}
                    >
                      Beranda
                      <span
                        className={`absolute inset-x-4 -bottom-1 h-0.5 rounded-full bg-primary-600 transition-opacity ${
                          isActive("/") ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="group relative px-4 font-medium text-supporting-700 transition-colors hover:text-primary-700 data-[state=open]:text-primary-700">
                    Metode
                    <span className="absolute inset-x-4 -bottom-1 h-0.5 rounded-full bg-primary-600 opacity-0 transition-opacity group-data-[state=open]:opacity-100" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <DropdownPanel items={programItems} />
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="group relative px-4 font-medium text-supporting-700 transition-colors hover:text-primary-700 data-[state=open]:text-primary-700">
                    Produk
                    <span className="absolute inset-x-4 -bottom-1 h-0.5 rounded-full bg-primary-600 opacity-0 transition-opacity group-data-[state=open]:opacity-100" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <DropdownPanel items={productItems} />
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="group relative px-4 font-medium text-supporting-700 transition-colors hover:text-primary-700 data-[state=open]:text-primary-700">
                    Tentang
                    <span className="absolute inset-x-4 -bottom-1 h-0.5 rounded-full bg-primary-600 opacity-0 transition-opacity group-data-[state=open]:opacity-100" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <DropdownPanel items={aboutItems} />
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link
                      href="/cabang"
                      className={`relative px-4 font-medium transition-colors ${
                        isActive("/cabang")
                          ? "text-primary-700"
                          : "text-supporting-700 hover:text-primary-700"
                      }`}
                    >
                      Cabang
                      <span
                        className={`absolute inset-x-4 -bottom-1 h-0.5 rounded-full bg-primary-600 transition-opacity ${
                          isActive("/cabang") ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link
                      href="/artikel"
                      className={`relative px-4 font-medium transition-colors ${
                        isActive("/artikel")
                          ? "text-primary-700"
                          : "text-supporting-700 hover:text-primary-700"
                      }`}
                    >
                      Artikel
                      <span
                        className={`absolute inset-x-4 -bottom-1 h-0.5 rounded-full bg-primary-600 transition-opacity ${
                          isActive("/artikel") ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <CartIcon />

            <Show when="signed-in">
              <Link
                href="/orders"
                className="hidden items-center gap-1.5 rounded-xl border border-primary-200 bg-primary-50 px-3.5 py-1.5 text-xs font-semibold text-primary-800 transition-colors hover:bg-primary-100 sm:inline-flex"
              >
                <Package className="h-3.5 w-3.5" />
                Pesanan
              </Link>
              <CustomerMenu />
            </Show>

            <Show when="signed-out">
              <Link
                href="/sign-in"
                className="hidden items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-supporting-700 transition-colors hover:text-primary-700 sm:inline-flex"
              >
                <LogIn className="h-3.5 w-3.5" />
                Masuk
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-primary-700"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Daftar
              </Link>
            </Show>

            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="rounded-xl p-2 text-supporting-600 transition-colors hover:bg-supporting-100/80 hover:text-primary-700 lg:hidden"
              aria-label="Buka menu navigasi"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-over drawer */}
      {isMobileOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-40 bg-supporting-900/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu navigasi"
            className="fixed right-0 top-0 z-50 flex h-full w-[84%] max-w-sm animate-fade-in flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-supporting-200/80 px-5 py-4">
              <span className="relative block h-9 w-36">
                <Image
                  src="/images/logo.png"
                  alt="PENA AMEEN"
                  fill
                  className="object-contain object-left"
                  unoptimized
                />
              </span>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="rounded-xl p-2 text-supporting-600 transition-colors hover:bg-supporting-100 hover:text-primary-700"
                aria-label="Tutup menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav
              className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
              aria-label="Navigasi seluler"
            >
              <MobileLink
                href="/"
                label="Beranda"
                onClose={() => setIsMobileOpen(false)}
              />
              <MobileLink
                href="/metode"
                label="Metode"
                onClose={() => setIsMobileOpen(false)}
              />
              <MobileLink
                href="/produk"
                label="Produk"
                onClose={() => setIsMobileOpen(false)}
              />
              <MobileLink
                href="/tentang"
                label="Tentang"
                onClose={() => setIsMobileOpen(false)}
              />
              <MobileLink
                href="/cabang"
                label="Cabang"
                onClose={() => setIsMobileOpen(false)}
              />
              <MobileLink
                href="/artikel"
                label="Artikel"
                onClose={() => setIsMobileOpen(false)}
              />
              <MobileLink
                href="/galeri-kegiatan"
                label="Galeri Kegiatan"
                onClose={() => setIsMobileOpen(false)}
              />

              <div className="border-t border-supporting-200/70 px-2 pt-4">
                <Show when="signed-in">
                  <Link
                    href="/orders"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-xs"
                  >
                    <Package className="h-4 w-4" />
                    Pesanan Saya
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileOpen(false);
                      signOut();
                    }}
                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-supporting-200 px-4 py-3 text-sm font-semibold text-supporting-700 transition-colors hover:bg-supporting-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </button>
                </Show>
                <Show when="signed-out">
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-xs"
                  >
                    <LogIn className="h-4 w-4" />
                    Masuk
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setIsMobileOpen(false)}
                    className="mt-2 flex items-center justify-center gap-1.5 rounded-xl border border-primary-200 px-4 py-3 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
                  >
                    <UserPlus className="h-4 w-4" />
                    Daftar
                  </Link>
                </Show>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileLink({
  href,
  label,
  onClose,
}: {
  href: string;
  label: string;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="block rounded-xl px-3 py-3 font-semibold text-supporting-800 transition-colors hover:bg-primary-50 hover:text-primary-700"
    >
      {label}
    </Link>
  );
}
