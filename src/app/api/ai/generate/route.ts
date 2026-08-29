import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiUser, apiStartupId } from "@/lib/api-helpers";
import { getStartup, buildContextFor } from "@/lib/startup";
import { generate } from "@/lib/ai/registry";
import { db } from "@/lib/db";
import { getUsage } from "@/lib/auth/usage";
import { newId, now as tsNow } from "@/lib/db/store";
import { generateBusinessModel } from "@/lib/ai/engine/marketing";
import type { AiGenerationKind, StartupContext } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({
  kind: z.enum([
    "blueprint",
    "blueprint-section",
    "market",
    "competitors",
    "personas",
    "mvp",
    "product-vision",
    "business-model",
    "pricing",
    "marketing",
    "launch",
    "roadmap",
    "technical",
    "chat",
  ]),
  section: z.string().optional(),
  message: z.string().optional(),
  startupId: z.string().optional(),
});

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

async function persistByKind(
  kind: AiGenerationKind,
  result: unknown,
  startupId: string,
  ctx: StartupContext,
  section?: string
): Promise<void> {
  const ts = tsNow();
  switch (kind) {
    case "blueprint": {
      if (!Array.isArray(result)) return;
      const existing = await db.getBlueprint(startupId);
      await db.saveBlueprint({
        startupId,
        version: (existing?.version ?? 0) + 1,
        generatedAt: ts,
        sections: result as any,
      });
      break;
    }
    case "blueprint-section": {
      if (typeof result !== "string") return;
      const blueprint = await db.getBlueprint(startupId);
      if (!blueprint) return;
      await db.saveBlueprint({
        ...blueprint,
        version: blueprint.version,
        sections: blueprint.sections.map((s) =>
          s.slug === section
            ? { ...s, content: result, status: "reviewed" as const, updatedAt: ts }
            : s
        ),
      });
      break;
    }
    case "market":
      if (isRecord(result) && typeof result.tam === "number") await db.saveMarket(result as any);
      break;
    case "competitors":
      if (Array.isArray(result) && result.length) await db.replaceCompetitors(startupId, result as any);
      break;
    case "personas":
      if (Array.isArray(result) && result.length) await db.replacePersonas(startupId, result as any);
      break;
    case "mvp":
      if (isRecord(result) && typeof result.objective === "string") await db.saveMvp(result as any);
      break;
    case "product-vision": {
      if (!isRecord(result)) return;
      if (isRecord(result.vision)) await db.saveProductVision(result.vision as any);
      if (Array.isArray(result.stories)) await db.replaceUserStories(startupId, result.stories as any);
      if (Array.isArray(result.features)) await db.replaceFeatures(startupId, result.features as any);
      break;
    }
    case "business-model":
      if (isRecord(result) && typeof result.model === "string") await db.saveBusinessModel(result as any);
      break;
    case "pricing": {
      if (!isRecord(result)) return;
      const tiers = Array.isArray(result.pricing) ? result.pricing : null;
      if (!tiers) return;
      const existing = await db.getBusinessModel(startupId);
      const model = existing ?? (await generateBusinessModel(ctx));
      await db.saveBusinessModel({ ...model, pricingTiers: tiers });
      break;
    }
    case "marketing":
      if (isRecord(result) && typeof result.positioning === "string") await db.saveMarketing(result as any);
      break;
    case "launch":
      if (Array.isArray(result) && result.length) await db.replaceLaunch(startupId, result as any);
      break;
    case "roadmap":
      if (Array.isArray(result) && result.length) await db.replaceRoadmap(startupId, result as any);
      break;
    case "technical":
      if (isRecord(result) && typeof result.summary === "string") await db.saveTechnicalPlan(result as any);
      break;
    case "chat":
    default:
      break;
  }
}

export async function POST(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid generation request" }, { status: 422 });

  const { startupId, error: err } = await apiStartupId(req as any, user, body);
  if (err) return err;

  const usage = await getUsage(user);
  if (!usage.ok) {
    return NextResponse.json(
      {
        error: `You've used ${usage.used}/${usage.limit} AI generations this month. Upgrade to keep generating.`,
        usage,
      },
      { status: 429 }
    );
  }

  const startup = await getStartup(startupId);
  if (!startup) return NextResponse.json({ error: "Startup not found" }, { status: 404 });
  const ctx = await buildContextFor(startup);

  const kind = parsed.data.kind as AiGenerationKind;
  const result = await generate({
    kind,
    ctx,
    section: parsed.data.section as any,
    message: parsed.data.message,
  });

  await persistByKind(kind, result, startupId, ctx, parsed.data.section);

  // Record usage
  await db.createGeneration({
    id: newId("gen"),
    userId: user.id,
    startupId,
    kind,
    provider: "forge-engine",
    model: "forge-engine-v1",
    createdAt: tsNow(),
  });

  return NextResponse.json({ ok: true, result, provenance: "engine" });
}