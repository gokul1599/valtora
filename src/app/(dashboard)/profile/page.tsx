import { loadDashboardData } from "@/lib/startup";
import { getProfile } from "@/lib/db";
import { SectionTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/dashboard/profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { startup } = await loadDashboardData();
  const profile = await getProfile(startup.id);
  const safeProfile = profile ?? {
    startupId: startup.id,
    idea: "",
    audience: "",
    problem: "",
    monetization: "",
    journeyStage: "just-idea" as const,
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Startup profile"
        sub="The founder's briefing — what you're building, for whom, why it hurts, and how it pays."
      />
      <div className="max-w-2xl">
        <ProfileForm key={startup.id} startupId={startup.id} profile={safeProfile} />
      </div>
    </div>
  );
}