import { redirect } from "next/navigation";
import { requireDashboardData } from "@/lib/startup";
import { SectionWorkspace } from "@/components/dashboard/section-workspace";

export const dynamic = "force-dynamic";

export default async function MvpPage() {
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
      sectionKey="mvp"
      title="MVP"
      icon="Rocket"
      description="The smallest product that tests your biggest assumption — and how to build it fast."
      emptyState={{
        title: "No MVP plan yet",
        description: "Let Zorvyn strip your product to the minimum that proves your hypothesis.",
      }}
    />
  );
}