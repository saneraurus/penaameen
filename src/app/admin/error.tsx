"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Portal Access Error:", error);
  }, [error]);

  const isAuthError =
    error.message.includes("AUTHENTICATION_REQUIRED") ||
    error.message.includes("Staff authentication required");

  const isPermissionError =
    error.message.includes("AUTHORIZATION_DENIED") ||
    error.message.includes("Capability required");

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 p-8 shadow-sm text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-3xl">
          {isAuthError ? "🔒" : isPermissionError ? "⛔" : "⚠️"}
        </div>

        <div>
          <h2 className="text-xl font-serif font-bold text-gray-900">
            {isAuthError
              ? "Autentikasi Admin Diperlukan"
              : isPermissionError
              ? "Akses Dibatasi"
              : "Terjadi Kendala Memuat Admin"}
          </h2>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            {isAuthError
              ? "Halaman ini khusus untuk staff dan pengelola Pena Ameen. Silakan masuk dengan akun yang memiliki hak akses admin."
              : isPermissionError
              ? "Akun Anda saat ini tidak memiliki izin (Organization Role: Admin / Staff) untuk mengakses fitur ini."
              : error.message || "Terjadi kesalahan saat memuat dashboard operasional."}
          </p>
        </div>

        <div className="pt-2 space-y-2.5">
          {isAuthError ? (
            <Link
              href="/sign-in?redirect_url=/admin"
              className="w-full inline-flex items-center justify-center py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-950/10"
            >
              Masuk ke Portal Admin
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => reset()}
              className="w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-xl transition-all"
            >
              Coba Muat Ulang
            </button>
          )}

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center py-2 text-gray-500 hover:text-gray-700 text-xs font-medium"
          >
            ← Kembali ke Website Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
