import { loadDashboardData } from "@/lib/startup";
import { Card, CardBody, CardHeader, SectionTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Regenerate } from "@/components/shared/regenerate";
import { EmptyState } from "@/components/ui/skeleton";
import { Icon } from "@/components/ui/icon";

export const dynamic = "force-dynamic";

function ListCard({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <Card>
      <CardHeader title={title} />
      <CardBody>
        <ul className="space-y-2">
          {items.map((it, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-[var(--fg)]">
              <span className="mt-0.5 text-[var(--color-brand-500)]">•</span> {it}
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}

export default async function MvpPage() {
  const { startup, context } = await loadDashboardData();
  const mvp = context.mvpRecord;

  return (
    <div className="space-y-5">
      <SectionTitle
        title="MVP"
        sub="The smallest honest thing you can ship that proves the risky part — no more."
        action={<Regenerate kind="mvp" startupId={startup.id} confirm="Replace the full MVP scope with a fresh cut?" />}
      />

      {!mvp ? (
        <Card>
          <EmptyState icon={<Icon name="mvp" size={22} />} title="No MVP scoped yet" description="Regenerate to cut the smallest honest product." />
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader
              title="The one line that matters"
              action={<Badge tone={mvp.status === "approved" ? "success" : "warning"} dot>{mvp.status}</Badge>}
            />
            <CardBody>
              <p className="text-base font-medium leading-relaxed text-[var(--fg)]">{mvp.objective}</p>
            </CardBody>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <ListCard title="Core features" items={mvp.coreFeatures} />
            <ListCard title="Screens" items={mvp.screens} />
            <ListCard title="User stories" items={mvp.userStories} />
            <ListCard title="Dev tasks" items={mvp.devTasks} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <ListCard title="Data requirements" items={mvp.databaseRequirements} />
            <ListCard title="APIs" items={mvp.apis} />
            <ListCard title="Integrations" items={mvp.integrations} />
          </div>

          {mvp.authentication && (
            <Card>
              <CardHeader title="Authentication" />
              <CardBody>
                <p className="text-sm leading-relaxed text-[var(--fg)]">{mvp.authentication}</p>
              </CardBody>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}