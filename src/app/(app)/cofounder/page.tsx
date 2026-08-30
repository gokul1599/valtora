import { redirect } from "next/navigation";
import { requireDashboardData } from "@/lib/startup";
import { CoFounderWorkspace } from "./cofounder";

export const dynamic = "force-dynamic";

export default async function CoFounderRoute() {
  let ctx;
  try {
    ctx = await requireDashboardData();
  } catch {
    redirect("/");
    return null;
  }
  return <CoFounderWorkspace ctx={ctx} />;
}