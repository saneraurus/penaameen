"use client";

import { useEffect, useState, useMemo } from "react";
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
  const { items: cartItems, total: cartTotal, itemCount, updateQuantity, removeFromCart } = useCart();

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
      router.push("/sign-in?redirect_url=" + encodeURIComponent("/checkout/address"));
    }
  }, [isLoaded, isSignedIn, router]);

  // 2. Load Addresses from API / Local Storage
  useEffect(() => {
    if (!isSignedIn) return;

    const dynamicName =
      user?.fullName ||
      (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Pelanggan");

    const dynamicDefaultAddress: Address = {
      id: "addr-default-1",
      label: "Rumah",
      recipientName: dynamicName,
      phone: "081234567890",
      addressLine1: "Jl. Margorejo Indah No. 12",
      addressLine2: "Kec. Wonocolo",
      city: "Surabaya",
      province: "Jawa Timur",
      postalCode: "60238",
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
          if (parsed.length > 0 && parsed[0]) {
            setAddresses(parsed);
            setSelectedAddressId(parsed[0].id);
            setIsLoadingAddresses(false);
            return;
          }
        }
      } catch {
        // Use default starter address
      }

      // Default dynamic address for the active user
      setAddresses([dynamicDefaultAddress]);
      setSelectedAddressId(dynamicDefaultAddress.id);
      setIsLoadingAddresses(false);
    }

    loadAddresses();
  }, [isSignedIn, user]);

  // 3. Load Shipping Rates when Address changes
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
        const res = await fetch("/api/shipping/rates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ addressId: selectedAddressId }),
        });
        const data = await res.json();
        const availableRates: ShippingRate[] = data.rates ?? [];
        setRates(availableRates);
        if (availableRates.length > 0 && availableRates[0]) {
          setSelectedRate(availableRates[0]);
        }
      } catch {
        setError("Gagal memuat ongkos kirim");
      } finally {
        setIsLoadingRates(false);
      }
    }

    loadRates();
  }, [selectedAddressId]);

  // Handle Add Address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.recipientName || !form.phone || !form.addressLine1 || !form.city) {
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
      province: form.province || "Indonesia",
      postalCode: form.postalCode || "00000",
      country: "Indonesia",
      isDefault: addresses.length === 0,
    };

    const updated = [...addresses, newAddr];
    setAddresses(updated);
    setSelectedAddressId(newAddr.id);
    setShowAddModal(false);

    try {
      localStorage.setItem("penaameen_checkout_addresses", JSON.stringify(updated));
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

    const params = new URLSearchParams({
      addressId: selectedAddressId,
      shippingMethod: `${selectedRate.courier}-${selectedRate.service}`,
      shippingCost: String(selectedRate.cost),
    });

    router.push(`/checkout/payment?${params.toString()}`);
  };

  const shippingCost = selectedRate?.cost ?? 0;
  const grandTotal = cartTotal + shippingCost;

  if (!isLoaded || isLoadingAddresses) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto" />
          <p className="text-supporting-600 text-sm font-medium">Menyiapkan checkout...</p>
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
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke Belanja
              </Link>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2 text-primary-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white text-[11px] font-bold shadow-xs">
                  1
                </span>
                <span>Alamat & Kurir</span>
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

      <div className="container px-4 mx-auto py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center justify-between text-sm shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 text-xs font-bold">
              ✕
            </button>
          </div>
        )}

        {/* Empty Cart Warning */}
        {itemCount === 0 ? (
          <div className="max-w-md mx-auto py-20 text-center bg-white rounded-3xl border border-supporting-200 p-8 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-4 text-2xl">
              🛒
            </div>
            <h2 className="text-xl font-serif font-bold text-primary-950 mb-2">Keranjang Anda Masih Kosong</h2>
            <p className="text-supporting-600 text-sm mb-6 leading-relaxed">
              Silakan pilih buku atau paket metode belajar Al-Barqy / ACM dari katalog kami terlebih dahulu.
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
            <div className="lg:col-span-7 space-y-8">
              {/* 1. Address Section */}
              <div className="bg-white rounded-3xl border border-supporting-200/90 p-6 md:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50 text-primary-700 font-bold text-sm border border-primary-100">
                      📍
                    </span>
                    <div>
                      <h2 className="text-lg font-serif font-bold text-primary-950">Alamat Pengiriman</h2>
                      <p className="text-xs text-supporting-500">Pilih atau tambah alamat tujuan pengiriman</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="px-3.5 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-semibold rounded-lg border border-primary-200/80 transition-colors flex items-center gap-1.5"
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
                            ? "border-primary-600 bg-primary-50/40 shadow-xs ring-1 ring-primary-500/20"
                            : "border-supporting-200 hover:border-supporting-300 hover:bg-supporting-50/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={isSelected}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 text-primary-600 focus:ring-primary-500"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-primary-950">{addr.recipientName}</span>
                            <span className="text-xs font-medium text-supporting-500">• {addr.phone}</span>
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

              {/* 2. Courier Section */}
              <div className="bg-white rounded-3xl border border-supporting-200/90 p-6 md:p-8 shadow-xs">
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50 text-primary-700 font-bold text-sm border border-primary-100">
                    🚚
                  </span>
                  <div>
                    <h2 className="text-lg font-serif font-bold text-primary-950">Pilihan Kurir & Ekspedisi</h2>
                    <p className="text-xs text-supporting-500">Pilih kurir pengiriman yang Anda inginkan</p>
                  </div>
                </div>

                {isLoadingRates ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-primary-600 border-t-transparent mx-auto" />
                    <p className="text-xs text-supporting-500 font-medium">Menghitung ongkos kirim terbaik...</p>
                  </div>
                ) : rates.length === 0 ? (
                  <div className="p-6 bg-supporting-50 rounded-2xl text-center text-xs text-supporting-600">
                    Silakan pilih alamat di atas untuk melihat tarif kurir yang tersedia.
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {rates.map((rate, idx) => {
                      const key = `${rate.courier}-${rate.service}-${idx}`;
                      const isSelected = selectedRate?.courier === rate.courier && selectedRate?.service === rate.service;

                      return (
                        <label
                          key={key}
                          className={`relative flex flex-col justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "border-primary-600 bg-primary-50/50 shadow-xs ring-1 ring-primary-500/20"
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
                                  className="text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-xs font-bold text-primary-950 uppercase tracking-wide">
                                  {rate.courierName}
                                </span>
                              </div>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-primary-100/70 text-primary-800">
                                {rate.service}
                              </span>
                            </div>

                            <p className="text-xs text-supporting-500 line-clamp-1 mb-1">
                              {rate.description || "Layanan Reguler"}
                            </p>
                            <p className="text-[11px] text-supporting-400 font-medium flex items-center gap-1">
                              ⏱️ Estimasi: {rate.etd} hari
                            </p>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-supporting-100/80 flex items-center justify-between">
                            <span className="text-[10px] text-supporting-400 font-medium">Ongkos Kirim</span>
                            <span className="text-sm font-bold text-primary-800">
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
                    <div key={item.id} className="py-3.5 flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl bg-supporting-100 overflow-hidden flex-shrink-0 border border-supporting-200">
                        <Image
                          src={item.product.image || "/images/penaameen/products/home-learning.jpg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-primary-950 truncate">{item.product.name}</h4>
                        <p className="text-[11px] text-supporting-500">
                          Rp{Number(item.product.price).toLocaleString("id-ID")} x {item.quantity}
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex items-center border border-supporting-200 rounded-md overflow-hidden bg-background-50">
                            <button
                              type="button"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity(item.product.id, item.quantity - 1);
                                } else {
                                  removeFromCart(item.product.id);
                                }
                              }}
                              className="px-2 py-0.5 text-xs text-supporting-600 hover:bg-supporting-200 transition-colors"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-semibold text-primary-900">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
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
                    <span className="font-semibold text-primary-950">Rp{cartTotal.toLocaleString("id-ID")}</span>
                  </div>

                  <div className="flex justify-between text-supporting-600">
                    <span>Biaya Pengiriman</span>
                    <span className="font-semibold text-primary-950">
                      {shippingCost > 0 ? `Rp${shippingCost.toLocaleString("id-ID")}` : "Pilih kurir"}
                    </span>
                  </div>

                  <div className="flex justify-between text-supporting-600">
                    <span>Biaya Layanan</span>
                    <span className="font-semibold text-emerald-600">GRATIS</span>
                  </div>

                  <div className="pt-3 border-t border-supporting-200 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-bold text-primary-950 block">Total Pembayaran</span>
                      <span className="text-[10px] text-supporting-400">Sudah termasuk PPN & Ongkir</span>
                    </div>
                    <span className="text-xl font-bold text-primary-700">
                      Rp{grandTotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Action CTA */}
                <button
                  type="button"
                  onClick={handleContinueToPayment}
                  disabled={!selectedAddressId || !selectedRate}
                  className="w-full mt-6 py-3.5 px-6 bg-primary-600 hover:bg-primary-700 disabled:bg-supporting-300 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-2xl transition-all shadow-md shadow-primary-900/10 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>Lanjut ke Pembayaran</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                {/* Trust Badges */}
                <div className="mt-6 pt-4 border-t border-supporting-100 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-supporting-500">
                    <span>🔒</span>
                    <span>Transaksi aman & terverifikasi oleh Midtrans</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-supporting-500">
                    <span>📦</span>
                    <span>Produk resmi bergaransi Pena Ameen</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-supporting-100">
              <h3 className="text-lg font-serif font-bold text-primary-950">Tambah Alamat Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-supporting-400 hover:text-supporting-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-supporting-700 mb-1">Label Alamat</label>
                <input
                  type="text"
                  placeholder="Contoh: Rumah, Kantor, Toko"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="w-full px-3.5 py-2 bg-background-50 border border-supporting-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-supporting-700 mb-1">Nama Penerima</label>
                  <input
                    type="text"
                    placeholder="Nama lengkap"
                    value={form.recipientName}
                    onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-background-50 border border-supporting-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-supporting-700 mb-1">Nomor Telepon / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="08123456789"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-background-50 border border-supporting-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-supporting-700 mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan"
                  value={form.addressLine1}
                  onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
                  className="w-full px-3.5 py-2 bg-background-50 border border-supporting-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-supporting-700 mb-1">Kota/Kab</label>
                  <input
                    type="text"
                    placeholder="Surabaya"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2 bg-background-50 border border-supporting-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-supporting-700 mb-1">Provinsi</label>
                  <input
                    type="text"
                    placeholder="Jawa Timur"
                    value={form.province}
                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                    className="w-full px-3 py-2 bg-background-50 border border-supporting-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-supporting-700 mb-1">Kode Pos</label>
                  <input
                    type="text"
                    placeholder="60238"
                    value={form.postalCode}
                    onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                    className="w-full px-3 py-2 bg-background-50 border border-supporting-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-supporting-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Simpan Alamat
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 border border-supporting-300 text-supporting-600 hover:bg-supporting-50 text-xs font-semibold rounded-xl transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
