"use client";

import * as React from "react";
import { createContext, useContext, useState, useCallback } from "react";

type ToastTone = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  toast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, tone: ToastTone = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-80 flex-col gap-2"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-4 py-3 text-sm shadow-lg animate-fade-up"
          >
            <span
              className="mt-1.5 size-1.5 shrink-0 rounded-full"
              style={{
                backgroundColor:
                  t.tone === "success"
                    ? "var(--success)"
                    : t.tone === "error"
                      ? "var(--danger)"
                      : "var(--accent)",
              }}
            />
            <p className="text-[var(--fg)]">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}