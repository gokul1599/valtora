import { loadDashboardData } from "@/lib/startup";
import { Card, CardBody, SectionTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/skeleton";
import { Icon } from "@/components/ui/icon";
import { Regenerate } from "@/components/shared/regenerate";
import { CompetitorCard } from "@/components/dashboard/competitor-card";

export const dynamic = "force-dynamic";

export default async function CompetitorsPage() {
  const { startup, context } = await loadDashboardData();
  const competitors = context.competitors ?? [];

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Competitors"
        sub="A live matrix of the field you're entering, and the gap you drive into."
        action={<Regenerate kind="competitors" startupId={startup.id} confirm="Replace the tracked field with a fresh scan?" />}
      />

      {competitors.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Icon name="competitors" size={22} />}
            title="No competitors tracked yet"
            description="Regenerate to scan the field, or add competitors manually."
          />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {competitors.map((c) => <CompetitorCard key={c.id} c={c} />)}
        </div>
      )}

      <Card>
        <CardBody className="text-xs leading-relaxed text-[var(--muted)]">
          Generalized options are marked as estimates until you verify them with real research — pricing pages,
          interviews and your own hands-on trials. Verification is a deliberate step, not a dashboard lie.
        </CardBody>
      </Card>
    </div>
  );
}