import { loadDashboardData } from "@/lib/startup";
import { Card, CardBody, CardHeader, SectionTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Regenerate } from "@/components/shared/regenerate";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MarketPage() {
  const { startup, context } = await loadDashboardData();
  const market = context.market;

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Market"
        sub="Total addressable, serviceable and obtainable opportunity — every number is labeled for what it is."
        action={<Regenerate kind="market" startupId={startup.id} />}
      />

      {!market ? (
        <Card>
          <CardBody className="py-10 text-center text-sm text-[var(--muted)]">
            No market snapshot yet. Regenerate to build one.
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "TAM", v: market.tam, note: market.tamNote },
              { label: "SAM", v: market.sam, note: market.samNote },
              { label: "SOM", v: market.som, note: market.somNote },
            ].map((m) => (
              <Card key={m.label}>
                <CardHeader
                  title={`${m.label} — Total (${m.label === "TAM" ? "all of it" : m.label === "SAM" ? "reachable" : "ownable"})`}
                  action={
                    <Badge tone={market.verified ? "success" : "warning"} dot>
                      {market.verified ? "verified" : "estimate"}
                    </Badge>
                  }
                />
                <CardBody>
                  <p className="text-3xl font-semibold tabular-nums tracking-tight text-[var(--fg)]">
                    {formatCurrency(m.v, true)}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{m.note}</p>
                </CardBody>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader title="How this was estimated" description={market.estimationMethod} />
            <CardBody>
              <p className="text-sm text-[var(--muted)]">
                Growth story: {market.growthRate}. Before pitching these numbers anywhere,
                triangulate with bottom-up counting (paying customers × price) to move them from estimates to verified.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Trends shaping this space" description="Signals worth folding into your plan" />
            <CardBody>
              <ul className="space-y-2">
                {market.trends.map((t, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-[var(--fg)]">
                    <Badge tone="brand">{i + 1}</Badge>
                    {t}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}