import { cn } from "@/lib/utils";
import React, { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "ghost" | "soft" | "outline" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const styles: Record<Variant, string> = {
  primary: "btn btn-primary",
  ghost: "btn btn-ghost",
  soft: "btn btn-soft",
  outline: "btn btn-outline",
  danger: "btn btn-danger",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2 text-sm rounded-[0.625rem]",
  lg: "px-5 py-2.5 text-sm rounded-[0.625rem]",
  icon: "h-9 w-9 rounded-lg",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  asChild?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  loadingText,
  icon,
  className,
  children,
  disabled,
  asChild,
  ...props
}: ButtonProps) {
  const cls = cn(styles[variant], sizes[size], className);
  const inner = loading ? (
    <>
      <Spinner className="h-3.5 w-3.5" />
      {loadingText ?? children}
    </>
  ) : (
    <>
      {icon}
      {children}
    </>
  );

  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<{ className?: string }>;
    return React.cloneElement(child, { className: cn(cls, child.props.className) });
  }

  return (
    <button className={cls} disabled={disabled || loading} {...props}>
      {inner}
    </button>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}