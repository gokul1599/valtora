import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card", className)} {...props} />;
}

export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-4", className)}>
      <div className="space-y-0.5">
        <h3 className="text-[0.9375rem] font-semibold tracking-tight text-[var(--fg)]">{title}</h3>
        {description && <p className="text-xs leading-relaxed text-[var(--muted)]">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 py-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between gap-3 border-t border-[var(--border)] px-5 py-3", className)}
      {...props}
    />
  );
}

export function SectionTitle({
  title,
  sub,
  action,
  className,
}: {
  title: string;
  sub?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-3", className)}>
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-[var(--fg)]">{title}</h2>
        {sub && <p className="mt-0.5 text-sm text-[var(--muted)]">{sub}</p>}
      </div>
      {action}
    </div>
  );
}