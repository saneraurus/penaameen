import Link from "next/link";
import { ReactNode } from "react";

interface WorkQueueCardProps {
  title: string;
  count: number;
  description: string;
  href: string;
  icon: ReactNode;
  variant?: "default" | "warning" | "critical";
}

export function WorkQueueCard({
  title,
  count,
  description,
  href,
  icon,
  variant = "default",
}: WorkQueueCardProps) {
  const variantClasses = {
    default: "border-gray-200 hover:border-gray-300",
    warning: "border-yellow-200 bg-yellow-50 hover:border-yellow-300",
    critical: "border-red-200 bg-red-50 hover:border-red-300",
  };

  return (
    <Link
      href={href}
      className={`block p-5 border rounded-xl transition-all duration-200 ${variantClasses[variant]} hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl" aria-hidden="true">{icon}</span>
            <h3 className="text-lg font-semibold text-gray-900 truncate">{title}</h3>
          </div>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="text-3xl font-bold text-gray-900">{count}</div>
          <div className="text-xs text-gray-400 mt-1">items</div>
        </div>
      </div>
    </Link>
  );
}