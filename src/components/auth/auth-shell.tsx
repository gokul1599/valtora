import Link from "next/link";
import { Wordmark } from "@/components/ui/logo";

export function AuthShell({
  backLabel = "Back to home",
  backHref = "/",
  children,
}: {
  backLabel?: string;
  backHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_0%,color-mix(in_oklab,var(--color-brand-500)_7%,transparent),transparent)]" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Link href="/" aria-label="ForgeAI home">
            <Wordmark />
          </Link>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)] sm:p-8">
          {children}
        </div>
        <p className="mt-6 text-center text-xs text-[var(--muted)]">
          <Link href={backHref} className="hover:text-[var(--fg)]">
            ← {backLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}