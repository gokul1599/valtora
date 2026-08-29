"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, Textarea } from "@/components/ui/input";
import { Button, Spinner } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Wordmark } from "@/components/ui/logo";
import { fetcher } from "@/lib/utils";

const JOURNEY_OPTIONS = [
  { value: "just-idea", label: "Just an idea", hint: "Nothing built yet" },
  { value: "researching", label: "Researching", hint: "Reading, interviewing, scoping" },
  { value: "building-mvp", label: "Building MVP", hint: "Some code or a prototype" },
  { value: "have-mvp", label: "Have an MVP", hint: "A working product exists" },
  { value: "have-customers", label: "Have customers", hint: "Some people use it" },
  { value: "growing", label: "Growing", hint: "Scaling what works" },
];

const STEPS = ["The idea", "The people", "The problem", "The money", "Checkpoint"];

export function OnboardingFlow() {
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    idea: "",
    audience: "",
    problem: "",
    monetization: "",
    journeyStage: "just-idea" as string,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  function canContinue(): boolean {
    if (loading) return false;
    switch (step) {
      case 0: return form.idea.trim().length >= 10;
      case 1: return form.audience.trim().length >= 2;
      case 2: return form.problem.trim().length >= 10;
      case 3: return form.monetization.trim().length >= 2;
      case 4: return true;
      default: return true;
    }
  }

  async function submit() {
    setError("");
    setLoading(true);
    try {
      const res = await fetcher<{ ok: boolean; error?: string }>("/api/onboarding", {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        throw new Error(res.error ?? "Could not forge your startup.");
      }
      toast("Startup forged. Taking you to your workspace.", "success");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_0%,color-mix(in_oklab,var(--color-brand-500)_7%,transparent),transparent)]" />
      <div className="relative flex w-full max-w-xl flex-col">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" aria-label="ForgeAI home">
            <Wordmark />
          </Link>
          <span className="text-xs text-[var(--muted)]">
            {step + 1} / {STEPS.length}
          </span>
        </div>

        <div className="mb-8 flex gap-1.5">
          {STEPS.map((s, i) => (
            <div
              key={s}
              title={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i === step ? "bg-[var(--color-brand-500)]" : i < step ? "bg-[var(--color-success)]" : "bg-[var(--border)]"
              }`}
            />
          ))}
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)] sm:p-8">
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-12">
              <Spinner className="h-6 w-6 text-[var(--color-brand-500)]" />
              <div className="text-center">
                <p className="text-sm font-medium">Forging your startup…</p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Blueprint, market snapshot, competitors and roadmap — this takes a few seconds.
                </p>
              </div>
            </div>
          ) : (
            <StepBody step={step} form={form} set={set} />
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || loading}
            className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--fg)] disabled:opacity-40"
          >
            ← Back
          </button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canContinue()}>
              Continue
            </Button>
          ) : (
            <Button onClick={submit} disabled={!canContinue()}>
              Forge my startup
            </Button>
          )}
        </div>

        {error && (
          <div className="mt-5 rounded-lg border border-red-600/25 bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

function StepBody({
  step,
  form,
  set,
}: {
  step: number;
  form: { idea: string; audience: string; problem: string; monetization: string; journeyStage: string };
  set: (k: keyof typeof form) => (v: string) => void;
}) {
  switch (step) {
    case 0:
      return (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">What are you building?</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Plain words are perfect. This becomes the seed of your startup record.
          </p>
          <div className="mt-5">
            <Field label="Your idea" hint="e.g. A tool that helps small restaurants automate refund management.">
              <Textarea
                value={form.idea}
                onChange={(e) => set("idea")(e.target.value)}
                placeholder="A tool that…"
                rows={4}
              />
            </Field>
          </div>
        </div>
      );
    case 1:
      return (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Who is it for?</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            The narrower, the sharper. Name the segment that feels this pain most.
          </p>
          <div className="mt-5">
            <Field label="Target audience" hint="e.g. Independent restaurants with 10–40 staff and no finance team.">
              <Textarea
                value={form.audience}
                onChange={(e) => set("audience")(e.target.value)}
                placeholder="Independent restaurants…"
                rows={3}
              />
            </Field>
          </div>
        </div>
      );
    case 2:
      return (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">What problem does it solve?</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Describe the pain or job. What happens today that shouldn&apos;t?
          </p>
          <div className="mt-5">
            <Field label="The problem" hint="e.g. Refund disputes consume a manager's evenings and eat margin silently.">
              <Textarea
                value={form.problem}
                onChange={(e) => set("problem")(e.target.value)}
                placeholder="Today…"
                rows={4}
              />
            </Field>
          </div>
        </div>
      );
    case 3:
      return (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">How will it make money?</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Subscription, fees, commission — a rough answer is fine.
          </p>
          <div className="mt-5">
            <Field label="Monetization" hint="e.g. Monthly subscription starting at $49 per restaurant.">
              <Textarea
                value={form.monetization}
                onChange={(e) => set("monetization")(e.target.value)}
                placeholder="Monthly subscription…"
                rows={3}
              />
            </Field>
          </div>
        </div>
      );
    case 4:
      return (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Where are you on the journey?</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            ForgeAI shapes your plan around your actual stage.
          </p>
          <div className="mt-5 space-y-2">
            {JOURNEY_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => set("journeyStage")(o.value)}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                  form.journeyStage === o.value
                    ? "border-[var(--color-brand-500)] bg-[var(--color-brand-500)]/5"
                    : "border-[var(--border)] bg-[var(--surface)]"
                }`}
              >
                <span className="text-sm font-medium">{o.label}</span>
                <span className="text-xs text-[var(--muted)]">{o.hint}</span>
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Ready to forge</p>
            <p className="text-[var(--fg)]">{form.idea.slice(0, 120) || "Your idea"}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              for {form.audience.slice(0, 90) || "your audience"}
            </p>
          </div>
        </div>
      );
    default:
      return null;
  }
}