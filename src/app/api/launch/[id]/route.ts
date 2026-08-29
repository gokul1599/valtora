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

  const title = String(body.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "Item title required" }, { status: 422 });

  const items = await db.getLaunch(startupId);
  const item = await db.createLaunchItem({
    id: newId("launch"),
    startupId,
    title: title.slice(0, 120),
    description: String(body.description ?? "").trim(),
    category: String(body.category ?? "Operations").slice(0, 40),
    status: "pending",
    order: items.length,
    createdAt: tsNow(),
  });
  return NextResponse.json({ ok: true, item }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;
  const body = (await req.json().catch(() => ({}))) as any;
  const id = req.nextUrl.pathname.split("/").pop()!;
  const item = await db.getLaunchItem(id);
  if (!item || !(await userOwnsStartup(user.id, item.startupId)))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const patch: Record<string, unknown> = {};
  if (typeof body.title === "string" && body.title.trim()) patch.title = body.title.trim();
  if (typeof body.description === "string") patch.description = body.description.trim();
  if (["pending", "in-progress", "done"].includes(body.status)) patch.status = body.status;
  if (typeof body.order === "number") patch.order = body.order;

  const updated = await db.updateLaunchItem(id, patch);
  return NextResponse.json({ ok: true, item: updated });
}