"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductStatusButtonProps {
  productId: string;
  currentStatus: "published" | "draft" | "archived";
}

export function ProductStatusButton({
  productId,
  currentStatus,
}: ProductStatusButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: "published" | "draft" | "archived") => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Gagal mengubah status produk");
      }
    } catch {
      alert("Terjadi kesalahan jaringan saat mengubah status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini secara permanen?")) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Gagal menghapus produk");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {currentStatus !== "published" && (
        <button
          type="button"
          onClick={() => handleStatusChange("published")}
          disabled={isLoading}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-50 transition-colors cursor-pointer"
          title="Tampilkan produk di katalog toko publik"
        >
          {isLoading ? "..." : "✓ Tampilkan"}
        </button>
      )}

      {currentStatus !== "archived" && (
        <button
          type="button"
          onClick={() => handleStatusChange("archived")}
          disabled={isLoading}
          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 disabled:opacity-50 transition-colors cursor-pointer"
          title="Sembunyikan produk dari katalog toko publik"
        >
          {isLoading ? "..." : "Arsipkan"}
        </button>
      )}

      {currentStatus === "archived" && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isLoading}
          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 disabled:opacity-50 transition-colors cursor-pointer"
          title="Hapus produk permanen"
        >
          {isLoading ? "..." : "Hapus"}
        </button>
      )}
    </div>
  );
}
