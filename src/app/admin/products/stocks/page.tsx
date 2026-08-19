import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { ProductsTabs } from "@/presentation/components/admin/ProductsTabs";
import { StockSheetManager } from "@/presentation/components/admin/StockSheetManager";
import { requireStaffActor } from "@/application/auth/clerk-auth";

export default async function AdminStockSheetsPage() {
  void (await requireStaffActor("inventory:read"));

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Manage Stocks"
        description="Kelola produk dan stok langsung melalui Google Sheets — setiap perubahan tercatat otomatis"
      />
      <ProductsTabs />
      <StockSheetManager />
    </div>
  );
}
