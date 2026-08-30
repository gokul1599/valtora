import { redirect } from "next/navigation";
import { requireDashboardData } from "@/lib/startup";
import { SettingsClient } from "./settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  let ctx;
  try {
    ctx = await requireDashboardData();
  } catch {
    redirect("/");
    return null;
  }
  return <SettingsClient ctx={ctx} />;
}