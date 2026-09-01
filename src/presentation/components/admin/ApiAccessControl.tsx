"use client";

import { useState } from "react";
import type { ApiSettings } from "@/lib/admin/api-settings";

interface ApiAccessControlProps {
  initialSettings: ApiSettings;
}

export function ApiAccessControl({ initialSettings }: ApiAccessControlProps) {
  const [settings, setSettings] = useState<ApiSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState<
    | "buatqris"
    | "casaku"
    | "midtrans"
    | "rajaongkir"
    | "email"
    | "forwarding"
    | "auth"
  >("buatqris");

  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<
    Record<string, { success: boolean; message: string; latencyMs?: number }>
  >({});
  const [testingService, setTestingService] = useState<string | null>(null);

  const toggleSecret = (field: string) => {
    setShowSecrets((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setToastMessage(null);
    try {
      const res = await fetch("/api/admin/settings/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setToastMessage(
          "Pengaturan API dan integrasi berhasil disimpan ke backend!",
        );
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        alert("Gagal menyimpan konfigurasi API.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan saat menyimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async (
    service: "buatqris" | "casaku" | "midtrans" | "rajaongkir" | "email",
  ) => {
    setTestingService(service);
    try {
      let payload: Record<string, unknown> = { service };
      if (service === "midtrans") {
        payload = {
          ...payload,
          serverKey: settings.midtrans.serverKey,
          isProduction: settings.midtrans.isProduction,
        };
      } else if (service === "rajaongkir") {
        payload = {
          ...payload,
          apiKey: settings.rajaongkir.apiKey,
          tier: settings.rajaongkir.tier,
        };
      } else if (service === "email") {
        payload = {
          ...payload,
          provider: settings.autoEmail.provider,
          recipient:
            settings.emailForwarding.forwardingEmail || "ihsanzz099@gmail.com",
        };
      }

      const res = await fetch("/api/admin/settings/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setTestResults((prev) => ({
        ...prev,
        [service]: {
          success: data.success ?? false,
          message: data.message || "Hasil uji koneksi diterima",
          latencyMs: data.latencyMs,
        },
      }));
    } catch {
      setTestResults((prev) => ({
        ...prev,
        [service]: {
          success: false,
          message: "Gagal terhubung ke endpoint pengujian",
        },
      }));
    } finally {
      setTestingService(null);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`URL ${label} berhasil disalin ke clipboard!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm font-medium flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-lg">✓</span>
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-supporting-200 shadow-xs">
        <div>
          <h2 className="text-base font-semibold text-supporting-900 flex items-center gap-2">
            <span>🔌</span>
            <span>Pusat Kontrol API & Integrasi Backend</span>
          </h2>
          <p className="text-xs text-supporting-500 mt-0.5">
            Kelola kredensial resmi Casaku QRIS, Midtrans, RajaOngkir,
            Auto-Email, dan Webhooks Pena Ameen
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
        >
          <span>💾</span>
          <span>
            {isSaving ? "Menyimpan..." : "Simpan Seluruh Konfigurasi"}
          </span>
        </button>
      </div>

      {/* Main Settings Tabs Container */}
      <div className="bg-white rounded-3xl border border-supporting-200 overflow-hidden shadow-xs">
        {/* Navigation Tabs Bar */}
        <div className="flex overflow-x-auto border-b border-supporting-200 bg-supporting-50/70 p-2 gap-1.5 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("buatqris")}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "buatqris"
                ? "bg-white text-supporting-900 shadow-xs border border-supporting-200"
                : "text-supporting-600 hover:text-supporting-900 hover:bg-supporting-100"
            }`}
          >
            <span>🪙</span>
            <span>QRIS (BuatQRIS)</span>
            <span
              className={`w-2 h-2 rounded-full ${
                settings.buatqris?.enabled ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("casaku")}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "casaku"
                ? "bg-white text-supporting-900 shadow-xs border border-supporting-200"
                : "text-supporting-600 hover:text-supporting-900 hover:bg-supporting-100"
            }`}
          >
            <span>🪙</span>
            <span>QRIS (Casaku Legacy)</span>
            <span
              className={`w-2 h-2 rounded-full ${
                settings.casaku.enabled ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("midtrans")}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "midtrans"
                ? "bg-white text-supporting-900 shadow-xs border border-supporting-200"
                : "text-supporting-600 hover:text-supporting-900 hover:bg-supporting-100"
            }`}
          >
            <span>💳</span>
            <span>Payment Gateway (Midtrans)</span>
            <span
              className={`w-2 h-2 rounded-full ${
                settings.midtrans.serverKey ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("rajaongkir")}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "rajaongkir"
                ? "bg-white text-supporting-900 shadow-xs border border-supporting-200"
                : "text-supporting-600 hover:text-supporting-900 hover:bg-supporting-100"
            }`}
          >
            <span>🚚</span>
            <span>Tarif Ongkir (RajaOngkir)</span>
            <span
              className={`w-2 h-2 rounded-full ${
                settings.rajaongkir.apiKey ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("email")}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "email"
                ? "bg-white text-supporting-900 shadow-xs border border-supporting-200"
                : "text-supporting-600 hover:text-supporting-900 hover:bg-supporting-100"
            }`}
          >
            <span>✉️</span>
            <span>Auto-Email & Invoice</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("forwarding")}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "forwarding"
                ? "bg-white text-supporting-900 shadow-xs border border-supporting-200"
                : "text-supporting-600 hover:text-supporting-900 hover:bg-supporting-100"
            }`}
          >
            <span>📬</span>
            <span>Email Forwarding & CS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("auth")}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "auth"
                ? "bg-white text-supporting-900 shadow-xs border border-supporting-200"
                : "text-supporting-600 hover:text-supporting-900 hover:bg-supporting-100"
            }`}
          >
            <span>🔐</span>
            <span>Auth & Whitelist</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-6 md:p-8">
          {/* TAB 0: BUATQRIS (PRIMARY) */}
          {activeTab === "buatqris" && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-semibold text-supporting-900">
                    Konfigurasi BuatQRIS (Primary Payment Gateway)
                  </h3>
                  <p className="text-xs text-supporting-500 mt-0.5">
                    Dynamic QRIS otomatis untuk semua e-wallet & mobile banking
                    (https://buatqris.site).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSettings((s) => ({
                      ...s,
                      buatqris: {
                        ...s.buatqris,
                        enabled: !s.buatqris?.enabled,
                      },
                    }))
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    settings.buatqris?.enabled
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-supporting-100 text-supporting-700 border border-supporting-300"
                  }`}
                >
                  {settings.buatqris?.enabled ? "🟢 Aktif" : "⚪ Nonaktif"}
                </button>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    Account ID *
                  </label>
                  <input
                    type="text"
                    value={settings.buatqris?.accountId || ""}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        buatqris: {
                          ...s.buatqris,
                          accountId: e.target.value,
                        },
                      }))
                    }
                    placeholder="user_..."
                    className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Diperoleh dari Dashboard BuatQRIS → Open API (awalan user_…)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    Secret Token *
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.buatqrisSecret ? "text" : "password"}
                      value={settings.buatqris?.secretToken || ""}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          buatqris: {
                            ...s.buatqris,
                            secretToken: e.target.value,
                          },
                        }))
                      }
                      placeholder="sk_live_..."
                      className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret("buatqrisSecret")}
                      className="absolute right-3 top-2.5 text-xs text-supporting-500 hover:text-supporting-800 cursor-pointer"
                    >
                      {showSecrets.buatqrisSecret ? "🙈" : "👁️"}
                    </button>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Diperoleh dari Dashboard BuatQRIS → Open API (awalan
                    sk_live_…)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    API Base URL
                  </label>
                  <input
                    type="text"
                    value={
                      settings.buatqris?.apiBaseUrl ||
                      "https://api.buatqris.site"
                    }
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        buatqris: {
                          ...s.buatqris,
                          apiBaseUrl: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    Kedaluwarsa QR (menit)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={settings.buatqris?.expiryMinutes || 15}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        buatqris: {
                          ...s.buatqris,
                          expiryMinutes: Number(e.target.value) || 15,
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    Webhook Notification URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={settings.buatqris?.webhookUrl || ""}
                      className="w-full px-3 py-2.5 bg-supporting-100 border border-supporting-300 rounded-xl text-xs font-mono text-supporting-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          settings.buatqris?.webhookUrl || "",
                          "Webhook BuatQRIS",
                        )
                      }
                      className="px-3 py-2 bg-supporting-200 hover:bg-gray-300 text-supporting-700 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Salin
                    </button>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Daftarkan di Dashboard BuatQRIS → Webhook Settings
                  </span>
                </div>
              </div>

              {/* Test Ping Action */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs">
                  {testResults.buatqris && (
                    <div
                      className={`p-3 rounded-xl border font-medium ${
                        testResults.buatqris.success
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-red-50 text-red-800 border-red-200"
                      }`}
                    >
                      {testResults.buatqris.success ? "✓ " : "⚠️ "}
                      {testResults.buatqris.message}
                      {testResults.buatqris.latencyMs && (
                        <span className="text-xs opacity-75">
                          {" "}
                          ({testResults.buatqris.latencyMs}ms)
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleTest("buatqris")}
                  disabled={testingService === "buatqris"}
                  className="px-4 py-2 bg-supporting-100 hover:bg-supporting-200 text-supporting-800 text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {testingService === "buatqris"
                    ? "Menguji Koneksi..."
                    : "⚡ Uji Koneksi BuatQRIS"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: CASAKU QRIS (LEGACY) */}
          {activeTab === "casaku" && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-semibold text-supporting-900">
                    Konfigurasi Casaku QRIS (Legacy Gateway)
                  </h3>
                  <p className="text-xs text-supporting-500 mt-0.5">
                    Dynamic QRIS — nominal menyesuaikan total pesanan. Migrasi
                    dari Cashify ke Casaku.id (docs: casaku.id/docs)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSettings((s) => ({
                      ...s,
                      casaku: { ...s.casaku, enabled: !s.casaku.enabled },
                    }))
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    settings.casaku.enabled
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-supporting-100 text-supporting-700 border border-supporting-300"
                  }`}
                >
                  {settings.casaku.enabled ? "🟢 Aktif" : "⚪ Nonaktif"}
                </button>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    License Key *
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.casakuLicense ? "text" : "password"}
                      value={settings.casaku.licenseKey}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          casaku: {
                            ...s.casaku,
                            licenseKey: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret("casakuLicense")}
                      className="absolute right-3 top-2.5 text-xs text-supporting-500 hover:text-supporting-800 cursor-pointer"
                    >
                      {showSecrets.casakuLicense ? "🙈" : "👁️"}
                    </button>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Diperoleh dari Casaku Dashboard → API Keys (awalan
                    cashify_…/casaku_…
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    Webhook Secret *
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.casakuWebhook ? "text" : "password"}
                      value={settings.casaku.webhookSecret}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          casaku: {
                            ...s.casaku,
                            webhookSecret: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret("casakuWebhook")}
                      className="absolute right-3 top-2.5 text-xs text-supporting-500 hover:text-supporting-800 cursor-pointer"
                    >
                      {showSecrets.casakuWebhook ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    QRIS Merchant ID *
                  </label>
                  <input
                    type="text"
                    value={settings.casaku.qrId}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        casaku: { ...s.casaku, qrId: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    Kedaluwarsa QR (menit)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={settings.casaku.expiryMinutes}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        casaku: {
                          ...s.casaku,
                          expiryMinutes: Number(e.target.value) || 15,
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    Package IDs (pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={settings.casaku.packageIds.join(",")}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        casaku: {
                          ...s.casaku,
                          packageIds: e.target.value
                            .split(",")
                            .map((value) => value.trim())
                            .filter(Boolean),
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Contoh:
                    id.dana,com.gojek.gopaymerchant,com.shopee.id,com.bca.msb
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    API Base URL
                  </label>
                  <input
                    type="text"
                    value={settings.casaku.apiBaseUrl}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        casaku: { ...s.casaku, apiBaseUrl: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    Webhook Notification URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={settings.casaku.webhookUrl}
                      className="w-full px-3 py-2.5 bg-supporting-100 border border-supporting-300 rounded-xl text-xs font-mono text-supporting-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          settings.casaku.webhookUrl,
                          "Webhook Casaku",
                        )
                      }
                      className="px-3 py-2 bg-supporting-200 hover:bg-gray-300 text-supporting-700 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Salin
                    </button>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Daftarkan di Casaku Dashboard → Webhook Settings
                  </span>
                </div>
              </div>

              {/* Test Ping Action */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs">
                  {testResults.casaku && (
                    <div
                      className={`p-3 rounded-xl border font-medium ${
                        testResults.casaku.success
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-red-50 text-red-800 border-red-200"
                      }`}
                    >
                      {testResults.casaku.success ? "✓ " : "⚠️ "}
                      {testResults.casaku.message}
                      {testResults.casaku.latencyMs && (
                        <span className="text-xs opacity-75">
                          {" "}
                          ({testResults.casaku.latencyMs}ms)
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleTest("casaku")}
                  disabled={testingService === "casaku"}
                  className="px-4 py-2 bg-supporting-100 hover:bg-supporting-200 text-supporting-800 text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {testingService === "casaku"
                    ? "Menguji Koneksi..."
                    : "⚡ Uji Ping Koneksi Casaku"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: MIDTRANS GATEWAY */}
          {activeTab === "midtrans" && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-semibold text-supporting-900">
                    Konfigurasi Midtrans Snap & Core API
                  </h3>
                  <p className="text-xs text-supporting-500 mt-0.5">
                    Mendukung pembayaran otomatis QRIS, Virtual Account (BCA,
                    Mandiri, BRI, BNI), dan Kartu Kredit
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-supporting-600">
                    Mode Lingkungan:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        midtrans: {
                          ...s.midtrans,
                          isProduction: !s.midtrans.isProduction,
                        },
                      }))
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      settings.midtrans.isProduction
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}
                  >
                    {settings.midtrans.isProduction
                      ? "🟢 Production / Live"
                      : "🟡 Sandbox / Test Mode"}
                  </button>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    Server Key *
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.midtransServer ? "text" : "password"}
                      value={settings.midtrans.serverKey}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          midtrans: {
                            ...s.midtrans,
                            serverKey: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret("midtransServer")}
                      className="absolute right-3 top-2.5 text-xs text-supporting-500 hover:text-supporting-800 cursor-pointer"
                    >
                      {showSecrets.midtransServer ? "🙈" : "👁️"}
                    </button>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Diperoleh dari Midtrans Merchant Dashboard → Access Keys
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    Client Key *
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.midtransClient ? "text" : "password"}
                      value={settings.midtrans.clientKey}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          midtrans: {
                            ...s.midtrans,
                            clientKey: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret("midtransClient")}
                      className="absolute right-3 top-2.5 text-xs text-supporting-500 hover:text-supporting-800 cursor-pointer"
                    >
                      {showSecrets.midtransClient ? "🙈" : "👁️"}
                    </button>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Digunakan untuk memuat popup Snap pembayaran di checkout
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    Merchant ID
                  </label>
                  <input
                    type="text"
                    value={settings.midtrans.merchantId}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        midtrans: { ...s.midtrans, merchantId: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    Webhook Notification URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={settings.midtrans.webhookUrl}
                      className="w-full px-3 py-2.5 bg-supporting-100 border border-supporting-300 rounded-xl text-xs font-mono text-supporting-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          settings.midtrans.webhookUrl,
                          "Webhook Midtrans",
                        )
                      }
                      className="px-3 py-2 bg-supporting-200 hover:bg-gray-300 text-supporting-700 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Salin
                    </button>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Tempelkan URL ini di Midtrans Dashboard → Configuration →
                    Notification URL
                  </span>
                </div>
              </div>

              {/* Test Ping Action */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs">
                  {testResults.midtrans && (
                    <div
                      className={`p-3 rounded-xl border font-medium ${
                        testResults.midtrans.success
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-red-50 text-red-800 border-red-200"
                      }`}
                    >
                      {testResults.midtrans.success ? "✓ " : "⚠️ "}
                      {testResults.midtrans.message}
                      {testResults.midtrans.latencyMs && (
                        <span className="text-xs opacity-75">
                          {" "}
                          ({testResults.midtrans.latencyMs}ms)
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleTest("midtrans")}
                  disabled={testingService === "midtrans"}
                  className="px-4 py-2 bg-supporting-100 hover:bg-supporting-200 text-supporting-800 text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {testingService === "midtrans"
                    ? "Menguji Koneksi..."
                    : "⚡ Uji Ping Koneksi Midtrans"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: RAJAONGKIR */}
          {activeTab === "rajaongkir" && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-semibold text-supporting-900">
                    Konfigurasi Ekspedisi & Ongkos Kirim (RajaOngkir)
                  </h3>
                  <p className="text-xs text-supporting-500 mt-0.5">
                    Menghitung ongkos kirim real-time berdasarkan berat buku dan
                    alamat tujuan pembeli
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-supporting-600">
                    Paket Akun:
                  </span>
                  <select
                    value={settings.rajaongkir.tier}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        rajaongkir: {
                          ...s.rajaongkir,
                          tier: e.target.value as "starter" | "basic" | "pro",
                        },
                      }))
                    }
                    className="px-3 py-1.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="starter">Starter Tier (Gratis)</option>
                    <option value="basic">Basic Tier</option>
                    <option value="pro">Pro Tier (Kecamatan)</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    API Key RajaOngkir *
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.rajaongkir ? "text" : "password"}
                      value={settings.rajaongkir.apiKey}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          rajaongkir: {
                            ...s.rajaongkir,
                            apiKey: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret("rajaongkir")}
                      className="absolute right-3 top-2.5 text-xs text-supporting-500 hover:text-supporting-800 cursor-pointer"
                    >
                      {showSecrets.rajaongkir ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    Kota Asal Pengiriman (Gudang Pena Ameen)
                  </label>
                  <input
                    type="text"
                    value={settings.rajaongkir.originCityName}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        rajaongkir: {
                          ...s.rajaongkir,
                          originCityName: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Gudang Pusat: Surabaya, Jawa Timur (ID: 444)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    Kurir Ekspedisi Aktif
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      "JNE",
                      "J&T Express",
                      "SiCepat",
                      "Pos Indonesia",
                      "Wahana",
                    ].map((courier) => (
                      <span
                        key={courier}
                        className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-lg"
                      >
                        ✓ {courier}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Test Action */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs">
                  {testResults.rajaongkir && (
                    <div
                      className={`p-3 rounded-xl border font-medium ${
                        testResults.rajaongkir.success
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-red-50 text-red-800 border-red-200"
                      }`}
                    >
                      {testResults.rajaongkir.success ? "✓ " : "⚠️ "}
                      {testResults.rajaongkir.message}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleTest("rajaongkir")}
                  disabled={testingService === "rajaongkir"}
                  className="px-4 py-2 bg-supporting-100 hover:bg-supporting-200 text-supporting-800 text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {testingService === "rajaongkir"
                    ? "Menguji..."
                    : "⚡ Uji Hitung Tarif Ongkir"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: AUTO EMAIL & NOTIFICATIONS */}
          {activeTab === "email" && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-semibold text-supporting-900">
                    Otomatisasi Email Transaksional & Invoice
                  </h3>
                  <p className="text-xs text-supporting-500 mt-0.5">
                    Kirim email bukti pembayaran, kwitansi resmi, dan nomor resi
                    otomatis kepada pelanggan
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-supporting-600">
                    Provider Email:
                  </span>
                  <select
                    value={settings.autoEmail.provider}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        autoEmail: {
                          ...s.autoEmail,
                          provider: e.target.value as
                            "resend" | "smtp" | "sendgrid",
                        },
                      }))
                    }
                    className="px-3 py-1.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="resend">
                      Resend API (Rekomendasi Modern)
                    </option>
                    <option value="smtp">Custom SMTP Server</option>
                    <option value="sendgrid">SendGrid API</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    API Key / Secret Token *
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.emailApiKey ? "text" : "password"}
                      value={settings.autoEmail.apiKey}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          autoEmail: { ...s.autoEmail, apiKey: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret("emailApiKey")}
                      className="absolute right-3 top-2.5 text-xs text-supporting-500 hover:text-supporting-800 cursor-pointer"
                    >
                      {showSecrets.emailApiKey ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    Nama Pengirim (Sender Name)
                  </label>
                  <input
                    type="text"
                    value={settings.autoEmail.senderName}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        autoEmail: {
                          ...s.autoEmail,
                          senderName: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    Email Pengirim Resmi (Sender Email)
                  </label>
                  <input
                    type="email"
                    value={settings.autoEmail.senderEmail}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        autoEmail: {
                          ...s.autoEmail,
                          senderEmail: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    Triger Otomatis
                  </label>
                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 text-xs text-supporting-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoEmail.sendInvoiceOnPaid}
                        onChange={(e) =>
                          setSettings((s) => ({
                            ...s,
                            autoEmail: {
                              ...s.autoEmail,
                              sendInvoiceOnPaid: e.target.checked,
                            },
                          }))
                        }
                        className="rounded text-primary-600 focus:ring-primary-500"
                      />
                      <span>
                        Kirim invoice otomatis saat pembayaran terverifikasi
                      </span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-supporting-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoEmail.sendTrackingOnShipped}
                        onChange={(e) =>
                          setSettings((s) => ({
                            ...s,
                            autoEmail: {
                              ...s.autoEmail,
                              sendTrackingOnShipped: e.target.checked,
                            },
                          }))
                        }
                        className="rounded text-primary-600 focus:ring-primary-500"
                      />
                      <span>
                        Kirim nomor resi pengiriman saat pesanan berstatus
                        dikirim
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Test Action */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs">
                  {testResults.email && (
                    <div
                      className={`p-3 rounded-xl border font-medium ${
                        testResults.email.success
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-red-50 text-red-800 border-red-200"
                      }`}
                    >
                      {testResults.email.success ? "✓ " : "⚠️ "}
                      {testResults.email.message}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleTest("email")}
                  disabled={testingService === "email"}
                  className="px-4 py-2 bg-supporting-100 hover:bg-supporting-200 text-supporting-800 text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {testingService === "email"
                    ? "Mengirim Email..."
                    : "⚡ Kirim Email Uji Coba"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: EMAIL FORWARDING & CS */}
          {activeTab === "forwarding" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="text-base font-semibold text-supporting-900">
                  Email Forwarding & Notifikasi Admin / CS
                </h3>
                <p className="text-xs text-supporting-500 mt-0.5">
                  Setiap pesanan baru dan pertanyaan pelanggan akan diteruskan
                  langsung ke email & WA pengelola
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    Email Forwarding Utama (Penerima Laporan)
                  </label>
                  <input
                    type="email"
                    value={settings.emailForwarding.forwardingEmail}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        emailForwarding: {
                          ...s.emailForwarding,
                          forwardingEmail: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Email ini menerima notifikasi instan saat ada pembeli
                    membuat pesanan baru
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    Nomor WhatsApp CS / Admin Toko
                  </label>
                  <input
                    type="text"
                    value={settings.emailForwarding.whatsappAdminPhone}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        emailForwarding: {
                          ...s.emailForwarding,
                          whatsappAdminPhone: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Digunakan untuk link konfirmasi manual WhatsApp di halaman
                    checkout
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AUTH & SECURITY */}
          {activeTab === "auth" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="text-base font-semibold text-supporting-900">
                  Autentikasi & Whitelist Administrator
                </h3>
                <p className="text-xs text-supporting-500 mt-0.5">
                  Memastikan hanya email terverifikasi yang dapat masuk ke Panel
                  Admin Pena Ameen
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    Admin Email Whitelist (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={settings.clerkAuth.adminEmails}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        clerkAuth: {
                          ...s.clerkAuth,
                          adminEmails: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Email yang diizinkan mengakses panel ini:{" "}
                    <code>ihsanzz099@gmail.com,admin@penaameen.com</code>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    Clerk Publishable Key
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={settings.clerkAuth.publishableKey}
                    className="w-full px-4 py-2.5 bg-supporting-100 border border-supporting-300 rounded-xl text-xs font-mono text-supporting-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
                    Clerk Secret Key
                  </label>
                  <input
                    type="password"
                    readOnly
                    value={settings.clerkAuth.secretKey}
                    className="w-full px-4 py-2.5 bg-supporting-100 border border-supporting-300 rounded-xl text-xs font-mono text-supporting-600"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
