import { loadDashboardData } from "@/lib/startup";
import { getConversations } from "@/lib/db";
import { SectionTitle } from "@/components/ui/card";
import { CofounderChat } from "@/components/dashboard/cofounder-chat";

export const dynamic = "force-dynamic";

export default async function CofounderPage() {
  const { startup } = await loadDashboardData();
  const conversations = await getConversations(startup.id);

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Cofounder"
        sub="A second brain that knows your whole file — it advises, plans, and only edits with your approval."
      />
      <CofounderChat key={startup.id} startup={startup} initialConversations={conversations} />
    </div>
  );
}