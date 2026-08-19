"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth, useUser } from "@clerk/nextjs";
import { useCart } from "@/context/CartContext";

interface Address {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface ShippingRate {
  courier: string;
  courierName: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
  note: string;
}

export default function CheckoutAddressPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const {
    items: cartItems,
    total: cartTotal,
    itemCount,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    label: "Rumah",
    recipientName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
    postalCode: "",
  });

  // 1. Auth Guard (Redirect to sign-in if not logged in)
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push(
        "/sign-in?redirect_url=" + encodeURIComponent("/checkout/address"),
      );
    }
  }, [isLoaded, isSignedIn, router]);

  // 2. Load Addresses from API / Local Storage
  useEffect(() => {
    if (!isSignedIn) return;

    const dynamicName =
      user?.fullName ||
      (user?.firstName
        ? `${user.firstName} ${user.lastName || ""}`.trim()
        : "");

    const dynamicDefaultAddress: Address = {
      id: "addr-default-1",
      label: "Rumah",
      recipientName: dynamicName,
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      province: "",
      postalCode: "",
      country: "Indonesia",
      isDefault: true,
    };

    async function loadAddresses() {
      try {
        const res = await fetch("/api/addresses");
        if (res.ok) {
          const data = await res.json();
          const apiAddrs = data.addresses ?? [];
          if (apiAddrs.length > 0 && apiAddrs[0]) {
            setAddresses(apiAddrs);
            setSelectedAddressId(apiAddrs[0].id);
            setIsLoadingAddresses(false);
            return;
          }
        }
      } catch {
        // Fallback below
      }

      // Check local storage for previously saved address
      try {
        const localSaved = localStorage.getItem("penaameen_checkout_addresses");
        if (localSaved) {
          const parsed: Address[] = JSON.parse(localSaved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAddresses(parsed);
            setSelectedAddressId(parsed[0]?.id || dynamicDefaultAddress.id);
            setIsLoadingAddresses(false);
            return;
          }
        }
      } catch {
        // Fallback
      }

      // Default dynamic address for the active user
      setAddresses([dynamicDefaultAddress]);
      setSelectedAddressId(dynamicDefaultAddress.id);
      setIsLoadingAddresses(false);
    }

    loadAddresses();
  }, [isSignedIn, user]);

  // 3. Load Shipping Rates when Address or Cart changes
  useEffect(() => {
    if (!selectedAddressId) {
      setRates([]);
      setSelectedRate(null);
      return;
    }

    async function loadRates() {
      setIsLoadingRates(true);
      setError(null);
      try {
        const selectedAddr = addresses.find((a) => a.id === selectedAddressId);

        const res = await fetch("/api/shipping/rates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            addressId: selectedAddressId,
            destination: selectedAddr
              ? {
                  city: selectedAddr.city,
                  province: selectedAddr.province,
                  postalCode: selectedAddr.postalCode,
                }
              : {
                  city: "Surabaya",
                  province: "Jawa Timur",
                  postalCode: "60238",
                },
            items: cartItems.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
            })),
          }),
        });

        const data = await res.json();
        const availableRates: ShippingRate[] = data.rates ?? [];
        setRates(availableRates);
        if (availableRates.length > 0 && availableRates[0]) {
          setSelectedRate(availableRates[0]);
        }
      } catch {
        setError("Gagal memuat ongkos kirim. Silakan coba kembali.");
      } finally {
        setIsLoadingRates(false);
      }
    }

    loadRates();
  }, [selectedAddressId, addresses, cartItems]);

  // Handle Add Address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.recipientName ||
      !form.phone ||
      !form.addressLine1 ||
      !form.city
    ) {
      setError("Mohon lengkapi semua field alamat wajib.");
      return;
    }

    const newAddr: Address = {
      id: "addr-" + Date.now(),
      label: form.label || "Alamat Baru",
      recipientName: form.recipientName,
      phone: form.phone,
      addressLine1: form.addressLine1,
      addressLine2: form.addressLine2 || null,
      city: form.city,
      province: form.province || "Jawa Timur",
      postalCode: form.postalCode || "60238",
      country: "Indonesia",
      isDefault: addresses.length === 0,
    };

    const updated = [...addresses, newAddr];
    setAddresses(updated);
    setSelectedAddressId(newAddr.id);
    setShowAddModal(false);

    try {
      localStorage.setItem(
        "penaameen_checkout_addresses",
        JSON.stringify(updated),
      );
      await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      // Saved locally
    }

    setForm({
      label: "Rumah",
      recipientName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      province: "",
      postalCode: "",
    });
  };

  // Continue to Payment
  const handleContinueToPayment = () => {
    if (!selectedAddressId || !selectedRate) {
      setError("Silakan pilih alamat dan kurir pengiriman terlebih dahulu.");
      return;
    }

    const selectedAddr = addresses.find((a) => a.id === selectedAddressId);

    // Save selected shipping rate and address to local storage
    try {
      localStorage.setItem(
        "penaameen_checkout_selected_rate",
        JSON.stringify(selectedRate),
      );
      if (selectedAddr) {
        localStorage.setItem(
          "penaameen_checkout_selected_address",
          JSON.stringify(selectedAddr),
        );
      }
    } catch {
      // Ignore
    }

    const params = new URLSearchParams({
      addressId: selectedAddressId,
      shippingMethod: `${selectedRate.courierName} - ${selectedRate.service}`,
      shippingCost: String(selectedRate.cost),
      courierCode: selectedRate.courier,
      etd: selectedRate.etd,
    });

    router.push(`/checkout/payment?${params.toString()}`);
  };

  const shippingCost = selectedRate?.cost ?? 0;
  const grandTotal = cartTotal + shippingCost;

  const getCourierBadge = (courier: string) => {
    switch (courier.toLowerCase()) {
      case "jne":
        return { bg: "bg-red-50 text-red-700 border-red-200", label: "JNE" };
      case "jnt":
        return { bg: "bg-red-600 text-white", label: "J&T" };
      case "sicepat":
        return { bg: "bg-amber-500 text-white", label: "SiCepat" };
      case "pos":
        return { bg: "bg-orange-600 text-white", label: "POS" };
      default:
        return {
          bg: "bg-primary-100 text-primary-800",
          label: courier.toUpperCase(),
        };
    }
  };

  if (!isLoaded || isLoadingAddresses) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto" />
          <p className="text-supporting-600 text-sm font-medium">
            Menyiapkan checkout...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-50 pb-24">
      {/* Checkout Step Breadcrumb Bar */}
      <div className="bg-white border-b border-supporting-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="container px-4 mx-auto py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/produk"
                className="text-xs text-supporting-500 hover:text-primary-700 flex items-center gap-1.5 transition-colors font-medium"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Kembali ke Belanja
              </Link>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2 text-emerald-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-xs">
                  1
                </span>
                <span>Alamat &amp; Kurir</span>
              </div>
              <div className="w-6 sm:w-10 h-[2px] bg-supporting-200" />
              <div className="flex items-center gap-2 text-supporting-400">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-supporting-200 text-supporting-600 text-[11px] font-bold">
                  2
                </span>
                <span>Pembayaran</span>
              </div>
              <div className="w-6 sm:w-10 h-[2px] bg-supporting-200" />
              <div className="flex items-center gap-2 text-supporting-400">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-supporting-200 text-supporting-600 text-[11px] font-bold">
                  3
                </span>
                <span>Selesai</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container px-4 mx-auto mt-8 max-w-6xl">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="max-w-md mx-auto my-16 bg-white rounded-3xl border border-supporting-200 p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-primary-100">
              🛒
            </div>
            <h2 className="text-xl font-serif font-bold text-primary-950 mb-2">
              Keranjang Anda Masih Kosong
            </h2>
            <p className="text-supporting-600 text-sm mb-6 leading-relaxed">
              Silakan pilih buku atau paket metode belajar Al-Barqy / ACM dari
              katalog kami terlebih dahulu.
            </p>
            <Link
              href="/produk"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-primary-900/10"
            >
              Lihat Katalog Produk
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Section: Address & Shipping Selection (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Address Section */}
              <div className="bg-white rounded-3xl border border-supporting-200/90 p-6 md:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50 text-primary-700 font-bold text-sm border border-primary-100">
                      📍
                    </span>
                    <div>
                      <h2 className="text-lg font-serif font-bold text-primary-950">
                        Alamat Pengiriman
                      </h2>
                      <p className="text-xs text-supporting-500">
                        Pilih atau tambah alamat tujuan pengiriman
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="px-3.5 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-semibold rounded-lg border border-primary-200/80 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>+</span> Tambah Alamat
                  </button>
                </div>

                <div className="space-y-3">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;

                    return (
                      <label
                        key={addr.id}
                        className={`group relative flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-500/20"
                            : "border-supporting-200 hover:border-supporting-300 hover:bg-supporting-50/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={isSelected}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-primary-950">
                              {addr.recipientName}
                            </span>
                            <span className="text-xs font-medium text-supporting-500">
                              • {addr.phone}
                            </span>
                            <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-supporting-100 text-supporting-700">
                              {addr.label}
                            </span>
                          </div>

                          <p className="text-xs text-supporting-600 leading-relaxed">
                            {addr.addressLine1}
                            {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                          </p>
                          <p className="text-xs text-supporting-500 mt-0.5 font-medium">
                            {addr.city}, {addr.province} {addr.postalCode}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 2. Courier Selection Section */}
              <div className="bg-white rounded-3xl border border-supporting-200/90 p-6 md:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50 text-primary-700 font-bold text-sm border border-primary-100">
                      🚚
                    </span>
                    <div>
                      <h2 className="text-lg font-serif font-bold text-primary-950">
                        Pilihan Kurir &amp; Ekspedisi
                      </h2>
                      <p className="text-xs text-supporting-500">
                        Pilih kurir pengiriman yang Anda inginkan
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-supporting-500 bg-supporting-100 px-2.5 py-1 rounded-md hidden sm:inline">
                    Asal: Surabaya (Penerbit Pena Ameen)
                  </span>
                </div>

                {isLoadingRates ? (
                  <div className="py-10 text-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-emerald-600 border-t-transparent mx-auto" />
                    <p className="text-xs text-supporting-600 font-semibold">
                      Menghitung tarif kurir &amp; estimasi terbaik...
                    </p>
                  </div>
                ) : rates.length === 0 ? (
                  <div className="p-6 bg-supporting-50 rounded-2xl text-center text-xs text-supporting-600 space-y-2">
                    <p>
                      Silakan pilih alamat di atas untuk melihat tarif kurir
                      yang tersedia.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {rates.map((rate, idx) => {
                      const key = `${rate.courier}-${rate.service}-${idx}`;
                      const isSelected =
                        selectedRate?.courier === rate.courier &&
                        selectedRate?.service === rate.service;

                      const badge = getCourierBadge(rate.courier);

                      return (
                        <label
                          key={key}
                          className={`relative flex flex-col justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-500/20"
                              : "border-supporting-200 hover:border-supporting-300 hover:bg-supporting-50/30"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="courierRate"
                                  checked={isSelected}
                                  onChange={() => setSelectedRate(rate)}
                                  className="text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                />
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${badge.bg}`}
                                >
                                  {badge.label}
                                </span>
                                <span className="text-xs font-bold text-primary-950 uppercase tracking-wide">
                                  {rate.courierName}
                                </span>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-100 text-primary-800">
                                {rate.service}
                              </span>
                            </div>

                            <p className="text-xs text-supporting-600 line-clamp-1 mb-1">
                              {rate.description || "Layanan Reguler"}
                            </p>
                            <div className="flex items-center justify-between text-[11px] text-supporting-500">
                              <span className="flex items-center gap-1 font-medium">
                                ⏱️ Estimasi: {rate.etd} hari
                              </span>
                              {rate.note && (
                                <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded font-semibold">
                                  {rate.note}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-supporting-100/80 flex items-center justify-between">
                            <span className="text-[10px] text-supporting-400 font-semibold uppercase tracking-wider">
                              Ongkir
                            </span>
                            <span className="text-sm font-bold text-emerald-700 font-serif">
                              Rp{rate.cost.toLocaleString("id-ID")}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Section: Order Summary (5 cols) */}
            <div className="lg:col-span-5 sticky top-20 space-y-6">
              <div className="bg-white rounded-3xl border border-supporting-200/90 p-6 shadow-sm">
                <h2 className="text-lg font-serif font-bold text-primary-950 mb-4 pb-3 border-b border-supporting-100 flex items-center justify-between">
                  <span>Ringkasan Keranjang</span>
                  <span className="text-xs font-sans font-semibold px-2.5 py-0.5 bg-supporting-100 text-supporting-700 rounded-full">
                    {itemCount} Produk
                  </span>
                </h2>

                {/* Cart Items List */}
                <div className="divide-y divide-supporting-100 max-h-72 overflow-y-auto pr-1 scrollbar-thin mb-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="py-3.5 flex items-center gap-3"
                    >
                      <div className="relative w-14 h-14 rounded-xl bg-supporting-100 overflow-hidden flex-shrink-0 border border-supporting-200">
                        <Image
                          src={
                            item.product.image ||
                            "/images/penaameen/products/home-learning.jpg"
                          }
                          alt={item.product.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-primary-950 truncate mb-1">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-supporting-500 font-medium">
                            Rp
                            {Number(item.product.price).toLocaleString(
                              "id-ID",
                            )}{" "}
                            x {item.quantity}
                          </span>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex items-center border border-supporting-200 rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  Math.max(1, item.quantity - 1),
                                )
                              }
                              className="px-2 py-0.5 text-xs text-supporting-600 hover:bg-supporting-200 transition-colors"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-semibold text-primary-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                )
                              }
                              className="px-2 py-0.5 text-xs text-supporting-600 hover:bg-supporting-200 transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-[11px] text-red-500 hover:text-red-700 hover:underline"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-primary-800">
                          Rp{item.subtotal.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-2.5 pt-4 border-t border-supporting-100 text-xs">
                  <div className="flex justify-between text-supporting-600">
                    <span>Subtotal Produk</span>
                    <span className="font-semibold text-primary-950">
                      Rp{cartTotal.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex justify-between text-supporting-600">
                    <span>Biaya Pengiriman</span>
                    <span className="font-semibold text-emerald-700">
                      {shippingCost > 0
                        ? `Rp${shippingCost.toLocaleString("id-ID")}`
                        : "Pilih kurir"}
                    </span>
                  </div>

                  <div className="flex justify-between text-supporting-600">
                    <span>Biaya Layanan</span>
                    <span className="font-semibold text-emerald-600">
                      GRATIS
                    </span>
                  </div>

                  <div className="pt-3 border-t border-supporting-200 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-bold text-primary-950 block">
                        Total Pembayaran
                      </span>
                      <span className="text-[10px] text-supporting-400">
                        Sudah termasuk PPN &amp; Ongkir
                      </span>
                    </div>
                    <span className="text-xl font-bold text-emerald-700 font-serif">
                      Rp{grandTotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Action CTA */}
                <button
                  type="button"
                  onClick={handleContinueToPayment}
                  disabled={!selectedAddressId || !selectedRate}
                  className="w-full mt-6 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-supporting-300 disabled:cursor-not-allowed text-white text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Lanjut ke Pembayaran</span>
                  <span>→</span>
                </button>

                {/* Trust Badges */}
                <div className="mt-4 pt-4 border-t border-supporting-100/80 space-y-1.5 text-[11px] text-supporting-500">
                  <div className="flex items-center gap-2">
                    <span>🔒</span>
                    <span>
                      Transaksi aman &amp; terverifikasi oleh Midtrans / QRIS
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🛡️</span>
                    <span>Produk resmi bergaransi Penerbit Pena Ameen</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Add Address */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-supporting-100">
              <h3 className="text-base font-bold text-primary-950 font-serif">
                Tambah Alamat Pengiriman Baru
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-supporting-100 hover:bg-supporting-200 text-supporting-700 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <div>
                <label className="block text-supporting-700 font-semibold mb-1">
                  Label Alamat (cth: Rumah, Kantor)
                </label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="Rumah"
                  className="w-full p-2.5 rounded-xl border border-supporting-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-supporting-700 font-semibold mb-1">
                    Nama Penerima *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.recipientName}
                    onChange={(e) =>
                      setForm({ ...form, recipientName: e.target.value })
                    }
                    placeholder="Nama Lengkap"
                    className="w-full p-2.5 rounded-xl border border-supporting-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-supporting-700 font-semibold mb-1">
                    No. WhatsApp/HP *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="08123456789"
                    className="w-full p-2.5 rounded-xl border border-supporting-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-supporting-700 font-semibold mb-1">
                  Alamat Lengkap *
                </label>
                <textarea
                  required
                  rows={2}
                  value={form.addressLine1}
                  onChange={(e) =>
                    setForm({ ...form, addressLine1: e.target.value })
                  }
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan/kecamatan"
                  className="w-full p-2.5 rounded-xl border border-supporting-300 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-supporting-700 font-semibold mb-1">
                    Kota/Kab *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Surabaya"
                    className="w-full p-2.5 rounded-xl border border-supporting-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-supporting-700 font-semibold mb-1">
                    Provinsi *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.province}
                    onChange={(e) =>
                      setForm({ ...form, province: e.target.value })
                    }
                    placeholder="Jawa Timur"
                    className="w-full p-2.5 rounded-xl border border-supporting-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-supporting-700 font-semibold mb-1">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={(e) =>
                      setForm({ ...form, postalCode: e.target.value })
                    }
                    placeholder="60238"
                    className="w-full p-2.5 rounded-xl border border-supporting-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-supporting-600 hover:bg-supporting-100 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  Simpan Alamat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
