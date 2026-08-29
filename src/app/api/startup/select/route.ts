import { NextResponse } from "next/server";
import { apiUser, readJson } from "@/lib/api-helpers";
import { updateUser, userOwnsStartup } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { user, error } = await apiUser();
  if (error) return error;

  const body = (await readJson(req as any)) as { startupId?: string } | null;
  const startupId = body?.startupId;
  if (!startupId) return NextResponse.json({ error: "Missing startupId" }, { status: 422 });
  if (!(await userOwnsStartup(user.id, startupId)))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await updateUser(user.id, { activeStartupId: startupId });
  return NextResponse.json({ ok: true });
}