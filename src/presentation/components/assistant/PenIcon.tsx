interface PenIconProps {
  className?: string;
}

export function PenIcon({ className }: PenIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.8 2.8a1 1 0 0 1 1-1h2.4a1 1 0 0 1 1 1v7.5c-.2 1.6-1.1 2.7-2.2 3.6-1.1-.9-2-2-2.2-3.6V2.8Z" />
      <path d="M9 10.4h6v1.6a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1.6Z" />
      <path d="M10 14.6c.7 2 1.4 3.5 2 5.4.6-1.9 1.3-3.4 2-5.4" />
      <path d="M12 14.8v5.2" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
