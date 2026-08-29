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

  const name = String(body.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "Persona name required" }, { status: 422 });

  const persona = await db.createPersona({
    id: newId("persona"),
    startupId,
    name: name.slice(0, 80),
    role: String(body.role ?? "").trim().slice(0, 120),
    demographics: String(body.demographics ?? "").trim(),
    goals: String(body.goals ?? "").trim(),
    painPoints: String(body.painPoints ?? "").trim(),
    quote: String(body.quote ?? "").trim().slice(0, 300),
    channel: String(body.channel ?? "").trim().slice(0, 200),
    priority: body.priority === "secondary" ? "secondary" : "primary",
    createdAt: tsNow(),
  });
  return NextResponse.json({ ok: true, persona }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;
  const body = (await req.json().catch(() => ({}))) as any;
  const id = req.nextUrl.pathname.split("/").pop()!;
  const persona = await db.getPersona(id);
  if (!persona || !(await userOwnsStartup(user.id, persona.startupId)))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const patch: Record<string, unknown> = {};
  for (const key of ["name", "role", "demographics", "goals", "painPoints", "quote", "channel"] as const) {
    if (typeof body[key] === "string") patch[key] = body[key].trim();
  }
  if (body.priority === "primary" || body.priority === "secondary") patch.priority = body.priority;

  const updated = await db.updatePersona(id, patch);
  return NextResponse.json({ ok: true, persona: updated });
}

export async function DELETE(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;
  const id = req.nextUrl.pathname.split("/").pop()!;
  const persona = await db.getPersona(id);
  if (!persona || !(await userOwnsStartup(user.id, persona.startupId)))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await db.deletePersona(id);
  return NextResponse.json({ ok: true });
}