import { loadDashboardData } from "@/lib/startup";
import { getBlueprint } from "@/lib/db";
import { BlueprintViewer } from "@/components/dashboard/blueprint-viewer";
import { SectionTitle } from "@/components/ui/card";
import { Regenerate } from "@/components/shared/regenerate";

export const dynamic = "force-dynamic";

export default async function BlueprintPage() {
  const { startup } = await loadDashboardData();
  const blueprint = await getBlueprint(startup.id);
  const sections = blueprint?.sections ?? [];
  const version = blueprint?.version ?? 1;

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Startup Blueprint"
        sub={`Sixteen sections that turn your answers into a working plan. Review, edit, regenerate. v${version}`}
        action={
          <Regenerate kind="blueprint" startupId={startup.id} label="Regenerate all" confirm="Replace every section with a fresh generation?" />
        }
      />
      <BlueprintViewer key={startup.id} startupId={startup.id} sections={sections} />
    </div>
  );
}