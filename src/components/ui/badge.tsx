import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "neutral" | "brand" | "ai" | "success" | "warning" | "danger" | "info";

const tones: Record<Tone, string> = {
  neutral: "bg-[var(--surface-2)] text-[var(--muted)]",
  brand: "bg-[var(--color-brand-500)]/10 text-[var(--color-brand-600)] dark:text-[var(--color-brand-300)]",
  ai: "bg-[var(--color-ai-500)]/10 text-[var(--color-ai-600)] dark:text-[var(--color-ai-300)]",
  success: "bg-[var(--color-success)]/12 text-emerald-700 dark:text-emerald-300",
  warning: "bg-[var(--color-warning)]/15 text-amber-700 dark:text-amber-300",
  danger: "bg-red-500/10 text-red-700 dark:text-red-300",
  info: "bg-[var(--color-info)]/12 text-blue-700 dark:text-blue-300",
};

export function Badge({
  tone = "neutral",
  dot,
  className,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span className={cn("chip", tones[tone], className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />}
      {children}
    </span>
  );
}

export function Dot({ tone = "neutral" }: { tone?: Tone }) {
  return <span className={cn("inline-block h-1.5 w-1.5 rounded-full", tones[tone].split(" ")[0])} />;
}