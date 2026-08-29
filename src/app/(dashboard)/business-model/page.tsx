import { loadDashboardData } from "@/lib/startup";
import { Card, CardBody, CardHeader, SectionTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Regenerate } from "@/components/shared/regenerate";
import { EmptyState } from "@/components/ui/skeleton";
import { Icon } from "@/components/ui/icon";

export const dynamic = "force-dynamic";

export default async function BusinessModelPage() {
  const { startup, context } = await loadDashboardData();
  const bm = context.businessModel;

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Business model"
        sub="How your startup makes money — and the math that makes the engine turn."
        action={
          <div className="flex gap-2">
            <Regenerate kind="pricing" startupId={startup.id} label="Generate pricing" />
            <Regenerate kind="business-model" startupId={startup.id} confirm="Replace the business model with a fresh generation?" />
          </div>
        }
      />

      {!bm ? (
        <Card>
          <EmptyState
            icon={<Icon name="business-model" size={22} />}
            title="No business model yet"
            description="Generate one to see revenue streams, tiers and unit economics."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader title="Model" />
            <CardBody>
              <p className="text-sm leading-relaxed text-[var(--fg)]">{bm.model}</p>
            </CardBody>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader title="Revenue streams" />
              <CardBody>
                <ul className="space-y-2">
                  {bm.revenueStreams.map((r, i) => (
                    <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-[var(--fg)]">
                      <span className="mt-0.5 text-[var(--color-brand-500)]">✓</span> {r}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Unit economics" />
              <CardBody>
                <p className="text-sm leading-relaxed text-[var(--fg)]">{bm.unitEconomics}</p>
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader title="Pricing tiers" description="The offer stack, as designed" />
            <CardBody>
              <div className="grid gap-3 sm:grid-cols-3">
                {bm.pricingTiers.map((t) => (
                  <div
                    key={t.name}
                    className={`rounded-xl border p-4 ${t.highlighted ? "border-[var(--color-brand-500)]/50 bg-[var(--color-brand-500)]/4" : "border-[var(--border)] bg-[var(--surface)]"}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[var(--fg)]">{t.name}</p>
                      {t.highlighted && <Badge tone="brand">Popular</Badge>}
                    </div>
                    <p className="mt-2 text-xl font-semibold tabular-nums tracking-tight text-[var(--fg)]">
                      {t.price}<span className="text-xs font-normal text-[var(--muted)]">/{t.cadence}</span>
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      {t.features.map((f, i) => (
                        <li key={i} className="flex gap-1.5 text-[0.8125rem] text-[var(--muted)]">
                          <span className="text-emerald-500">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {bm.notes && (
            <Card>
              <CardHeader title="Notes" />
              <CardBody>
                <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--muted)]">{bm.notes}</p>
              </CardBody>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}