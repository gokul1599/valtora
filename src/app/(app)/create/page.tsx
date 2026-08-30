import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { OnboardingFlow } from "./onboarding";

export const dynamic = "force-dynamic";

export default async function CreatePage() {
  const session = await getSession();
  if (!session) redirect("/signup");

  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/signup");

  const startup = await db.startup.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return <OnboardingFlow email={user.email} existingId={startup?.id ?? null} existingName={startup?.name ?? null} />;
}