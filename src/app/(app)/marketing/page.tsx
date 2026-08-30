import { redirect } from "next/navigation";
import { requireDashboardData } from "@/lib/startup";
import { SectionWorkspace } from "@/components/dashboard/section-workspace";

export const dynamic = "force-dynamic";

export default async function MarketingPage() {
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
      sectionKey="marketing"
      title="Marketing"
      icon="Megaphone"
      description="Channels, positioning, and campaigns to reach your first users."
      emptyState={{
        title: "No marketing plan yet",
        description: "Find the highest-leverage channels to reach your target customers.",
      }}
    />
  );
}