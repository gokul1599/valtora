import { cn } from "@/lib/utils";

export function Progress({
  value,
  max = 100,
  tone = "brand",
  className,
  size = "md",
}: {
  value: number;
  max?: number;
  tone?: "brand" | "ai" | "success" | "warning" | "danger";
  className?: string;
  size?: "sm" | "md";
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const color = {
    brand: "bg-[var(--color-brand-500)]",
    ai: "bg-[var(--color-ai-500)]",
    success: "bg-[var(--color-success)]",
    warning: "bg-[var(--color-warning)]",
    danger: "bg-[var(--color-danger)]",
  }[tone];
  return (
    <div
      className={cn("w-full overflow-hidden rounded-full bg-[var(--surface-2)]", size === "sm" ? "h-1.5" : "h-2", className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={cn("h-full rounded-full transition-[width] duration-500 ease-out", color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function ScoreRing({ value, size = 72, className }: { value: number; size?: number; className?: string }) {
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  const color = value >= 80 ? "var(--color-success)" : value >= 60 ? "var(--color-brand-500)" : value >= 40 ? "var(--color-warning)" : "var(--color-danger)";
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--surface-2)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-semibold tabular-nums tracking-tight text-[var(--fg)]">{Math.round(value)}</span>
      </div>
    </div>
  );
}

export function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-28 shrink-0 text-xs text-[var(--muted)]">{label}</span>
      <Progress value={value} tone={value >= 70 ? "success" : value >= 45 ? "brand" : "warning"} className="flex-1" />
      <span className="w-8 text-right text-xs font-semibold tabular-nums text-[var(--fg)]">{Math.round(value)}</span>
    </div>
  );
}