import * as React from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--border)]",
        "px-6 py-12 text-center",
        className,
      )}
    >
      {icon && (
        <div className="flex size-11 items-center justify-center rounded-full bg-[var(--border-soft)] text-[var(--fg-muted)]">
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-[var(--fg)]">{title}</p>
        {description && (
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-[var(--fg-muted)]">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({
  title = "We couldn't complete this.",
  description = "Your startup data is safe.",
  action,
  className,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--danger)]/30",
        "px-6 py-12 text-center",
        className,
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--danger)_15%,transparent)] text-[var(--danger)]">
        <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--fg)]">{title}</p>
        <p className="mt-1 text-xs text-[var(--fg-muted)]">{description}</p>
      </div>
      {action}
    </div>
  );
}