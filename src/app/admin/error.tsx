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
      <div className="admin-panel max-w-md w-full p-8 text-center space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-accent-200 bg-accent-50 text-accent-700 text-3xl">
          {isAuthError ? "🔒" : isPermissionError ? "⛔" : "⚠️"}
        </div>

        <div>
          <h2 className="text-xl font-serif font-semibold text-supporting-900">
            {isAuthError
              ? "Autentikasi Admin Diperlukan"
              : isPermissionError
                ? "Akses Dibatasi"
                : "Terjadi Kendala Memuat Admin"}
          </h2>
          <p className="mt-2 text-xs text-supporting-500 leading-relaxed">
            {isAuthError
              ? "Halaman ini khusus untuk staff dan pengelola Pena Ameen. Silakan masuk dengan akun yang memiliki hak akses admin."
              : isPermissionError
                ? "Akun Anda saat ini tidak memiliki izin (Organization Role: Admin / Staff) untuk mengakses fitur ini."
                : error.message ||
                  "Terjadi kesalahan saat memuat dashboard operasional."}
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          {isAuthError ? (
            <Link
              href="/admin/login"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary-950 px-4 py-3 text-xs font-semibold text-background-100 tracking-tight transition-colors hover:bg-primary-900"
            >
              Masuk ke Portal Admin
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary-950 px-4 py-2.5 text-xs font-semibold text-background-100 tracking-tight transition-colors hover:bg-primary-900"
            >
              Coba Muat Ulang
            </button>
          )}

          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-supporting-300 px-4 py-2 text-xs font-medium text-supporting-700 tracking-tight transition-colors hover:bg-supporting-50"
          >
            ← Kembali ke Website Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
