import { PenIcon } from "./PenIcon";

interface AmeenAvatarProps {
  className?: string;
}

export function AmeenAvatar({ className = "h-10 w-10" }: AmeenAvatarProps) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 via-primary-700 to-primary-900 text-white shadow-md shadow-primary-900/25 ring-2 ring-white/40 ${className}`}
    >
      <PenIcon className="h-[55%] w-[55%]" />
    </span>
  );
}
