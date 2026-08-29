"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { fetcher } from "@/lib/utils";

const MIN = 10;

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < MIN) {
      setError(`Use at least ${MIN} characters.`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetcher<{ ok: boolean; error?: string }>("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        throw new Error(res.error ?? "Could not create your account.");
      }
      toast("Account created. Let's forge your startup.", "success");
      router.push("/onboarding");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Free to start. Five questions stand between you and a startup plan.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {error && (
          <div className="rounded-lg border border-red-600/25 bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}
        <Field label="Full name">
          <Input
            required
            autoComplete="name"
            placeholder="Ada Lovelace"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
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
        <Field label="Password" hint={`At least ${MIN} characters.`}>
          <Input
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Start building
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--muted)]">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[var(--fg)] hover:text-[var(--color-brand-500)]">
          Log in
        </Link>
      </p>
    </div>
  );
}