import { loadDashboardData } from "@/lib/startup";
import { Card, CardBody, CardHeader, SectionTitle } from "@/components/ui/card";
import { Regenerate } from "@/components/shared/regenerate";
import { EmptyState } from "@/components/ui/skeleton";
import { Icon } from "@/components/ui/icon";

export const dynamic = "force-dynamic";

function BulletCard({ title, items }: { title: string; items: string[] }) {
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

export default async function MarketingPage() {
  const { startup, context } = await loadDashboardData();
  const m = context.marketing;

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Marketing"
        sub="Position once, then route every channel through the same story."
        action={<Regenerate kind="marketing" startupId={startup.id} confirm="Replace the marketing plan with a fresh generation?" />}
      />

      {!m ? (
        <Card>
          <EmptyState icon={<Icon name="marketing" size={22} />} title="No marketing plan yet" description="Regenerate to build your message and channels." />
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader title="Positioning" />
              <CardBody>
                <p className="text-sm leading-relaxed text-[var(--fg)]">{m.positioning}</p>
              </CardBody>
            </Card>
            <Card>
              <CardHeader title="Tagline" />
              <CardBody>
                <p className="text-sm font-medium text-[var(--fg)]">{m.tagline}</p>
              </CardBody>
            </Card>
            <Card>
              <CardHeader title="Target audience" />
              <CardBody>
                <p className="text-sm leading-relaxed text-[var(--fg)]">{m.targetAudience}</p>
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader title="Landing copy" />
            <CardBody>
              <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--fg)]">{m.landingCopy}</p>
            </CardBody>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <BulletCard title="Acquisition channels" items={m.acquisitionChannels} />
            <BulletCard title="Content strategy" items={m.contentStrategy} />
            <BulletCard title="Social strategy" items={m.socialStrategy} />
            <BulletCard title="Email campaigns" items={m.emailCampaign} />
            <BulletCard title="SEO ideas" items={m.seoIdeas} />
          </div>

          <BulletCard title="Launch campaign" items={m.launchCampaign} />
        </div>
      )}
    </div>
  );
}