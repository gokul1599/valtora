import { loadDashboardData } from "@/lib/startup";
import { getSubscription } from "@/lib/db";
import { SectionTitle } from "@/components/ui/card";
import { SettingsPage } from "@/components/dashboard/settings-page";

export const dynamic = "force-dynamic";

export default async function SettingsRoute() {
  const { user } = await loadDashboardData();
  const subscription = await getSubscription(user.id);

  return (
    <div className="space-y-5">
      <SectionTitle title="Settings" sub="Your account, your security, your plan." />
      <SettingsPage user={user} subscription={subscription} />
    </div>
  );
}