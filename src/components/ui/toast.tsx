"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./button";

type ToastTone = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

const ToastContext = createContext<{
  toast: (message: string, tone?: ToastTone) => void;
}>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const icons: Record<ToastTone, ReactNode> = {
  success: <CheckIcon />,
  error: <XIcon />,
  info: <InfoIcon />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, tone: ToastTone = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex animate-[var(--animate-slide-up)] items-start gap-2.5 rounded-xl border px-4 py-3 text-sm shadow-[var(--shadow-pop)]",
              t.tone === "success" && "border-emerald-600/25 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
              t.tone === "error" && "border-red-600/25 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-200",
              t.tone === "info" && "border-[var(--border)] bg-[var(--card)] text-[var(--fg)]"
            )}
          >
            <span className="mt-0.5 shrink-0">{icons[t.tone]}</span>
            <span className="leading-snug">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function LoadingOverlay({ label = "Working…" }: { label?: string }) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-[var(--card)]/70 backdrop-blur-sm">
      <div className="flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm shadow-[var(--shadow-pop)]">
        <Spinner className="h-4 w-4 text-[var(--color-brand-500)]" />
        <span className="text-[var(--muted)]">{label}</span>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg className="h-4 w-4 text-[var(--color-brand-500)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
    </svg>
  );
}