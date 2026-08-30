import { redirect } from "next/navigation";
import { requireDashboardData } from "@/lib/startup";
import { ProfileClient } from "./profile-client";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  let ctx;
  try {
    ctx = await requireDashboardData();
  } catch {
    redirect("/");
    return null;
  }
  return <ProfileClient ctx={ctx} />;
}