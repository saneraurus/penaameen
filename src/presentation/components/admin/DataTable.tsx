import { ReactNode } from "react";
import Link from "next/link";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyAccessor: (row: T) => string;
  emptyMessage?: string;
  rowClassName?: (row: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  keyAccessor,
  emptyMessage = "No data available",
  rowClassName,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">{emptyMessage}</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 font-medium text-gray-600 uppercase tracking-wider ${column.className ?? ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row) => (
            <tr
              key={keyAccessor(row)}
              className={`transition-colors ${rowClassName?.(row) ?? ""}`}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-4 py-3 text-gray-900 ${column.className ?? ""}`}
                >
                  {column.render
                    ? column.render(row)
                    : String(
                        (row as Record<string, unknown>)[column.key] ?? "",
                      )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  showPerPage?: boolean;
  perPage?: number;
  onPerPageChange?: (perPage: number) => void;
  baseUrl?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1,
  );

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center gap-1">
        {currentPage > 1 && (
          <Link
            href={`${baseUrl}?page=${currentPage - 1}`}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
          >
            Previous
          </Link>
        )}
        {visiblePages.map((page) => (
          <Link
            key={page}
            href={`${baseUrl}?page=${page}`}
            className={`w-8 h-8 text-sm rounded-md font-medium flex items-center justify-center ${
              page === currentPage
                ? "bg-primary-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {page}
          </Link>
        ))}
        {currentPage < totalPages && (
          <Link
            href={`${baseUrl}?page=${currentPage + 1}`}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
