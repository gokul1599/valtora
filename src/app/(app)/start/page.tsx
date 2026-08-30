import { redirect } from "next/navigation";
import { Dashboard } from "./dashboard";
import { requireDashboardData } from "@/lib/startup";

export const dynamic = "force-dynamic";

export default async function StartPage() {
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

  return <Dashboard ctx={ctx} />;
}