"use client";

import Link from "next/link";
import { useState } from "react";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { fetcher } from "@/lib/utils";

export function ForgotForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetcher<{ ok: boolean; error?: string; resetUrl?: string }>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        throw new Error(res.error ?? "Something went wrong.");
      }
      setDone(true);
      setResetUrl(res.resetUrl ?? null);
      toast("Check your inbox (and the dev reset link below).", "success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Enter the email you signed up with and we&apos;ll send you a reset link.
      </p>

      {done ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-emerald-600/25 bg-emerald-50 px-3 py-3 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
            If an account exists for that email, a reset link is on its way.
          </div>
          {resetUrl && (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-3 text-sm">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                Dev mode — instant link
              </p>
              <a href={resetUrl} className="break-all text-[var(--color-brand-500)] hover:underline">
                {resetUrl}
              </a>
            </div>
          )}
          <Link
            href="/login"
            className="block text-center text-sm text-[var(--muted)] hover:text-[var(--fg)]"
          >
            ← Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-600/25 bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              {error}
            </div>
          )}
          <Field label="Email">
            <Input
              type="email"
              required
              autoComplete="email"
              placeholder="you@startup.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Send reset link
          </Button>
        </form>
      )}
    </div>
  );
}