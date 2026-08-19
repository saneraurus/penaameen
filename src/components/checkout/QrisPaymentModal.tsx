"use client";

import { useEffect } from "react";
import Image from "next/image";

export interface CasakuPaymentData {
  transactionId: string;
  qrString?: string;
  originalAmount: number;
  totalAmount: number;
  uniqueNominal: number;
  expiredInMinutes: number;
  paymentUrl?: string;
  expiresAt: string;
}

interface QrisPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string | null;
  casakuData: CasakuPaymentData | null;
  countdown: number | null;
  qrImageFailed: boolean;
  onQrImageFailed: () => void;
  checkingPayment: boolean;
  isRegenerating: boolean;
  onCheckStatus: () => void;
  onRegenerate: () => void;
}

function casakuQrImageUrl(data: string): string {
  const url = new URL("https://larabert-qrgen.hf.space/v1/create-qr-code");
  url.searchParams.set("size", "300x300");
  url.searchParams.set("style", "2");
  url.searchParams.set("color", "111111");
  url.searchParams.set("data", data);
  return url.toString();
}

function formatCountdown(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function QrisPaymentModal({
  isOpen,
  onClose,
  orderNumber,
  casakuData,
  countdown,
  qrImageFailed,
  onQrImageFailed,
  checkingPayment,
  isRegenerating,
  onCheckStatus,
  onRegenerate,
}: QrisPaymentModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !casakuData) return null;

  const isExpiringSoon = countdown !== null && countdown <= 60;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Pembayaran QRIS"
    >
      <div
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-supporting-200 overflow-hidden max-h-[94dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-supporting-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white font-bold text-sm shadow-sm flex-shrink-0">
              🪙
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-serif font-bold text-primary-950 truncate">
                Scan QRIS untuk Membayar
              </h3>
              <p className="text-[10px] text-supporting-500 truncate">
                {orderNumber ? `Order ${orderNumber}` : "Pembayaran QRIS"} ·
                Kode berlaku {casakuData.expiredInMinutes} menit
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-supporting-100 hover:bg-supporting-200 text-supporting-700 flex items-center justify-center text-xs font-bold transition-all cursor-pointer flex-shrink-0"
            aria-label="Tutup pembayaran QRIS"
          >
            ✕
          </button>
        </div>

        {/* Countdown bar */}
        <div className="px-5 pt-4">
          <div
            className={`flex items-center justify-between px-3.5 py-2 rounded-xl border text-[11px] font-semibold ${
              isExpiringSoon
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-supporting-50 border-supporting-200 text-supporting-700"
            }`}
          >
            <span>⏱ Sisa waktu pembayaran</span>
            <span
              className={`font-mono text-sm font-bold ${
                isExpiringSoon ? "text-red-600" : "text-primary-700"
              }`}
            >
              {countdown !== null ? formatCountdown(countdown) : "--:--"}
            </span>
          </div>
        </div>

        {/* Body: QR + detail */}
        <div className="p-5 flex items-center gap-4">
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-2xl border border-supporting-200 bg-white p-2 shadow-sm flex-shrink-0">
            {casakuData.qrString && !qrImageFailed ? (
              <Image
                src={casakuQrImageUrl(casakuData.qrString)}
                alt="Kode QRIS Pena Ameen"
                fill
                sizes="160px"
                className="object-contain rounded-lg"
                onError={onQrImageFailed}
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-center text-[10px] text-supporting-500 px-2">
                Gagal memuat QR. Gunakan tombol &quot;Buka Halaman
                Pembayaran&quot;.
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-emerald-700">
                Nominal Dibayar
              </p>
              <p className="text-lg font-bold text-emerald-800 leading-tight">
                Rp{casakuData.totalAmount.toLocaleString("id-ID")}
              </p>
              {casakuData.uniqueNominal > 0 && (
                <p className="text-[10px] text-emerald-700/80">
                  Termasuk kode unik Rp
                  {casakuData.uniqueNominal.toLocaleString("id-ID")}
                </p>
              )}
            </div>

            <ol className="text-[10.5px] text-supporting-600 space-y-1 leading-snug list-decimal list-inside">
              <li>Buka aplikasi pembayaran (GoPay, OVO, Dana, dll.)</li>
              <li>Pilih menu Scan / QRIS, pindai kode</li>
              <li>Pastikan nominal sesuai total di atas</li>
              <li>Konfirmasi, lalu tekan &quot;Saya Sudah Bayar&quot;</li>
            </ol>
          </div>
        </div>

        {/* Expiry warning */}
        {isExpiringSoon && (
          <div className="px-5 pb-1">
            <p className="text-[10px] text-red-600 font-medium">
              QR hampir kedaluwarsa — selesaikan sekarang atau buat QR baru.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="px-5 pt-2 pb-5 space-y-2">
          <button
            type="button"
            onClick={onCheckStatus}
            disabled={checkingPayment}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            {checkingPayment ? (
              <>
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                <span>Memeriksa...</span>
              </>
            ) : (
              <span>✓ Saya Sudah Bayar</span>
            )}
          </button>

          {(casakuData.paymentUrl || casakuData.qrString) && (
            <div className="flex flex-wrap gap-2">
              {casakuData.paymentUrl && (
                <a
                  href={casakuData.paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[8rem] px-3 py-2.5 bg-white border border-supporting-300 hover:bg-supporting-50 text-supporting-700 text-[11px] font-bold rounded-xl transition-all text-center"
                >
                  Buka Halaman Pembayaran ↗
                </a>
              )}
              {casakuData.qrString && (
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      casakuData.qrString as string,
                    );
                    alert("Kode QRIS berhasil disalin!");
                  }}
                  className="flex-1 min-w-[8rem] px-3 py-2.5 bg-white border border-supporting-300 hover:bg-supporting-50 text-supporting-700 text-[11px] font-bold rounded-xl transition-all cursor-pointer"
                >
                  Salin Kode QR
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="w-full py-2.5 bg-white border border-primary-300 hover:bg-primary-50 text-primary-700 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isRegenerating ? (
              <>
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-primary-600 border-t-transparent" />
                <span>Membuat QR Baru...</span>
              </>
            ) : (
              <span>↻ Buat QR Baru</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
