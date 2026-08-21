import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { ProductsTabs } from "@/presentation/components/admin/ProductsTabs";
import { StockSheetManager } from "@/presentation/components/admin/StockSheetManager";
import { requireStaffActor } from "@/application/auth/clerk-auth";

const PUBLISHED_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQRHNf6wRYIWJlfO_M-pcM6O7RZFT-B3QltoLnhMoJZeMcrxQ8RYTzLM-zyJcg57va2EIP3lZHOtvTc/pubhtml?widget=true&headers=false";
const GOOGLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1OlK9J1kw9U4Br9OCdzVsBw5aabVQ24jwWRNCFFtHETc/edit";

export default async function AdminStockSheetsPage() {
  void (await requireStaffActor("inventory:read"));

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Manage Stocks"
        description="Kelola produk dan stok langsung melalui Google Sheets — setiap perubahan tercatat otomatis"
        actions={
          <a
            href={GOOGLE_SHEET_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Buka Google Sheets
          </a>
        }
      />
      <ProductsTabs />
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-gray-900">Spreadsheet Produk</h2>
            <p className="mt-1 text-sm text-gray-500">
              Tampilan langsung spreadsheet publik untuk pemeriksaan cepat.
            </p>
          </div>
          <a
            href={GOOGLE_SHEET_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-primary-700 hover:text-primary-900"
          >
            Buka penuh ↗
          </a>
        </div>
        <div className="h-[520px] w-full bg-gray-50 sm:h-[680px]">
          <iframe
            src={PUBLISHED_SHEET_URL}
            title="Spreadsheet produk PENA AMEEN"
            className="h-full w-full border-0"
            loading="lazy"
          />
        </div>
      </section>
      <StockSheetManager />
    </div>
  );
}
