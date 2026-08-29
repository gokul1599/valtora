import Link from "next/link";
import { loadDashboardData } from "@/lib/startup";
import { Card, CardBody, CardHeader, SectionTitle } from "@/components/ui/card";
import { ScoreRing, StatBar, Progress } from "@/components/ui/progress";
import { Badge, Dot } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { formatCurrency, formatDate, pct } from "@/lib/utils";
import { stageLabel } from "@/lib/ai/engine/helpers";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const { user, startup, context } = await loadDashboardData();
  const profile = context.profile;
  const score = context.assessment?.score;
  const assessment = context.assessment;
  const doneTasks = context.roadmap?.filter((t) => t.status === "done").length ?? 0;
  const doneLaunch = context.launch?.filter((l) => l.status === "done").length ?? 0;
  const roadmapPct = pct(doneTasks, context.roadmap?.length ?? 0);
  const launchPct = pct(doneLaunch, context.launch?.length ?? 0);

  const stats = [
    { label: "Startup score", value: score ? `${score.total}/100` : "—", tone: score && score.total >= 60 ? "success" : score ? (score.total >= 40 ? "warning" : "danger") : "neutral" },
    { label: "Market (TAM)", value: context.market ? formatCurrency(context.market.tam, true) : "—", tone: "brand" },
    { label: "Competitors tracked", value: `${context.competitors?.length ?? 0}`, tone: "neutral" },
    { label: "Roadmap progress", value: `${roadmapPct}%`, tone: roadmapPct >= 50 ? "success" : "neutral" },
    { label: "Launch readiness", value: `${launchPct}%`, tone: launchPct >= 50 ? "success" : "neutral" },
    { label: "Focus features", value: `${context.features?.filter((f) => f.category === "must").length ?? 0} must`, tone: "brand" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[var(--fg)] sm:text-2xl">
            Good to see you, {user.name.split(" ")[0]}.
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            <span className="font-medium text-[var(--fg)]">{startup.name}</span> · {stageLabel(startup.stage)}
            {startup.tagline ? ` — ${startup.tagline}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/cofounder" className="btn btn-primary">
            <Icon name="cofounder" size={15} />
            Talk to co-founder
          </Link>
          <Link href="/dashboard/blueprint" className="btn btn-ghost">
            View blueprint
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader
            title="Startup intelligence"
            description="Transparent 7-axis score"
            action={
              <Badge tone={score?.isEstimate ? "warning" : "success"} dot>
                {score?.isEstimate ? "estimate" : "verified"}
              </Badge>
            }
          />
          <CardBody>
            {score ? (
              <div className="flex items-center gap-6">
                <ScoreRing value={score.total} size={108} />
                <div className="flex-1 space-y-1.5">
                  <p className="text-lg font-semibold tracking-tight">{score.grade}</p>
                  <p className="text-xs text-[var(--muted)]">
                    Generated {formatDate(assessment!.generatedAt)}
                  </p>
                  <div className="pt-1">
                    <StatBar label="Problem" value={score.breakdown.problem} />
                    <StatBar label="Market" value={score.breakdown.market} />
                    <StatBar label="Competition" value={score.breakdown.competition} />
                    <StatBar label="Differentiation" value={score.breakdown.differentiation} />
                    <StatBar label="Monetization" value={score.breakdown.monetization} />
                    <StatBar label="Feasibility" value={score.breakdown.feasibility} />
                    <StatBar label="Growth" value={score.breakdown.growth} />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)]">No score yet.</p>
            )}
          </CardBody>
        </Card>

        <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader title="Snapshot" description="Where your startup stands today" />
            <CardBody className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {stats.slice(0, 4).map((s) => (
                  <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
                    <p className="text-xs text-[var(--muted)]">{s.label}</p>
                    <p className="mt-1 text-lg font-semibold tabular-nums tracking-tight text-[var(--fg)]">
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-[var(--muted)]">
                    <span>Roadmap</span>
                    <span className="font-semibold text-[var(--fg)]">{roadmapPct}%</span>
                  </div>
                  <Progress value={roadmapPct} tone={roadmapPct >= 50 ? "success" : "brand"} />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-[var(--muted)]">
                    <span>Launch</span>
                    <span className="font-semibold text-[var(--fg)]">{launchPct}%</span>
                  </div>
                  <Progress value={launchPct} tone={launchPct >= 50 ? "success" : "brand"} />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Project briefing" description="The seed of your startup record" />
            <CardBody className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Idea</p>
                <p className="mt-0.5 leading-relaxed text-[var(--fg)]">{profile.idea}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">For</p>
                <p className="mt-0.5 leading-relaxed text-[var(--fg)]">{profile.audience}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Money</p>
                <p className="mt-0.5 leading-relaxed text-[var(--fg)]">{profile.monetization}</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Next actions"
            description="The engine's recommended first moves"
            action={
              <Link href="/dashboard/cofounder" className="text-xs font-medium text-[var(--color-brand-500)] hover:underline">
                Ask the co-founder →
              </Link>
            }
          />
          <CardBody>
            <ol className="space-y-2.5">
              {(assessment?.nextActions ?? []).slice(0, 5).map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-500)]/10 text-xs font-semibold text-[var(--color-brand-500)]">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-[var(--fg)]">{a}</span>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Risk radar" description="Weaknesses & risks to own early" />
          <CardBody>
            {assessment ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-danger)]">
                    <Dot tone="danger" /> Weaknesses
                  </p>
                  <ul className="space-y-1.5 text-sm leading-relaxed text-[var(--muted)]">
                    {assessment.weaknesses.slice(0, 3).map((w, i) => (
                      <li key={i}>— {w}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    <Dot tone="warning" /> Risks
                  </p>
                  <ul className="space-y-1.5 text-sm leading-relaxed text-[var(--muted)]">
                    {assessment.risks.slice(0, 3).map((r, i) => (
                      <li key={i}>— {r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)]">No assessment yet.</p>
            )}
          </CardBody>
        </Card>
      </div>

      <SectionTitle
        title="Workspace"
        sub="Everything your co-founder has already written"
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/dashboard/blueprint", icon: "blueprint" as const, label: "Blueprint", meta: `${context.blueprintVersion ? `v${context.blueprintVersion}` : "—"} · 16 sections` },
          { href: "/dashboard/market", icon: "market" as const, label: "Market", meta: context.market ? `TAM ${formatCurrency(context.market.tam, true)}` : "Not generated" },
          { href: "/dashboard/competitors", icon: "competitors" as const, label: "Competitors", meta: `${context.competitors?.length ?? 0} tracked` },
          { href: "/dashboard/customers", icon: "customers" as const, label: "Customers", meta: `${context.personas?.length ?? 0} personas` },
          { href: "/dashboard/product", icon: "product" as const, label: "Product", meta: `${context.features?.length ?? 0} features` },
          { href: "/dashboard/mvp", icon: "mvp" as const, label: "MVP", meta: context.mvpRecord ? context.mvpRecord.coreFeatures.length + " core features" : "Not generated" },
          { href: "/dashboard/technology", icon: "technology" as const, label: "Technology", meta: context.technical ? "Plan ready" : "Not generated" },
          { href: "/dashboard/roadmap", icon: "roadmap" as const, label: "Roadmap", meta: `${context.roadmap?.length ?? 0} tasks · ${roadmapPct}%` },
          { href: "/dashboard/marketing", icon: "marketing" as const, label: "Marketing", meta: context.marketing ? "Plan ready" : "Not generated" },
          { href: "/dashboard/launch", icon: "launch" as const, label: "Launch", meta: `${context.launch?.length ?? 0} items · ${launchPct}%` },
          { href: "/dashboard/business-model", icon: "business-model" as const, label: "Business model", meta: context.businessModel ? context.businessModel.model : "Not generated" },
          { href: "/dashboard/cofounder", icon: "cofounder" as const, label: "AI Co-Founder", meta: "Ask anything" },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-colors hover:border-[var(--color-brand-500)]/40 hover:bg-[var(--surface)]"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--fg)]">
              <Icon name={c.icon} size={15} className="text-[var(--color-brand-500)]" />
              {c.label}
            </div>
            <p className="mt-1.5 text-xs text-[var(--muted)]">{c.meta}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}