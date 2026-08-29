import { NextResponse } from "next/server";
import { getUserById, getActiveStartupForUser } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getUserById(session.sub);
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 401 });

  const startups = user.activeStartupId
    ? await getActiveStartupForUser(user.activeStartupId, user.id).then((s) => (s ? [s] : []))
    : [];

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      avatarUrl: user.avatarUrl,
      activeStartupId: user.activeStartupId,
    },
    startups: startups.map((s) => ({ id: s.id, name: s.name, stage: s.stage })),
  });
}