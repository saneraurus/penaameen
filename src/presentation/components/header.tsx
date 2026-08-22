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

/** Editorial dropdown panel: quiet rows, one accent, no card noise. */
function DropdownPanel({ items }: { items: NavItem[] }) {
  return (
    <ul className="grid w-[420px] gap-0 rounded-xl border border-supporting-200 bg-white p-2 shadow-[0_32px_80px_-24px_rgba(25,22,18,0.28)]">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.title}>
            <NavigationMenuLink asChild>
              <Link
                href={item.href}
                className="group flex gap-4 rounded-lg px-4 py-3.5 transition-colors hover:bg-background-100"
              >
                <span className="mt-0.5 text-supporting-400 transition-colors group-hover:text-accent-600">
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-supporting-900">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-supporting-500">
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
        className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-background-200"
        aria-label="Akun"
        aria-expanded={isOpen}
      >
        <Image
          src={user.imageUrl}
          alt={displayName}
          width={30}
          height={30}
          unoptimized
          className="rounded-full object-cover"
        />
        <span className="hidden max-w-[9rem] truncate pr-1 text-xs font-medium text-supporting-700 sm:block">
          {displayName}
        </span>
      </button>

      {isOpen && (
        <div className="animate-fade-in absolute right-0 top-full z-50 mt-3 w-60 overflow-hidden rounded-xl border border-supporting-200 bg-white shadow-[0_32px_80px_-24px_rgba(25,22,18,0.28)]">
          <div className="border-b border-supporting-100 px-4 py-3.5">
            <p className="truncate text-sm font-medium text-supporting-900">
              {displayName}
            </p>
            <p className="truncate text-xs text-supporting-500">
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="flex w-full items-center gap-2.5 px-4 py-3.5 text-sm text-supporting-700 transition-colors hover:bg-background-100 hover:text-primary-800"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
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

  const desktopLinkClass = (href: string) =>
    `relative px-3.5 text-sm font-medium transition-colors ${
      isActive(href)
        ? "text-primary-900"
        : "text-supporting-600 hover:text-primary-900"
    }`;

  const rule = (active: boolean) =>
    `absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-accent-600 transition-transform duration-300 ${
      active ? "scale-x-100" : "scale-x-0"
    }`;

  return (
    <header
      className={`sticky top-0 z-[60] border-b transition-colors duration-300 ${
        scrolled
          ? "border-supporting-200/80 bg-background-50/92 backdrop-blur-xl"
          : "border-transparent bg-background-50"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between gap-6 py-4">
          {/* Brand */}
          <Link
            href="/"
            className="group flex min-w-0 shrink-0 items-center"
            aria-label="PENA AMEEN"
          >
            <span className="relative block h-9 w-32 sm:h-10 sm:w-40">
              <Image
                src="/images/logo.png"
                alt="PENA AMEEN"
                fill
                className="object-contain object-left"
                priority
                unoptimized
              />
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav
            className="hidden lg:flex lg:flex-1 lg:justify-center"
            aria-label="Navigasi utama"
          >
            <NavigationMenu viewport={false}>
              <NavigationMenuList className="gap-0.5">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/" className={desktopLinkClass("/")}>
                      Beranda
                      <span className={rule(isActive("/"))} />
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="group relative px-3.5 text-sm font-medium text-supporting-600 transition-colors hover:text-primary-900 data-[state=open]:text-primary-900">
                    Metode
                    <span className="absolute inset-x-3.5 -bottom-0.5 h-px origin-left scale-x-0 bg-accent-600 transition-transform duration-300 group-data-[state=open]:scale-x-100" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <DropdownPanel items={programItems} />
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="group relative px-3.5 text-sm font-medium text-supporting-600 transition-colors hover:text-primary-900 data-[state=open]:text-primary-900">
                    Produk
                    <span className="absolute inset-x-3.5 -bottom-0.5 h-px origin-left scale-x-0 bg-accent-600 transition-transform duration-300 group-data-[state=open]:scale-x-100" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <DropdownPanel items={productItems} />
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="group relative px-3.5 text-sm font-medium text-supporting-600 transition-colors hover:text-primary-900 data-[state=open]:text-primary-900">
                    Tentang
                    <span className="absolute inset-x-3.5 -bottom-0.5 h-px origin-left scale-x-0 bg-accent-600 transition-transform duration-300 group-data-[state=open]:scale-x-100" />
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
                      className={desktopLinkClass("/cabang")}
                    >
                      Cabang
                      <span className={rule(isActive("/cabang"))} />
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
                      className={desktopLinkClass("/artikel")}
                    >
                      Artikel
                      <span className={rule(isActive("/artikel"))} />
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <CartIcon />

            <Show when="signed-in">
              <Link
                href="/orders"
                className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-supporting-600 transition-colors hover:text-primary-900 sm:inline-flex"
              >
                <Package className="h-4 w-4" strokeWidth={1.5} />
                Pesanan
              </Link>
              <CustomerMenu />
            </Show>

            <Show when="signed-out">
              <Link
                href="/sign-in"
                className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-supporting-600 transition-colors hover:text-primary-900 sm:inline-flex"
              >
                <LogIn className="h-4 w-4" strokeWidth={1.5} />
                Masuk
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-primary-900 px-5 text-xs font-medium text-background-50 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-800"
              >
                <UserPlus className="h-3.5 w-3.5" strokeWidth={1.5} />
                Daftar
              </Link>
            </Show>

            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-supporting-700 transition-colors hover:bg-background-200 lg:hidden"
              aria-label="Buka menu navigasi"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile full-surface navigation */}
      {isMobileOpen && (
        <div className="lg:hidden">
          <div
            className="animate-fade-in fixed inset-0 z-[70] bg-primary-950/45 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu navigasi"
            className="animate-drawer-in fixed inset-y-0 right-0 z-[80] flex h-full w-full max-w-md flex-col bg-background-50 shadow-[0_32px_80px_-24px_rgba(25,22,18,0.28)]"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="relative block h-9 w-32">
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
                className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-supporting-700 transition-colors hover:bg-background-200"
                aria-label="Tutup menu"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <nav
              className="flex-1 overflow-y-auto px-6 pb-6"
              aria-label="Navigasi seluler"
            >
              <p className="eyebrow mb-4 mt-2">Jelajahi</p>
              <ul className="border-t border-supporting-200">
                <MobileLink
                  href="/"
                  label="Beranda"
                  index="01"
                  onClose={() => setIsMobileOpen(false)}
                />
                <MobileLink
                  href="/metode"
                  label="Metode"
                  index="02"
                  onClose={() => setIsMobileOpen(false)}
                />
                <MobileLink
                  href="/produk"
                  label="Produk"
                  index="03"
                  onClose={() => setIsMobileOpen(false)}
                />
                <MobileLink
                  href="/tentang"
                  label="Tentang"
                  index="04"
                  onClose={() => setIsMobileOpen(false)}
                />
                <MobileLink
                  href="/cabang"
                  label="Cabang"
                  index="05"
                  onClose={() => setIsMobileOpen(false)}
                />
                <MobileLink
                  href="/artikel"
                  label="Artikel"
                  index="06"
                  onClose={() => setIsMobileOpen(false)}
                />
                <MobileLink
                  href="/galeri-kegiatan"
                  label="Galeri Kegiatan"
                  index="07"
                  onClose={() => setIsMobileOpen(false)}
                />
              </ul>

              <div className="mt-8 space-y-2.5">
                <Show when="signed-in">
                  <Link
                    href="/orders"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex min-h-13 items-center justify-center gap-2 rounded-full bg-primary-900 px-6 text-sm font-medium text-background-50"
                  >
                    <Package className="h-4 w-4" strokeWidth={1.5} />
                    Pesanan Saya
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileOpen(false);
                      signOut();
                    }}
                    className="flex min-h-13 w-full items-center justify-center gap-2 rounded-full border border-supporting-300 px-6 text-sm font-medium text-supporting-700 transition-colors hover:border-primary-700 hover:text-primary-800"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.5} />
                    Keluar
                  </button>
                </Show>
                <Show when="signed-out">
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex min-h-13 items-center justify-center gap-2 rounded-full bg-primary-900 px-6 text-sm font-medium text-background-50"
                  >
                    <LogIn className="h-4 w-4" strokeWidth={1.5} />
                    Masuk
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex min-h-13 items-center justify-center gap-2 rounded-full border border-supporting-300 px-6 text-sm font-medium text-supporting-800 transition-colors hover:border-primary-700"
                  >
                    <UserPlus className="h-4 w-4" strokeWidth={1.5} />
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
  index,
  onClose,
}: {
  href: string;
  label: string;
  index: string;
  onClose: () => void;
}) {
  return (
    <li className="border-b border-supporting-200">
      <Link
        href={href}
        onClick={onClose}
        className="group flex items-baseline gap-4 py-4 transition-colors hover:text-accent-700"
      >
        <span
          aria-hidden="true"
          className="text-[10px] font-medium tracking-[0.2em] text-supporting-400"
        >
          {index}
        </span>
        <span className="font-serif text-2xl text-supporting-900 transition-colors group-hover:text-accent-700">
          {label}
        </span>
      </Link>
    </li>
  );
}
