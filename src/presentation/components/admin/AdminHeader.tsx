import { ReactNode } from "react";

interface AdminHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function AdminHeader({ title, description, actions }: AdminHeaderProps) {
  return (
    <header className="border-b border-supporting-200 pb-6">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-supporting-400">
            Pena Ameen Operations
          </p>
          <h1 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-supporting-900 sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-supporting-500">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
