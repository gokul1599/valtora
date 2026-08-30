import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "default" | "accent" | "success" | "warning" | "danger" | "muted";

const toneClasses: Record<BadgeTone, string> = {
  default: "bg-[var(--border-soft)] text-[var(--fg-secondary)]",
  accent: "bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent)]",
  success: "bg-[color-mix(in_srgb,var(--success)_15%,transparent)] text-[var(--success)]",
  warning: "bg-[color-mix(in_srgb,var(--warning)_15%,transparent)] text-[var(--warning)]",
  danger: "bg-[color-mix(in_srgb,var(--danger)_15%,transparent)] text-[var(--danger)]",
  muted: "bg-[var(--border-soft)] text-[var(--fg-muted)]",
};

export function Badge({
  tone = "default",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium leading-4",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}