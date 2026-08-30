import { redirect } from "next/navigation";
import { requireDashboardData } from "@/lib/startup";
import { SectionWorkspace } from "@/components/dashboard/section-workspace";

export const dynamic = "force-dynamic";

export default async function ProductPage() {
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
      sectionKey="product"
      title="Product"
      icon="Package"
      description="Feature set, architecture, and value delivery — the full product picture."
      emptyState={{
        title: "No product definition yet",
        description: "Define the full product: features, architecture, and how value is delivered to users.",
      }}
    />
  );
}