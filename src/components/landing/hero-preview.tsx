"use client";

import { useEffect, useState } from "react";
import { ScoreRing } from "@/components/ui/progress";
import { Icon } from "@/components/ui/icon";

const TABS = [
  ["Overview", "5"],
  ["Blueprint", "16"],
  ["MVP", "3"],
];

const STEPS = [
  { label: "Idea captured", detail: "Problem → audience → monetization" },
  { label: "Blueprint generated", detail: "16 founder-ready sections" },
  { label: "Score computed", detail: "Transparent 7-axis model" },
  { label: "Roadmap scheduled", detail: "Validation → build → launch" },
];

export function HeroPreview() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(52);
  const { verify } = { verify: 64 };

  useEffect(() => {
    const iv = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
      setScore((s) => Math.min(100, s + 9 + Math.floor(Math.random() * 10)));
    }, 2600);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--color-brand-500)_14%,transparent),transparent_60%)]" />

      <div className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-float)]">
        {/* Window chrome */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--surface-2)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--surface-2)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--surface-2)]" />
          </div>
          <span className="text-[0.7rem] font-medium text-[var(--muted)]">app.forgeai.dev/overview</span>
          <span className="flex items-center gap-1 rounded-full bg-[var(--color-success)]/10 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-current" /> LIVE
          </span>
        </div>

        <div className="grid sm:grid-cols-[7rem_1fr]">
          {/* Mini sidebar */}
          <aside className="hidden flex-col gap-0.5 border-r border-[var(--border)] bg-[var(--surface)] p-2 sm:flex">
            {TABS.map(([label, n]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-[0.68rem] font-medium"
              >
                <span className="text-[var(--muted)]">{label}</span>
                <span className="text-[var(--muted)]/60">{n}</span>
              </div>
            ))}
            <div className="mt-auto rounded-md bg-[var(--card)] px-2 py-1.5 text-[0.68rem] font-semibold text-[var(--color-brand-600)] dark:text-[var(--color-brand-300)]">
              AI Co-Founder
            </div>
          </aside>

          {/* Content */}
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[0.7rem] font-medium uppercase tracking-wider text-[var(--muted)]">
                  {STEPS[step].label}
                </p>
                <h3 className="mt-1 text-sm font-semibold text-[var(--fg)]">
                  {STEPS[step].detail}
                </h3>
              </div>
              <ScoreRing value={score} size={54} />
            </div>

            {/* Progress stepper */}
            <div className="mt-5 space-y-2">
              {STEPS.map((s, i) => (
                <div key={s.label} className="flex items-center gap-2.5 text-[0.72rem]">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      i <= step
                        ? "border-[var(--color-brand-500)] bg-[var(--color-brand-500)] text-white"
                        : "border-[var(--border)] text-[var(--muted)]"
                    }`}
                  >
                    {i < step ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className={i <= step ? "font-medium text-[var(--fg)]" : "text-[var(--muted)]"}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Dummy shared insight */}
            <div className="mt-5 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
              <div className="flex items-center justify-between">
                <span className="text-[0.7rem] font-semibold text-[var(--fg)]">Startup intelligence</span>
                <span className="rounded-full bg-[var(--color-ai-500)]/10 px-1.5 py-0.5 text-[0.62rem] font-semibold text-[var(--color-ai-500)]">
                  ESTIMATE
                </span>
              </div>
              <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                {["TAM", "SAM", "SOM"].map((k, i) => (
                  <div key={k} className="rounded-md border border-[var(--border)] bg-[var(--card)] px-2 py-1.5">
                    <p className="text-[0.6rem] uppercase text-[var(--muted)]">{k}</p>
                    <p className="text-[0.8rem] font-semibold tabular-nums text-[var(--fg)]">
                      {["$5.2T", "$340M", "$42M"][i]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingChip className="-left-2 top-24 sm:-left-10" icon="check" text="Blueprint ready" />
      <FloatingChip className="-right-2 top-40 sm:-right-8" icon="spark" text="5 next actions" />
    </div>
  );
}

function FloatingChip({
  className,
  icon,
  text,
}: {
  className?: string;
  icon: "check" | "spark";
  text: string;
}) {
  return (
    <div className={`absolute hidden items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 shadow-[var(--shadow-pop)] sm:flex ${className ?? ""}`}>
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-success)]/12 text-emerald-500">
        <Icon name={icon} size={11} />
      </span>
      <span className="text-[0.7rem] font-medium text-[var(--fg)]">{text}</span>
    </div>
  );
}