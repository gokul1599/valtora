import { redirect } from "next/navigation";
import { requireDashboardData } from "@/lib/startup";
import { SectionWorkspace } from "@/components/dashboard/section-workspace";

export const dynamic = "force-dynamic";

export default async function MarketPage() {
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
      sectionKey="market"
      title="Market"
      icon="TrendingUp"
      description="Market size, trends, segmentation, and demand analysis for your idea."
      emptyState={{
        title: "No market analysis yet",
        description: "Have Zorvyn analyze your target market, its size, trends, and where the growth is happening.",
      }}
    />
  );
}