import { redirect } from "next/navigation";
import { requireDashboardData } from "@/lib/startup";
import { SectionWorkspace } from "@/components/dashboard/section-workspace";

export const dynamic = "force-dynamic";

export default async function TechnologyPage() {
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
      sectionKey="technology"
      title="Technology"
      icon="Cpu"
      description="Stack, architecture, and technical decisions behind the product."
      emptyState={{
        title: "No tech stack defined",
        description: "Let Zorvyn propose a pragmatic stack and architecture for your MVP.",
      }}
    />
  );
}