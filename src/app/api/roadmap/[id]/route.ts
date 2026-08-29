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

  const phases = ["validation", "mvp", "beta", "launch", "growth"];
  if (!phases.includes(body.phase)) return NextResponse.json({ error: "Invalid phase" }, { status: 422 });
  const title = String(body.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "Task title required" }, { status: 422 });

  const tasks = await db.getRoadmap(startupId);
  const task = await db.createRoadmapTask({
    id: newId("task"),
    startupId,
    phase: body.phase,
    title: title.slice(0, 160),
    description: String(body.description ?? "").trim().slice(0, 1000),
    status: "todo",
    priority: ["low", "med", "high"].includes(body.priority) ? body.priority : "med",
    dueDate: typeof body.dueDate === "string" && body.dueDate ? body.dueDate : undefined,
    order: tasks.length,
    createdAt: tsNow(),
  });
  return NextResponse.json({ ok: true, task }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;
  const body = (await req.json().catch(() => ({}))) as any;
  const id = req.nextUrl.pathname.split("/").pop()!;
  const task = await db.getRoadmapTask(id);
  if (!task || !(await userOwnsStartup(user.id, task.startupId)))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const patch: Record<string, unknown> = {};
  if (["validation", "mvp", "beta", "launch", "growth"].includes(body.phase)) patch.phase = body.phase;
  if (["todo", "in-progress", "done"].includes(body.status)) patch.status = body.status;
  if (["low", "med", "high"].includes(body.priority)) patch.priority = body.priority;
  if (typeof body.title === "string" && body.title.trim()) patch.title = body.title.trim();
  if (typeof body.description === "string") patch.description = body.description.trim();
  if (typeof body.dueDate === "string") patch.dueDate = body.dueDate || undefined;
  if (typeof body.order === "number") patch.order = body.order;

  const updated = await db.updateRoadmapTask(id, patch);
  return NextResponse.json({ ok: true, task: updated });
}

export async function DELETE(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;
  const id = req.nextUrl.pathname.split("/").pop()!;
  const task = await db.getRoadmapTask(id);
  if (!task || !(await userOwnsStartup(user.id, task.startupId)))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await db.deleteRoadmapTask(id);
  return NextResponse.json({ ok: true });
}