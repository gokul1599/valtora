import { loadDashboardData } from "@/lib/startup";
import { Card, CardBody, CardHeader, SectionTitle } from "@/components/ui/card";
import { Regenerate } from "@/components/shared/regenerate";
import { EmptyState } from "@/components/ui/skeleton";
import { Icon } from "@/components/ui/icon";

export const dynamic = "force-dynamic";

function RowCard({ title, body }: { title: string; body: string }) {
  if (!body) return null;
  return (
    <Card>
      <CardHeader title={title} />
      <CardBody>
        <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--fg)]">{body}</p>
      </CardBody>
    </Card>
  );
}

export default async function TechnologyPage() {
  const { startup, context } = await loadDashboardData();
  const t = context.technical;

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Technology"
        sub="A pragmatic technical plan — boring where it should be, sharp where it counts."
        action={<Regenerate kind="technical" startupId={startup.id} confirm="Replace the technical plan with a fresh generation?" />}
      />

      {!t ? (
        <Card>
          <EmptyState icon={<Icon name="technology" size={22} />} title="No technical plan yet" description="Regenerate to get a pragmatic build plan." />
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader title="Summary" />
            <CardBody>
              <p className="text-sm leading-relaxed text-[var(--fg)]">{t.summary}</p>
            </CardBody>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <RowCard title="Frontend" body={t.frontend} />
            <RowCard title="Backend" body={t.backend} />
            <RowCard title="Database" body={t.database} />
            <RowCard title="Authentication" body={t.authentication} />
            <RowCard title="Infrastructure" body={t.infrastructure} />
            <RowCard title="AI" body={t.ai} />
          </div>

          {t.integrations.length > 0 && (
            <Card>
              <CardHeader title="Integrations" />
              <CardBody>
                <div className="flex flex-wrap gap-2">
                  {t.integrations.map((i) => (
                    <span key={i} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--fg)]">
                      {i}
                    </span>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {t.dataModel.length > 0 && (
            <Card>
              <CardHeader title="Data model" description="Core entities and how they relate" />
              <CardBody>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)] text-[0.65rem] uppercase tracking-wider text-[var(--muted)]">
                        <th className="py-2 pr-4 font-semibold">Entity</th>
                        <th className="py-2 pr-4 font-semibold">Purpose</th>
                        <th className="py-2 font-semibold">Relations</th>
                      </tr>
                    </thead>
                    <tbody>
                      {t.dataModel.map((row) => (
                        <tr key={row.entity} className="border-b border-[var(--border)]/60 last:border-b-0">
                          <td className="py-2.5 pr-4 font-medium text-[var(--fg)]">{row.entity}</td>
                          <td className="py-2.5 pr-4 text-[var(--muted)]">{row.purpose}</td>
                          <td className="py-2.5 text-[var(--muted)]">{row.relations}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}