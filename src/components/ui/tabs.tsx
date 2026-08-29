"use client";

import { cn } from "@/lib/utils";

type Tab = { id: string; label: string; badge?: string | number };

export function Tabs({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full gap-0.5 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] p-0.5",
        className
      )}
      role="tablist"
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
            active === t.id
              ? "bg-[var(--card)] text-[var(--fg)] shadow-[var(--shadow-card)]"
              : "text-[var(--muted)] hover:text-[var(--fg)]"
          )}
        >
          {t.label}
          {t.badge !== undefined && (
            <span
              className={cn(
                "rounded-full px-1.5 text-[0.6875rem] font-semibold",
                active === t.id ? "bg-[var(--color-brand-500)]/12 text-[var(--color-brand-600)] dark:text-[var(--color-brand-300)]" : "bg-[var(--surface-2)] text-[var(--muted)]"
              )}
            >
              {t.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}