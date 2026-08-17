"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

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
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

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

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect_url=" + encodeURIComponent("/checkout/address"));
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!isSignedIn) return;
    async function load() {
      try {
        const res = await fetch("/api/addresses").then((r) => r.json());
        setAddresses(res.addresses ?? []);
        if ((res.addresses ?? []).length > 0) {
          setSelectedAddressId(res.addresses[0].id);
        }
      } catch {
        setError("Gagal memuat alamat");
      } finally {
        setIsLoadingAddresses(false);
      }
    }
    load();
  }, [isSignedIn]);

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
        if (!res.ok) {
          setError(data.error ?? "Gagal memuat ongkos kirim");
          setRates([]);
          return;
        }
        setRates(data.rates ?? []);
        setSelectedRate(null);
      } catch {
        setError("Gagal memuat ongkos kirim");
      } finally {
        setIsLoadingRates(false);
      }
    }
    loadRates();
  }, [selectedAddressId]);

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.[0]?.message ?? "Gagal menyimpan alamat");
        return;
      }
      setAddresses((prev) => [...prev, data.address]);
      setSelectedAddressId(data.address.id);
      setShowForm(false);
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
    } catch {
      setError("Gagal menyimpan alamat");
    }
  }

  function handleContinue() {
    if (!selectedAddressId || !selectedRate) return;
    const params = new URLSearchParams({
      addressId: selectedAddressId,
      shippingMethod: `${selectedRate.courier}-${selectedRate.service}`,
      shippingCost: String(selectedRate.cost),
    });
    router.push(`/checkout/payment?${params.toString()}`);
  }

  if (!isLoaded || isLoadingAddresses) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-50">
      <div className="container px-4 mx-auto py-12">
        <h1 className="text-3xl font-serif text-primary-600 mb-8">Checkout — Alamat & Pengiriman</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="text-xl font-semibold text-primary-600 mb-4">Pilih Alamat</h2>
            {addresses.length === 0 && !showForm && (
              <p className="text-supporting-600 mb-4">Belum ada alamat tersimpan.</p>
            )}
            <div className="space-y-3">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`block p-4 border rounded-xl cursor-pointer transition-colors ${
                    selectedAddressId === addr.id
                      ? "border-primary-600 bg-primary-50"
                      : "border-supporting-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr.id}
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="mr-2"
                  />
                  <span className="font-medium">{addr.label}</span>
                  <p className="text-sm text-supporting-600">
                    {addr.recipientName} • {addr.phone}
                  </p>
                  <p className="text-sm text-supporting-600">
                    {addr.addressLine1}
                    {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}, {addr.city}, {addr.province} {addr.postalCode}
                  </p>
                </label>
              ))}
            </div>

            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 text-primary-600 hover:underline"
              >
                + Tambah alamat baru
              </button>
            ) : (
              <form onSubmit={handleAddAddress} className="mt-4 space-y-3 p-4 border border-supporting-200 rounded-xl">
                <input className="w-full px-3 py-2 border rounded-md" placeholder="Label (Rumah/Kantor)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
                <input className="w-full px-3 py-2 border rounded-md" placeholder="Nama penerima" value={form.recipientName} onChange={(e) => setForm({ ...form, recipientName: e.target.value })} required />
                <input className="w-full px-3 py-2 border rounded-md" placeholder="No. telepon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                <input className="w-full px-3 py-2 border rounded-md" placeholder="Alamat lengkap" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} required />
                <input className="w-full px-3 py-2 border rounded-md" placeholder="Alamat tambahan (opsional)" value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} />
                <div className="grid grid-cols-3 gap-2">
                  <input className="px-3 py-2 border rounded-md" placeholder="Kota" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                  <input className="px-3 py-2 border rounded-md" placeholder="Provinsi" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} required />
                  <input className="px-3 py-2 border rounded-md" placeholder="Kode pos" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} required />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Simpan</button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-md">Batal</button>
                </div>
              </form>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-600 mb-4">Pilih Kurir</h2>
            {isLoadingRates && <p className="text-supporting-600">Memuat ongkos kirim...</p>}
            {!isLoadingRates && rates.length === 0 && selectedAddressId && (
              <p className="text-supporting-600">Pilih alamat untuk melihat ongkos kirim.</p>
            )}
            <div className="space-y-3">
              {rates.map((rate, idx) => {
                const key = `${rate.courier}-${rate.service}-${idx}`;
                return (
                  <label
                    key={key}
                    className={`block p-4 border rounded-xl cursor-pointer transition-colors ${
                      selectedRate === rate
                        ? "border-primary-600 bg-primary-50"
                        : "border-supporting-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rate"
                      checked={selectedRate === rate}
                      onChange={() => setSelectedRate(rate)}
                      className="mr-2"
                    />
                    <span className="font-medium">{rate.courierName} — {rate.service}</span>
                    <p className="text-sm text-supporting-600">{rate.description} • {rate.etd} hari</p>
                    <p className="text-primary-600 font-semibold">Rp{rate.cost.toLocaleString()}</p>
                  </label>
                );
              })}
            </div>
          </section>
        </div>

        <div className="mt-8 flex justify-between">
          <Link href="/produk" className="text-supporting-600 hover:underline">
            ← Lanjut belanja
          </Link>
          <button
            onClick={handleContinue}
            disabled={!selectedAddressId || !selectedRate}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:bg-supporting-300 disabled:cursor-not-allowed font-medium"
          >
            Lanjut ke Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
}
