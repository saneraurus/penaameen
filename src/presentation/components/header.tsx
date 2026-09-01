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
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Show } from "@clerk/nextjs";
import { CartIcon } from "@/components/cart/CartIcon";
import { cn } from "@/lib/utils";
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

/** Editorial dropdown — ink header, parchment body, numbered rows. */
function DropdownPanel({
  items,
  kicker,
  title,
  footerHref,
  footerLabel,
}: {
  items: NavItem[];
  kicker: string;
  title: string;
  footerHref: string;
  footerLabel: string;
}) {
  return (
    <div className="w-[360px] overflow-hidden rounded-2xl border border-supporting-200 bg-white shadow-[0_16px_40px_-12px_rgba(24,23,18,0.18),0_4px_16px_-8px_rgba(24,23,18,0.08)]">
      {/* Ink header - compact */}
      <div className="relative bg-primary-950 px-4 py-2.5">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent-400 via-accent-500 to-transparent opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(232,184,148,0.1),_transparent_60%)]" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-[0.16em] text-accent-300 uppercase">
              <Sparkles
                className="h-2.5 w-2.5 text-accent-400"
                strokeWidth={1.5}
              />
              {kicker}
            </span>
            <span className="h-2.5 w-px bg-white/15" aria-hidden="true" />
            <span className="font-serif text-xs italic tracking-tight text-white/80">
              {title}
            </span>
          </div>
          <span className="hidden items-center gap-1 text-[9px] tracking-[0.14em] text-white/30 sm:inline-flex">
            {String(items.length).padStart(2, "0")} PILIHAN
            <ArrowUpRight
              className="h-2.5 w-2.5 opacity-60"
              strokeWidth={1.5}
            />
          </span>
        </div>
      </div>

      {/* List - compact */}
      <ul className="p-1.5">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <li key={item.title} className="group/item">
              <NavigationMenuLink asChild>
                <Link
                  href={item.href}
                  className="group relative flex gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-background-100/80"
                >
                  {/* left accent on hover */}
                  <span className="pointer-events-none absolute left-0 top-3 bottom-3 w-0.5 origin-top rounded-full bg-accent-500 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                  {/* icon box */}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-supporting-200 bg-background-100 text-supporting-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-200 group-hover:border-accent-200 group-hover:bg-white group-hover:text-primary-700 group-hover:shadow-sm">
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="font-serif text-[13px] font-semibold leading-none text-supporting-900 transition-colors group-hover:text-primary-900">
                        {item.title}
                      </span>
                      <span className="rounded-full bg-supporting-100 px-1 py-0.5 text-[9px] font-medium tracking-[0.14em] text-supporting-500 transition-colors group-hover:bg-accent-100 group-hover:text-accent-800">
                        0{idx + 1}
                      </span>
                    </span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-supporting-500 line-clamp-2">
                      {item.description}
                    </span>
                  </span>
                  <span className="mt-0.5 hidden h-6 w-6 shrink-0 items-center justify-center rounded-full border border-transparent bg-transparent text-supporting-300 transition-all duration-200 group-hover:border-supporting-200 group-hover:bg-white group-hover:text-primary-700 group-hover:shadow-sm sm:inline-flex">
                    <ArrowRight
                      className="h-3 w-3 -translate-x-0.5 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                      strokeWidth={1.5}
                    />
                  </span>
                </Link>
              </NavigationMenuLink>
              {idx !== items.length - 1 && (
                <div className="mx-3 h-px bg-supporting-100/80 group-hover/item:bg-transparent" />
              )}
            </li>
          );
        })}
      </ul>

      {/* Footer - compact */}
      <div className="flex items-center justify-between border-t border-supporting-100 bg-supporting-50/60 px-4 py-2.5">
        <span className="text-[11px] text-supporting-500">
          Perlu panduan memilih?
        </span>
        <NavigationMenuLink asChild>
          <Link
            href={footerHref}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-primary-700 transition-colors hover:text-primary-900"
          >
            {footerLabel}
            <ArrowRight
              className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
              strokeWidth={1.5}
            />
          </Link>
        </NavigationMenuLink>
      </div>
    </div>
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
        <div className="animate-fade-in absolute right-0 top-full z-50 mt-3 w-60 overflow-hidden rounded-xl border border-supporting-200 bg-white shadow-[0_32px_80px_-24px_rgba(24,23,18,0.28)]">
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
    `relative bg-transparent px-3.5 text-sm font-medium transition-colors ${
      isActive(href)
        ? "text-background-100"
        : "text-supporting-300 hover:text-background-100"
    }`;

  const rule = (active: boolean) =>
    `absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-accent-500 transition-transform duration-300 ${
      active ? "scale-x-100" : "scale-x-0"
    }`;

  return (
    <header
      className={`sticky top-0 z-[60] border-b transition-colors duration-300 ${
        scrolled
          ? "border-primary-800/60 bg-primary-950/92 backdrop-blur-xl"
          : "border-transparent bg-primary-950"
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
            <span className="relative block h-9 w-32 sm:h-10 sm:w-40 brightness-0 invert">
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
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[active=true]:bg-transparent",
                    )}
                  >
                    <Link href="/" className={desktopLinkClass("/")}>
                      Beranda
                      <span className={rule(isActive("/"))} />
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="group relative bg-transparent px-3.5 text-sm font-medium text-supporting-300 transition-colors hover:bg-transparent hover:text-background-100 focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-background-100">
                    Metode
                    <span className="absolute inset-x-3.5 -bottom-0.5 h-px origin-left scale-x-0 bg-accent-500 transition-transform duration-300 group-data-[state=open]:scale-x-100" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <DropdownPanel
                      items={programItems}
                      kicker="Metode"
                      title="Tuntas 200 menit"
                      footerHref="/metode"
                      footerLabel="Jelajahi semua metode"
                    />
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="group relative bg-transparent px-3.5 text-sm font-medium text-supporting-300 transition-colors hover:bg-transparent hover:text-background-100 focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-background-100">
                    Produk
                    <span className="absolute inset-x-3.5 -bottom-0.5 h-px origin-left scale-x-0 bg-accent-500 transition-transform duration-300 group-data-[state=open]:scale-x-100" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <DropdownPanel
                      items={productItems}
                      kicker="Produk"
                      title="Warisan terkurasi"
                      footerHref="/produk"
                      footerLabel="Lihat katalog lengkap"
                    />
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="group relative bg-transparent px-3.5 text-sm font-medium text-supporting-300 transition-colors hover:bg-transparent hover:text-background-100 focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-background-100">
                    Tentang
                    <span className="absolute inset-x-3.5 -bottom-0.5 h-px origin-left scale-x-0 bg-accent-500 transition-transform duration-300 group-data-[state=open]:scale-x-100" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <DropdownPanel
                      items={aboutItems}
                      kicker="Tentang"
                      title="Amanah sejak 1965"
                      footerHref="/tentang"
                      footerLabel="Kenali PENA AMEEN"
                    />
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[active=true]:bg-transparent",
                    )}
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
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[active=true]:bg-transparent",
                    )}
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
                className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-supporting-300 transition-colors hover:text-background-100 sm:inline-flex"
              >
                <Package className="h-4 w-4" strokeWidth={1.5} />
                Pesanan
              </Link>
              <CustomerMenu />
            </Show>

            <Show when="signed-out">
              <Link
                href="/sign-in"
                className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-supporting-300 transition-colors hover:text-background-100 sm:inline-flex"
              >
                <LogIn className="h-4 w-4" strokeWidth={1.5} />
                Masuk
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-background-100 px-5 text-xs font-medium text-primary-950 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white"
              >
                <UserPlus className="h-3.5 w-3.5" strokeWidth={1.5} />
                Daftar
              </Link>
            </Show>

            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-supporting-300 transition-colors hover:bg-primary-900 lg:hidden"
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
            className="animate-fade-in fixed inset-0 z-[70] bg-primary-950/60 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu navigasi"
            className="animate-drawer-in fixed inset-y-0 right-0 z-[80] flex h-full w-full max-w-md flex-col bg-primary-950 shadow-[0_32px_80px_-24px_rgba(24,23,18,0.28)]"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="relative block h-9 w-32 brightness-0 invert">
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
                className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-supporting-300 transition-colors hover:bg-primary-900"
                aria-label="Tutup menu"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <nav
              className="flex-1 overflow-y-auto px-6 pb-6"
              aria-label="Navigasi seluler"
            >
              <p className="eyebrow mb-4 mt-2 text-background-300">Jelajahi</p>
              <ul className="border-t border-white/10">
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
                    className="flex min-h-13 items-center justify-center gap-2 rounded-full bg-background-100 px-6 text-sm font-medium text-primary-950"
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
                    className="flex min-h-13 w-full items-center justify-center gap-2 rounded-full border border-supporting-300 px-6 text-sm font-medium text-supporting-300 transition-colors hover:border-background-300 hover:text-background-100"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.5} />
                    Keluar
                  </button>
                </Show>
                <Show when="signed-out">
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex min-h-13 items-center justify-center gap-2 rounded-full bg-background-100 px-6 text-sm font-medium text-primary-950"
                  >
                    <LogIn className="h-4 w-4" strokeWidth={1.5} />
                    Masuk
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex min-h-13 items-center justify-center gap-2 rounded-full border border-supporting-300 px-6 text-sm font-medium text-supporting-300 transition-colors hover:border-background-300 hover:text-background-100"
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
