"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { fetcher } from "@/lib/utils";

function ResetFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetcher<{ ok: boolean; error?: string }>("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password, confirm }),
      });
      if (!res.ok) {
        throw new Error(res.error ?? "Could not reset your password.");
      }
      toast("Password updated. You'll be redirected.", "success");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset your password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Choose a new password</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Enter a replacement password for your account.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {error && (
          <div className="rounded-lg border border-red-600/25 bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}
        <Field label="New password" hint="At least 10 characters.">
          <Input
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field label="Confirm password">
          <Input
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Field>
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Update password
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--muted)]">
        <Link href="/login" className="hover:text-[var(--fg)]">
          ← Back to login
        </Link>
      </p>
    </div>
  );
}

export function ResetForm() {
  return (
    <Suspense fallback={null}>
      <ResetFormInner />
    </Suspense>
  );
}