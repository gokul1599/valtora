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
  if (!name) return NextResponse.json({ error: "Feature name required" }, { status: 422 });

  const feature = await db.createFeature({
    id: newId("feat"),
    startupId,
    name: name.slice(0, 120),
    description: String(body.description ?? "").trim().slice(0, 2000),
    category: ["must", "should", "could", "not-now"].includes(body.category) ? body.category : "should",
    userStory: typeof body.userStory === "string" ? body.userStory.trim() : undefined,
    status: "planned",
    createdAt: tsNow(),
  });
  return NextResponse.json({ ok: true, feature }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;
  const body = (await req.json().catch(() => ({}))) as any;
  const { id } = req.nextUrl.pathname.match(/\/features\/([^/]+)/) ? { id: req.nextUrl.pathname.split("/").pop()! } : { id: "" };
  if (!id) return NextResponse.json({ error: "Missing feature id" }, { status: 422 });

  const feature = await db.getFeature(id);
  if (!feature || !(await userOwnsStartup(user.id, feature.startupId)))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const patch: Record<string, unknown> = {};
  if (typeof body.name === "string" && body.name.trim()) patch.name = body.name.trim().slice(0, 120);
  if (typeof body.description === "string") patch.description = body.description.trim();
  if (["must", "should", "could", "not-now"].includes(body.category)) patch.category = body.category;
  if (["planned", "in-progress", "done"].includes(body.status)) patch.status = body.status;
  if (typeof body.userStory === "string") patch.userStory = body.userStory.trim();

  const updated = await db.updateFeature(id, patch);
  return NextResponse.json({ ok: true, feature: updated });
}

export async function DELETE(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;
  const id = req.nextUrl.pathname.split("/").pop()!;
  const feature = await db.getFeature(id);
  if (!feature || !(await userOwnsStartup(user.id, feature.startupId)))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await db.deleteFeature(id);
  return NextResponse.json({ ok: true });
}