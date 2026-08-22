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

/**
 * Operational record table.
 *
 * Presentation only: sorting, filtering, and authorization stay with callers.
 */
export function DataTable<T>({
  columns,
  data,
  keyAccessor,
  emptyMessage = "No data available",
  rowClassName,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <span
          aria-hidden="true"
          className="mx-auto mb-4 block h-px w-12 bg-supporting-300"
        />
        <p className="text-sm text-supporting-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-supporting-200">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-supporting-500 ${
                  column.className ?? ""
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={keyAccessor(row)}
              className={`border-b border-supporting-100 transition-colors last:border-b-0 hover:bg-supporting-50 ${
                rowClassName?.(row) ?? ""
              }`}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-5 py-4 align-middle text-supporting-800 ${
                    column.className ?? ""
                  }`}
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
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-4 border-t border-supporting-200 px-5 py-4"
    >
      <p className="text-xs text-supporting-500">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        {currentPage > 1 && (
          <Link
            href={`${baseUrl}?page=${currentPage - 1}`}
            className="rounded-full border border-supporting-300 px-3.5 py-1.5 text-xs text-supporting-700 transition-colors hover:border-primary-700 hover:text-primary-900"
          >
            Previous
          </Link>
        )}
        {visiblePages.map((page) => (
          <Link
            key={page}
            href={`${baseUrl}?page=${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
              page === currentPage
                ? "bg-primary-900 text-background-50"
                : "text-supporting-600 hover:bg-supporting-100"
            }`}
          >
            {page}
          </Link>
        ))}
        {currentPage < totalPages && (
          <Link
            href={`${baseUrl}?page=${currentPage + 1}`}
            className="rounded-full border border-supporting-300 px-3.5 py-1.5 text-xs text-supporting-700 transition-colors hover:border-primary-700 hover:text-primary-900"
          >
            Next
          </Link>
        )}
      </div>
    </nav>
  );
}
