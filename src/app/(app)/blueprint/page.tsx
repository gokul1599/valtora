import { redirect } from "next/navigation";
import { requireDashboardData } from "@/lib/startup";
import { BlueprintPage } from "./blueprint";

export const dynamic = "force-dynamic";

export default async function BlueprintRoute() {
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
  return <BlueprintPage ctx={ctx} />;
}