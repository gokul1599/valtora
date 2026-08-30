"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { STAGES } from "@/lib/constants";

const steps = [
  { key: "name", title: "Name your startup", subtitle: "Give your company a working name — you can change it later." },
  { key: "idea", title: "What are you building?", subtitle: "Describe your idea simply. VALTORA will turn this into a startup." },
  { key: "audience", title: "Who is it for?", subtitle: "Who is your primary user or customer?" },
  { key: "problem", title: "What problem does it solve?", subtitle: "What pain does your customer feel today?" },
  { key: "monetization", title: "How will it make money?", subtitle: "A hypothesis is enough — you will validate it later." },
  { key: "stage", title: "What stage are you in?", subtitle: "Be honest. It shapes the advice Zorvyn gives." },
  { key: "goal", title: "What do you want in 90 days?", subtitle: "One concrete outcome you want to reach." },
] as const;

export function OnboardingFlow({
  email,
  existingId,
  existingName,
}: {
  email: string;
  existingId: string | null;
  existingName: string | null;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: existingName ?? "",
    idea: "",
    audience: "",
    problem: "",
    monetization: "",
    stage: "idea",
    goal: "",
  });
  const [phase, setPhase] = useState<"form" | "generating" | "error">("form");
  const [error, setError] = useState<string | null>(null);

  const current = steps[step];

  function update(key: keyof typeof data, value: string) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function generate() {
    setPhase("generating");
    setError(null);
    try {
      const startupRes = await fetch("/api/startup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, email, startupId: existingId ?? undefined }),
      });
      const startupBody = await startupRes.json();
      if (!startupRes.ok) throw new Error(startupBody.error ?? "Could not create startup");
      const startupId = startupBody.startup.id;

      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "blueprint", startupId, ...data }),
      });
      const genBody = await genRes.json();
      if (!genRes.ok) throw new Error(genBody.error ?? "Zorvyn could not generate the blueprint");

      router.push("/blueprint");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPhase("error");
    }
  }

  function canContinue(): boolean {
    const s = data[steps[step].key];
    const min = { name: 2, idea: 20, audience: 3, problem: 10, monetization: 3, stage: 1, goal: 10 }[steps[step].key];
    return s.trim().length >= (min ?? 1);
  }

  if (phase === "generating") {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="relative mb-8 flex size-14 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-[color-mix(in_srgb,var(--accent)_25%,transparent)]" />
          <span className="relative flex size-14 items-center justify-center rounded-full bg-[var(--accent)]">
            <Sparkles className="size-6 text-[var(--accent-fg)]" />
          </span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-[var(--fg)]">
          Zorvyn is building your startup
        </h1>
        <p className="mt-2 max-w-sm text-sm text-[var(--fg-muted)]">
          Analyzing your idea, market, customers, business model, and roadmap. This takes up to 60 seconds.
        </p>
        <div className="mt-8 flex w-64 flex-col gap-1.5" aria-hidden>
          {["Analyzing idea", "Mapping the market", "Designing the product", "Planning the roadmap"].map((s, i) => (
            <div key={s} className="flex items-center gap-2 text-xs text-[var(--fg-muted)]">
              <span
                className={cn("size-1.5 rounded-full", "animate-pulse")}
                style={{ backgroundColor: i === 0 ? "var(--accent)" : i === 1 ? "var(--accent-soft)" : i === 2 ? "var(--fg-muted)" : "var(--fg-muted)" }}
              />
              {s}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center">
        <h1 className="text-lg font-semibold text-[var(--fg)]">We couldn&apos;t complete this.</h1>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">{error ?? "Your startup data is safe."}</p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={() => setPhase("form")}>
            Back to form
          </Button>
          <Button onClick={generate}>Try again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col py-10">
      {/* Progress */}
      <div className="mb-10 flex items-center gap-1.5" aria-label={`Step ${step + 1} of ${steps.length}`}>
        {steps.map((_, i) => (
          <div
            key={i}
            className={cn("h-1 flex-1 rounded-full transition-colors", i <= step ? "bg-[var(--accent)]" : "bg-[var(--border-soft)]")}
          />
        ))}
      </div>

      <span className="text-xs font-medium uppercase tracking-wider text-[var(--fg-muted)]">
        Step {step + 1} of {steps.length}
      </span>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--fg)]">{current.title}</h1>
      <p className="mt-1 text-sm text-[var(--fg-muted)]">{current.subtitle}</p>

      <div className="mt-8">
        {current.key === "name" && (
          <Input value={data.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. ForgeFlow" autoFocus />
        )}

        {current.key === "idea" && (
          <Textarea
            value={data.idea}
            onChange={(e) => update("idea", e.target.value)}
            placeholder="I want to build an AI platform that helps small manufacturers predict machine failures..."
            rows={5}
            autoFocus
          />
        )}

        {current.key === "audience" && (
          <Textarea
            value={data.audience}
            onChange={(e) => update("audience", e.target.value)}
            placeholder="Small manufacturers with 20–100 employees who can't afford predictive maintenance teams."
            rows={4}
            autoFocus
          />
        )}

        {current.key === "problem" && (
          <Textarea
            value={data.problem}
            onChange={(e) => update("problem", e.target.value)}
            placeholder="Unexpected machine downtime costs them thousands daily, and they lack the data science talent to fix it."
            rows={4}
            autoFocus
          />
        )}

        {current.key === "monetization" && (
          <Textarea
            value={data.monetization}
            onChange={(e) => update("monetization", e.target.value)}
            placeholder="Monthly SaaS subscription tiers plus a one-time setup fee."
            rows={3}
            autoFocus
          />
        )}

        {current.key === "stage" && (
          <Select value={data.stage} onChange={(e) => update("stage", e.target.value)}>
            {STAGES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </Select>
        )}

        {current.key === "goal" && (
          <Textarea
            value={data.goal}
            onChange={(e) => update("goal", e.target.value)}
            placeholder="Sign 10 paying customers and have an MVP running with 5 pilot manufacturers."
            rows={4}
            autoFocus
          />
        )}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          <ArrowLeft className="size-4" /> Back
        </Button>
        {step < steps.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canContinue()}>
            Continue <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button onClick={generate}>
            <Sparkles className="size-4" /> Build my startup
          </Button>
        )}
      </div>
    </div>
  );
}