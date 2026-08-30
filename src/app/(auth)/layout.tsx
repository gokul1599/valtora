import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-bold tracking-tight text-[var(--fg)]">
          VALTORA
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-[var(--fg-secondary)] hover:text-[var(--fg)]"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-fg)] hover:bg-[var(--accent-soft)]"
          >
            Start Building
          </Link>
        </div>
      </header>
      {children}
      <footer className="flex justify-center pb-6 text-xs text-[var(--fg-muted)]">
        <p>&copy; {new Date().getFullYear()} VALTORA. Turn an idea into a company.</p>
      </footer>
    </div>
  );
}