"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LayoutGrid,
  FileText,
  TrendingUp,
  Swords,
  Users,
  Store,
  Package,
  Rocket,
  Cpu,
  Map,
  Megaphone,
  Send,
  Sparkles,
  Settings,
  UserCircle,
  Menu,
  X,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AI_NAME } from "@/lib/constants";

const primaryNav = [
  { href: "/start", label: "Overview", icon: LayoutGrid },
  { href: "/blueprint", label: "Blueprint", icon: FileText },
  { href: "/market", label: "Market", icon: TrendingUp },
  { href: "/competitors", label: "Competitors", icon: Swords },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/business-model", label: "Business Model", icon: Store },
  { href: "/product", label: "Product", icon: Package },
  { href: "/mvp", label: "MVP", icon: Rocket },
  { href: "/technology", label: "Technology", icon: Cpu },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/marketing", label: "Marketing", icon: Megaphone },
  { href: "/launch", label: "Launch", icon: Send },
];

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

function NavLink({ item, isCollapsed }: { item: NavItem; isCollapsed: boolean }) {
  const pathname = usePathname();
  const active = pathname === item.href;
  return (
    <Link
      href={item.href}
      title={isCollapsed ? item.label : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--fg)]"
          : "text-[var(--fg-secondary)] hover:bg-[var(--border-soft)] hover:text-[var(--fg)]",
        isCollapsed && "justify-center px-2",
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--accent)]" />
      )}
      <item.icon className="size-4 shrink-0" />
      {!isCollapsed && <span>{item.label}</span>}
    </Link>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setCollapsed((c) => !c);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-[var(--border-soft)] bg-[var(--surface)] transition-all duration-200 md:flex",
          collapsed ? "w-16" : "w-60",
        )}
      >
        <div className={cn("flex h-16 items-center border-b border-[var(--border-soft)]", collapsed ? "justify-center" : "px-5")}>
          <Link href="/start" className={cn("text-lg font-bold tracking-tight text-[var(--fg)]", collapsed && "text-base")}>
            {collapsed ? "V" : "VALTORA"}
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {primaryNav.map((item) => (
            <NavLink key={item.href} item={item} isCollapsed={collapsed} />
          ))}

          <div className={cn("flex items-center gap-3 pt-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]", collapsed && "justify-center pt-6")}>
            <Sparkles className="size-3.5" />
            {!collapsed && <span>AI Co-Founder</span>}
          </div>

          <Link
            href="/cofounder"
            title={collapsed ? "AI Co-Founder" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/cofounder"
                ? "bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--fg)]"
                : "text-[var(--fg-secondary)] hover:bg-[var(--border-soft)] hover:text-[var(--fg)]",
              collapsed && "justify-center px-2",
            )}
          >
            {pathname === "/cofounder" && (
              <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--accent)]" />
            )}
            <Sparkles className="size-4 shrink-0" />
            {!collapsed && <span>{AI_NAME} AI</span>}
          </Link>
        </nav>

        <div className="border-t border-[var(--border-soft)] p-3">
          {!collapsed ? (
            <div className="space-y-1">
              <NavLink item={{ href: "/settings", label: "Settings", icon: Settings }} isCollapsed={false} />
              <NavLink item={{ href: "/profile", label: "Profile", icon: UserCircle }} isCollapsed={false} />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Link href="/settings" title="Settings" className="rounded-lg p-2 text-[var(--fg-secondary)] hover:text-[var(--fg)] hover:bg-[var(--border-soft)]">
                <Settings className="size-4" />
              </Link>
              <Link href="/profile" title="Profile" className="rounded-lg p-2 text-[var(--fg-secondary)] hover:text-[var(--fg)] hover:bg-[var(--border-soft)]">
                <UserCircle className="size-4" />
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[var(--border-soft)] bg-[var(--bg)]/90 px-4 backdrop-blur md:hidden">
        <Link href="/start" className="text-lg font-bold tracking-tight text-[var(--fg)]">
          VALTORA
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="rounded-lg p-2 text-[var(--fg-secondary)] hover:bg-[var(--border-soft)]"
            title="Toggle navigation"
          >
            <Command className="size-4" />
          </button>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-lg p-2 text-[var(--fg-secondary)] hover:bg-[var(--border-soft)]"
            aria-label="Open navigation"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 overflow-y-auto border-r border-[var(--border-soft)] bg-[var(--surface)] px-3 py-4">
            <div className="mb-4 flex items-center justify-between px-2">
              <span className="text-lg font-bold tracking-tight text-[var(--fg)]">VALTORA</span>
              <button onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-[var(--fg-secondary)]" aria-label="Close navigation">
                <X className="size-5" />
              </button>
            </div>
            <div className="space-y-1">
              {primaryNav.map((item) => (
                <NavLink key={item.href} item={item} isCollapsed={false} />
              ))}
              <div className="flex items-center gap-3 px-3 pt-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
                <Sparkles className="size-3.5" />
                <span>AI Co-Founder</span>
              </div>
              <Link
                href="/cofounder"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === "/cofounder"
                    ? "bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--fg)]"
                    : "text-[var(--fg-secondary)] hover:bg-[var(--border-soft)] hover:text-[var(--fg)]",
                )}
              >
                <Sparkles className="size-4" />
                <span>{AI_NAME} AI</span>
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}