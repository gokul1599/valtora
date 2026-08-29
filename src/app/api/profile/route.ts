import { NextRequest, NextResponse } from "next/server";
import { apiUser, apiStartupId } from "@/lib/api-helpers";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/** Update the founder's startup profile (idea / audience / problem / monetization). */
export async function PUT(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;
  const body = (await req.json().catch(() => ({}))) as any;
  const { startupId, error: err } = await apiStartupId(req, user, body);
  if (err) return err;

  const existing = await db.getProfile(startupId);
  if (!existing) return NextResponse.json({ error: "No profile found" }, { status: 404 });

  const next = {
    ...existing,
    idea: typeof body.idea === "string" ? body.idea.trim() : existing.idea,
    audience: typeof body.audience === "string" ? body.audience.trim() : existing.audience,
    problem: typeof body.problem === "string" ? body.problem.trim() : existing.problem,
    monetization: typeof body.monetization === "string" ? body.monetization.trim() : existing.monetization,
    updatedAt: new Date().toISOString(),
  };
  await db.setProfile(next);
  return NextResponse.json({ ok: true, profile: next });
}