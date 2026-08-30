import { redirect } from "next/navigation";
import { requireDashboardData } from "@/lib/startup";
import { SectionWorkspace } from "@/components/dashboard/section-workspace";

export const dynamic = "force-dynamic";

export default async function LaunchPage() {
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
      sectionKey="launch"
      title="Launch"
      icon="Send"
      description="A step-by-step launch plan to capture attention and convert interest."
      emptyState={{
        title: "No launch plan yet",
        description: "Plan your public launch: messaging, channels, timing, and follow-up.",
      }}
    />
  );
}