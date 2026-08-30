import { redirect } from "next/navigation";
import { requireDashboardData } from "@/lib/startup";
import { SectionWorkspace } from "@/components/dashboard/section-workspace";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
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
      sectionKey="targetCustomers"
      title="Customers"
      icon="Users"
      description="The segments you serve, their pain points, and how you reach them."
      emptyState={{
        title: "No customer analysis yet",
        description: "Define who your customers are, what they struggle with, and how they will discover you.",
      }}
    />
  );
}