import { NextRequest, NextResponse } from "next/server";
import { apiUser, apiStartupId } from "@/lib/api-helpers";
import { db } from "@/lib/db";
import { getStartup, buildContextFor } from "@/lib/startup";
import { generate } from "@/lib/ai/registry";
import type { BlueprintSlug } from "@/lib/types";
import { newId, now as tsNow } from "@/lib/db/store";

export const runtime = "nodejs";
export const maxDuration = 30;

/** Edit a blueprint section's content. */
export async function PUT(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;
  const body = (await req.json().catch(() => ({}))) as any;
  const { startupId, error: err } = await apiStartupId(req, user, body);
  if (err) return err;

  const slug = body.slug as BlueprintSlug;
  if (!slug || typeof body.content !== "string")
    return NextResponse.json({ error: "slug and content required" }, { status: 422 });

  const blueprint = await db.getBlueprint(startupId);
  if (!blueprint) return NextResponse.json({ error: "No blueprint found" }, { status: 404 });

  const section = blueprint.sections.find((s) => s.slug === slug);
  if (!section) return NextResponse.json({ error: "Section not found" }, { status: 404 });

  const updated = blueprint.sections.map((s) =>
    s.slug === slug ? { ...s, content: body.content, updatedAt: tsNow() } : s
  );
  await db.saveBlueprint({ ...blueprint, sections: updated });
  return NextResponse.json({ ok: true });
}

/** Regenerate a single blueprint section without touching the others. */
export async function POST(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;
  const body = (await req.json().catch(() => ({}))) as any;
  const { startupId, error: err } = await apiStartupId(req, user, body);
  if (err) return err;

  const slug = body.slug as BlueprintSlug;
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 422 });

  const startup = await getStartup(startupId);
  if (!startup) return NextResponse.json({ error: "Startup not found" }, { status: 404 });
  const ctx = await buildContextFor(startup);

  const content = (await generate({ kind: "blueprint-section", ctx, section: slug } as any)) as string;
  const blueprint = await db.getBlueprint(startupId);

  if (blueprint) {
    const updated = blueprint.sections.map((s) =>
      s.slug === slug ? { ...s, content, status: "reviewed" as const, updatedAt: tsNow() } : s
    );
    await db.saveBlueprint({ ...blueprint, version: blueprint.version, sections: updated });
  }

  await db.createGeneration({
    id: newId("gen"),
    userId: user.id,
    startupId,
    kind: "blueprint-section",
    provider: "forge-engine",
    model: "forge-engine-v1",
    createdAt: tsNow(),
  });

  return NextResponse.json({ ok: true, content });
}