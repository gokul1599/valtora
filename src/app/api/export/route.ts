import { NextRequest, NextResponse } from "next/server";
import { apiUser, apiStartupId } from "@/lib/api-helpers";
import { getStartup } from "@/lib/startup";
import { db } from "@/lib/db";
import { buildContextFor } from "@/lib/startup";

export const runtime = "nodejs";

const kinds = ["markdown", "json", "csv", "pdf"] as const;
type Kind = (typeof kinds)[number];

export async function POST(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;

  const body = (await req.json().catch(() => ({}))) as { kind?: string };
  if (!body.kind || !kinds.includes(body.kind as Kind))
    return NextResponse.json({ error: "Invalid export kind" }, { status: 422 });

  const { startupId, error: err } = await apiStartupId(req as any, user, body);
  if (err) return err;

  const startup = await getStartup(startupId);
  if (!startup) return NextResponse.json({ error: "Startup not found" }, { status: 404 });
  const ctx = await buildContextFor(startup);

  const { buildExport } = await import("@/lib/export");
  const roadmapRows = (ctx.roadmap ?? []).map((t) => ({
    phase: t.phase,
    title: t.title,
    status: t.status,
    priority: t.priority,
    dueDate: t.dueDate,
  }));

  const doc = await buildExport(startupId, body.kind as Kind, {
    startup,
    profile: ctx.profile,
    blueprint: await db.getBlueprint(startupId),
    assessment: ctx.assessment ?? null,
  }, { roadmap: roadmapRows });

  return NextResponse.json({ ok: true, document: doc });
}

export async function GET(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;
  const { startupId, error: err } = await apiStartupId(req, user);
  if (err) return err;
  const docs = await db.getDocuments(startupId);
  return NextResponse.json({ documents: docs });
}