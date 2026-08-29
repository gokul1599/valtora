import { NextRequest, NextResponse } from "next/server";
import { apiUser, apiStartupId } from "@/lib/api-helpers";
import { db, userOwnsStartup } from "@/lib/db";
import { newId, now as tsNow } from "@/lib/db/store";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;
  const body = (await req.json().catch(() => ({}))) as any;
  const { startupId, error: err } = await apiStartupId(req, user, body);
  if (err) return err;

  const company = String(body.company ?? "").trim();
  if (!company) return NextResponse.json({ error: "Company name required" }, { status: 422 });

  const competitor = await db.createCompetitor({
    id: newId("comp"),
    startupId,
    company: company.slice(0, 120),
    product: String(body.product ?? "").trim().slice(0, 300),
    targetUsers: String(body.targetUsers ?? "").trim().slice(0, 300),
    pricing: String(body.pricing ?? "").trim().slice(0, 200),
    strengths: Array.isArray(body.strengths) ? body.strengths.map(String) : [],
    weaknesses: Array.isArray(body.weaknesses) ? body.weaknesses.map(String) : [],
    differentiation: String(body.differentiation ?? "").trim().slice(0, 1000),
    verified: body.verified === true,
    createdAt: tsNow(),
  });
  return NextResponse.json({ ok: true, competitor }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;
  const body = (await req.json().catch(() => ({}))) as any;
  const id = req.nextUrl.pathname.split("/").pop()!;
  const competitor = await db.getCompetitor(id);
  if (!competitor || !(await userOwnsStartup(user.id, competitor.startupId)))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const patch: Record<string, unknown> = {};
  for (const key of ["company", "product", "targetUsers", "pricing", "differentiation"] as const) {
    if (typeof body[key] === "string") patch[key] = body[key].trim();
  }
  if (Array.isArray(body.strengths)) patch.strengths = body.strengths.map(String);
  if (Array.isArray(body.weaknesses)) patch.weaknesses = body.weaknesses.map(String);
  if (typeof body.verified === "boolean") patch.verified = body.verified;

  const updated = await db.updateCompetitor(id, patch);
  return NextResponse.json({ ok: true, competitor: updated });
}

export async function DELETE(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;
  const id = req.nextUrl.pathname.split("/").pop()!;
  const competitor = await db.getCompetitor(id);
  if (!competitor || !(await userOwnsStartup(user.id, competitor.startupId)))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await db.deleteCompetitor(id);
  return NextResponse.json({ ok: true });
}