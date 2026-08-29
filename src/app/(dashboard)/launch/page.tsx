import { loadDashboardData } from "@/lib/startup";
import { getLaunch } from "@/lib/db";
import { SectionTitle } from "@/components/ui/card";
import { Regenerate } from "@/components/shared/regenerate";
import { LaunchBoard } from "@/components/dashboard/launch-board";

export const dynamic = "force-dynamic";

export default async function LaunchPage() {
  const { startup } = await loadDashboardData();
  const items = await getLaunch(startup.id);

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Launch"
        sub="Everything that has to be true on launch day, as a working checklist."
        action={<Regenerate kind="launch" startupId={startup.id} confirm="Replace the launch plan with a fresh generation?" />}
      />
      <LaunchBoard key={startup.id} startupId={startup.id} items={items} />
    </div>
  );
}