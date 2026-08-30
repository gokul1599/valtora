import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--border-soft)] bg-[var(--surface)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  sub,
  action,
  className,
}: {
  title: React.ReactNode;
  sub?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 px-5 pt-5 pb-3",
        className,
      )}
    >
      <div className="min-w-0">
        <h3 className="text-sm font-semibold tracking-tight text-[var(--fg)]">
          {title}
        </h3>
        {sub && (
          <p className="mt-1 text-xs leading-relaxed text-[var(--fg-muted)]">
            {sub}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function CardBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 pb-5", className)} {...props} />
  );
}