"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/ui/icon";
import { Logo, Wordmark } from "@/components/ui/logo";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useToast } from "@/components/ui/toast";
import type { Startup, User } from "@/lib/types";

const MAIN_NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/dashboard", label: "Overview", icon: "overview" },
  { href: "/dashboard/blueprint", label: "Startup Blueprint", icon: "blueprint" },
  { href: "/dashboard/market", label: "Market", icon: "market" },
  { href: "/dashboard/competitors", label: "Competitors", icon: "competitors" },
  { href: "/dashboard/customers", label: "Customers", icon: "customers" },
  { href: "/dashboard/business-model", label: "Business Model", icon: "business-model" },
  { href: "/dashboard/product", label: "Product", icon: "product" },
  { href: "/dashboard/mvp", label: "MVP", icon: "mvp" },
  { href: "/dashboard/technology", label: "Technology", icon: "technology" },
  { href: "/dashboard/roadmap", label: "Roadmap", icon: "roadmap" },
  { href: "/dashboard/marketing", label: "Marketing", icon: "marketing" },
  { href: "/dashboard/launch", label: "Launch", icon: "launch" },
];

const BOTTOM_NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/dashboard/cofounder", label: "AI Co-Founder", icon: "cofounder" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
];

export function SidebarNav({
  items,
  onNavigate,
}: {
  items: { href: string; label: string; icon: IconName }[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "group flex items-center gap-2.5 rounded-lg px-2.5 py-[0.4375rem] text-[0.82rem] font-medium transition-colors",
            isActive(item.href)
              ? "bg-[var(--color-brand-500)]/10 text-[var(--color-brand-600)] dark:text-[var(--color-brand-300)]"
              : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
          )}
        >
          <Icon name={item.icon} size={15} className={cn(isActive(item.href) && "opacity-90")} />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({
  user,
  startups,
  activeStartup,
  children,
}: {
  user: User;
  startups: Startup[];
  activeStartup: Startup | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeLabel =
    MAIN_NAV.find((n) =>
      n.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(n.href)
    )?.label ?? "Dashboard";

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-[var(--border)] bg-[var(--sidebar)] lg:flex">
        <div className="flex h-14 items-center px-4">
          <Wordmark />
        </div>
        <StartupPicker startups={startups} activeStartup={activeStartup} />
        <SidebarNav items={MAIN_NAV} />
        <div className="border-t border-[var(--border)] px-2 py-2">
          <SidebarNav items={BOTTOM_NAV} />
        </div>
      </aside>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-[var(--sidebar)] shadow-[var(--shadow-float)]">
            <div className="flex h-14 items-center justify-between px-4">
              <Wordmark />
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--surface-2)]"
                aria-label="Close menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto">
              <StartupPicker startups={startups} activeStartup={activeStartup} />
              <SidebarNav items={MAIN_NAV} onNavigate={() => setMobileOpen(false)} />
            </div>
            <div className="border-t border-[var(--border)] px-2 py-2">
              <SidebarNav items={BOTTOM_NAV} onNavigate={() => setMobileOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--bg)]/85 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--surface-2)] lg:hidden"
              aria-label="Open menu"
            >
              <Icon name="menu" size={18} />
            </button>
            <span className="text-sm font-medium text-[var(--fg)]">{activeLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserMenu user={user} hiddenOnMobile />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        <footer className="px-6 py-6 text-center text-xs text-[var(--muted)]">
          ForgeAI — your AI co-founder. Est. 2026.
        </footer>
      </div>
    </div>
  );
}

function StartupPicker({
  startups,
  activeStartup,
}: {
  startups: Startup[];
  activeStartup: Startup | null;
}) {
  if (startups.length <= 1) {
    return (
      <div className="border-b border-[var(--border)] px-4 py-2.5">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--color-brand-500)]/12 text-xs font-bold text-[var(--color-brand-600)] dark:text-[var(--color-brand-300)]">
            {activeStartup?.name?.charAt(0) ?? "S"}
          </span>
          <span className="truncate text-[0.8rem] font-semibold text-[var(--fg)]">
            {activeStartup?.name ?? "No startup"}
          </span>
        </div>
      </div>
    );
  }
  return (
    <StartupSelector startups={startups} activeStartup={activeStartup} />
  );
}

function StartupSelector({ startups, activeStartup }: { startups: Startup[]; activeStartup: Startup | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const select = async (id: string) => {
    setOpen(false);
    const res = await fetch("/api/startup/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startupId: id }),
    });
    if (res.ok) {
      router.refresh();
      toast("Switched startup", "success");
    } else {
      toast("Could not switch startup", "error");
    }
  };

  return (
    <div className="relative border-b border-[var(--border)] px-3 py-2.5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1.5 hover:bg-[var(--surface)]"
      >
        <span className="truncate text-[0.8rem] font-semibold text-[var(--fg)]">
          {activeStartup?.name ?? "Select project"}
        </span>
        <Icon name="chevron" size={12} className={cn("transition-transform", open && "rotate-90")} />
      </button>
      {open && (
        <div className="absolute left-3 right-3 top-full z-20 mt-1 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-float)]">
          {startups.map((s) => (
            <button
              key={s.id}
              onClick={() => select(s.id)}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[var(--surface-2)]",
                s.id === activeStartup?.id && "bg-[var(--surface)]"
              )}
            >
              <span className="truncate">{s.name}</span>
              {s.id === activeStartup?.id && <Icon name="check" size={14} className="ml-auto text-[var(--color-brand-500)]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UserMenu({ user, hiddenOnMobile }: { user: User; hiddenOnMobile?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className={cn(hiddenOnMobile && "max-sm:hidden")}>
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-full p-0.5 transition-opacity hover:opacity-85"
        >
          <Avatar name={user.name} image={user.avatarUrl} size="sm" />
          <span className="hidden text-[0.8rem] font-medium text-[var(--fg)] sm:block">{user.name.split(" ")[0]}</span>
        </button>
        {open && (
          <div className="absolute right-0 top-full z-30 mt-2 w-52 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-float)]">
            <div className="border-b border-[var(--border)] px-4 py-3">
              <p className="truncate text-sm font-semibold text-[var(--fg)]">{user.name}</p>
              <p className="truncate text-xs text-[var(--muted)]">{user.email}</p>
            </div>
            <div className="p-1.5">
              <Link href="/dashboard/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--fg)] hover:bg-[var(--surface-2)]">
                <Avatar name="-" size="sm" className="!h-4 !w-4 text-[0.5rem]" />
                Profile
              </Link>
              <Link href="/dashboard/settings" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--fg)] hover:bg-[var(--surface-2)]">
                <Icon name="settings" size={14} />
                Settings & billing
              </Link>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10"
              >
                <Icon name="logout" size={14} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { Logo };