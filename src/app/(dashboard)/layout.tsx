import { redirect } from "next/navigation";
import { loadShell } from "@/lib/startup";
import { AppShell } from "@/components/shell/app-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, startups, startup } = await loadShell();
  if (startups.length === 0) redirect("/onboarding");
  return (
    <AppShell user={user} startups={startups} activeStartup={startup}>
      {children}
    </AppShell>
  );
}