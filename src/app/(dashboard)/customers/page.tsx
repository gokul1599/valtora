import { loadDashboardData } from "@/lib/startup";
import { Card, SectionTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/skeleton";
import { Icon } from "@/components/ui/icon";
import { Regenerate } from "@/components/shared/regenerate";
import { PersonaCard } from "@/components/dashboard/persona-card";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const { startup, context } = await loadDashboardData();
  const personas = context.personas ?? [];

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Customers"
        sub="The people your startup exists for — who they are, what hurts, where they congregate."
        action={<Regenerate kind="personas" startupId={startup.id} confirm="Replace personas with a fresh reading?" />}
      />

      {personas.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Icon name="customers" size={22} />}
            title="No personas yet"
            description="Regenerate to sketch who you're serving first."
          />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {personas.map((p) => <PersonaCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}