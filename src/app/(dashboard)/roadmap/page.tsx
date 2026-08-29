import { loadDashboardData } from "@/lib/startup";
import { getRoadmap } from "@/lib/db";
import { SectionTitle } from "@/components/ui/card";
import { Regenerate } from "@/components/shared/regenerate";
import { RoadmapBoard } from "@/components/dashboard/roadmap-board";

export const dynamic = "force-dynamic";

export default async function RoadmapPage() {
  const { startup } = await loadDashboardData();
  const tasks = await getRoadmap(startup.id);

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Roadmap"
        sub="Five phases, one plan — tasks are yours to check off, reprioritize and shape."
        action={<Regenerate kind="roadmap" startupId={startup.id} confirm="Replace the roadmap with a fresh generation?" />}
      />
      <RoadmapBoard key={startup.id} startupId={startup.id} tasks={tasks} />
    </div>
  );
}