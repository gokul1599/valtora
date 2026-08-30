"use client";

import type { StartupContext } from "@/lib/startup";
import { STAGE_LABELS } from "@/lib/constants";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Target, AlertTriangle, ArrowRight, Gauge } from "lucide-react";
import Link from "next/link";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function Dashboard({ ctx }: { ctx: StartupContext }) {
  const startup = ctx.startup;
  if (!startup) return null;

  const sections = ctx.sections;
  const mvp = (sections.mvp ?? {}) as Record<string, unknown>;
  const vision = (sections.vision ?? {}) as Record<string, unknown>;
  const risk = (sections.risks ?? []) as Array<Record<string, unknown>>;

  const nextActions = (sections.nextActions ?? []) as string[];
  const score = startup.score;

  const scoreTone =
    score >= 75 ? "success" : score >= 50 ? "accent" : score >= 30 ? "warning" : "danger";

  const totalFeatures = Array.isArray((sections.product as Record<string, unknown>)?.featureList)
    ? ((sections.product as Record<string, unknown>).featureList as unknown[]).length
    : 0;

  const insights: Array<{ text: string; tone: "default" | "warning" | "accent" }> = [];
  if (totalFeatures > 8) {
    insights.push({
      text: `Your MVP plan lists ${totalFeatures} features. Zorvyn recommends focusing on the essential core to validate faster.`,
      tone: "warning",
    });
  }
  if (risk.length > 0) {
    const top = risk[0] as Record<string, unknown>;
    insights.push({
      text: `Top identified risk: ${String(top.risk ?? "unknown")} (${String(top.severity ?? "medium")} severity).`,
      tone: "warning",
    });
  }
  if (mvp && Array.isArray(mvp.coreFeatures) && (mvp.coreFeatures as string[]).length >= 2) {
    insights.push({
      text: `MVP program focuses on ${(mvp.coreFeatures as string[]).length} core capabilities. Keep scope tight and ship.`,
      tone: "accent",
    });
  }
  if (insights.length === 0) {
    insights.push({
      text: "Complete the Blueprint to unlock deeper AI insights from Zorvyn.",
      tone: "accent",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">{greeting()}</h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Here is what needs your attention for <span className="font-medium text-[var(--fg)]">{startup.name}</span>.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Startup Score */}
        <Card>
          <CardHeader title="Startup Score" sub="Transparent, data-driven health index" />
          <CardBody>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-bold tracking-tight text-[var(--fg)]">{score}</span>
              <span className="pb-1.5 text-sm text-[var(--fg-muted)]">/ 100</span>
            </div>
            <Progress value={score} tone={scoreTone} className="mt-4" />
            <p className="mt-3 text-xs leading-relaxed text-[var(--fg-muted)]">
              Weighted across problem strength, market, customers, differentiation, monetization, product, and execution.
            </p>
          </CardBody>
        </Card>

        {/* Current Stage */}
        <Card>
          <CardHeader title="Current Stage" sub={startup.name} />
          <CardBody>
            <div className="flex items-center gap-2">
              <Badge tone="accent">
                <Target className="size-3" />
                {STAGE_LABELS[startup.stage] ?? startup.stage}
              </Badge>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[var(--fg-muted)]">
              {typeof vision.summary === "string" && vision.summary
                ? String(vision.summary)
                : "Define where you are and where you are headed next in the Blueprint."}
            </p>
          </CardBody>
        </Card>

        {/* Next Best Action */}
        <Card>
          <CardHeader title="Next Best Action" sub="Highest-value step identified by Zorvyn" />
          <CardBody>
            {nextActions.length > 0 ? (
              <>
                <p className="text-sm font-medium leading-relaxed text-[var(--fg)]">
                  {String(nextActions[0])}
                </p>
                <Link
                  href="/cofounder"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] hover:underline"
                >
                  Ask Zorvyn to create an action plan
                  <ArrowRight className="size-3" />
                </Link>
              </>
            ) : (
              <p className="text-sm leading-relaxed text-[var(--fg-muted)]">
                Generate your Blueprint to get prioritized next actions.
              </p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader
          title="AI Insights"
          sub="Based on your startup data — not generic advice"
          action={
            <Badge tone="accent">
              <Sparkles className="size-3" />
              Zorvyn AI
            </Badge>
          }
        />
        <CardBody>
          <div className="grid gap-3 md:grid-cols-3">
            {insights.map((insight, i) => (
              <div
                key={i}
                className="rounded-lg border border-[var(--border-soft)] bg-[var(--elevated)] p-4"
              >
                <div className="flex items-start gap-2">
                  {insight.tone === "warning" ? (
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" />
                  ) : (
                    <Gauge className="mt-0.5 size-4 shrink-0 text-[var(--accent)]" />
                  )}
                  <p className="text-xs leading-relaxed text-[var(--fg-secondary)]">{insight.text}</p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}