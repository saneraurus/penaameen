"use client";

import { useState, useTransition, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, User, ShieldCheck } from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Mohon isi username dan password.");
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username.trim(),
            password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(
            data.error ||
              "Gagal masuk. Periksa kembali username dan password Anda.",
          );
          return;
        }

        // On success, redirect to destination
        router.push(redirectUrl);
        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi gangguan koneksi. Silakan coba lagi.",
        );
      }
    });
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-white/10 bg-primary-950/80 p-8 shadow-2xl backdrop-blur-md">
        {/* Header Branding */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-400/30 bg-accent-500/10 text-accent-400">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div className="relative mx-auto mb-2 block h-8 w-32 brightness-0 invert">
            <Image
              src="/images/logo.png"
              alt="PENA AMEEN"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <h1 className="mt-4 font-serif text-2xl font-medium tracking-tight text-background-100">
            Masuk Admin
          </h1>
          <p className="mt-1 text-xs text-background-200/70">
            Masuk dengan akun administrator atau staf Pena Ameen
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-500/30 bg-red-950/50 p-3.5 text-xs text-red-200"
          >
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-semibold uppercase tracking-[0.12em] text-background-200"
            >
              Username
            </label>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                <User className="h-4 w-4" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoCapitalize="none"
                autoComplete="username"
                autoCorrect="off"
                spellCheck="false"
                required
                disabled={isPending}
                placeholder="Username"
                className="block w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-accent-400 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-accent-400 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-[0.12em] text-background-200"
            >
              Kata Sandi
            </label>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={isPending}
                placeholder="Kata Sandi"
                className="block w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-white/30 focus:border-accent-400 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-accent-400 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/40 hover:text-white/80"
                aria-label={
                  showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent-400 px-4 py-3 text-sm font-semibold text-primary-950 transition-all hover:bg-accent-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-950 border-t-transparent" />
                Memverifikasi...
              </>
            ) : (
              "Masuk ke Admin Panel"
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-white/10 pt-4 text-center">
          <Link
            href="/"
            className="text-xs text-background-200/60 hover:text-background-100 transition-colors"
          >
            ← Kembali ke Website Utama
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-primary-950 px-4 py-12">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <Image
          src="/images/penaameen/hero/hero-family-learning.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary-950/85" />
      </div>

      <div className="relative z-10 w-full flex justify-center">
        <Suspense
          fallback={<div className="text-white text-sm">Memuat halaman...</div>}
        >
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
