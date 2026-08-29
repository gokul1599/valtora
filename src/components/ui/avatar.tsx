import { initials } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function Avatar({ name, image, size = "md", className }: { name: string; image?: string | null; size?: "sm" | "md" | "lg"; className?: string }) {
  const dim = size === "sm" ? "h-7 w-7 text-[0.625rem]" : size === "lg" ? "h-10 w-10 text-sm" : "h-8 w-8 text-xs";
  if (image) {
    return <img src={image} alt={name} className={cn("rounded-full object-cover ring-1 ring-[var(--border)]", dim, className)} />;
  }
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-700)] font-semibold text-white",
        dim,
        className
      )}
    >
      {initials(name)}
    </span>
  );
}