import { redirect } from "next/navigation";
import { requireDashboardData } from "@/lib/startup";
import { SectionWorkspace } from "@/components/dashboard/section-workspace";

export const dynamic = "force-dynamic";

export default async function CompetitorsPage() {
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
      sectionKey="competitors"
      title="Competitive Analysis"
      icon="Swords"
      description="Who you are up against, how they compare, and where you can win."
      emptyState={{
        title: "No competitive analysis yet",
        description: "Map your competitors, compare their strengths and weaknesses, and find your wedge.",
      }}
    />
  );
}