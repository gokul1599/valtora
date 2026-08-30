import { redirect } from "next/navigation";
import { requireDashboardData } from "@/lib/startup";
import { SectionWorkspace } from "@/components/dashboard/section-workspace";

export const dynamic = "force-dynamic";

export default async function BusinessModelPage() {
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
      sectionKey="businessModel"
      title="Business Model"
      icon="Store"
      description="How VALTORA will create, deliver, and capture value from this startup."
      emptyState={{
        title: "No business model yet",
        description: "Define how you make money, what it costs, and how the economics scale.",
      }}
    />
  );
}