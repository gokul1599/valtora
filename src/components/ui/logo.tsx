import { cn } from "@/lib/utils";

export function Logo({ className, size = 22 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path
        d="M16 3.5 27 9.75v12.5L16 28.5 5 22.25V9.75L16 3.5Z"
        stroke="var(--color-brand-500)"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="color-mix(in oklab, var(--color-brand-500) 12%, transparent)"
      />
      <path
        d="M11 13.5c2.5-3 7-1.5 7 2s-3 4-4 6"
        stroke="var(--color-brand-500)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="20.5" cy="21.5" r="1.6" fill="var(--color-brand-400)" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Logo size={22} />
      <span className="text-[0.9375rem] font-bold tracking-[0.18em] text-[var(--fg)]">
        FORGE<span className="text-[var(--color-brand-500)]">AI</span>
      </span>
    </div>
  );
}