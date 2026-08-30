import { redirect } from "next/navigation";
import { requireDashboardData } from "@/lib/startup";
import { SectionWorkspace } from "@/components/dashboard/section-workspace";

export const dynamic = "force-dynamic";

export default async function RoadmapPage() {
  let ctx;
  try {
    ctx = await requireDashboardData();
  } catch {
    redirect("/");
    return null;
  }
  if (!ctx.startup) {
    redirect("/create");
    return null;
  }
  return (
    <SectionWorkspace
      ctx={ctx}
      sectionKey="roadmap"
      title="Roadmap"
      icon="Map"
      description="Phased plan from validated idea to launch and beyond."
      emptyState={{
        title: "No roadmap yet",
        description: "Turn your MVP and milestones into a clear, phased execution roadmap.",
      }}
    />
  );
}