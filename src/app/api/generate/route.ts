import { NextRequest } from "next/server";
import { requireUser, jsonError } from "@/lib/api-helpers";
import { db } from "@/lib/db";
import { generateBlueprint, regenerateSection } from "@/lib/ai/services";
import { saveSection, recordGeneration, countGenerationsThisMonth } from "@/lib/startup";
import { PLAN_LIMITS, type PlanKey } from "@/lib/constants";
import { isAiConfigured } from "@/lib/ai/groq";

export async function POST(request: NextRequest) {
  const user = await requireUser();

  if (!isAiConfigured()) {
    return jsonError(
      "Zorvyn AI is not configured. Set GROQ_API_KEY to enable AI generation.",
      503,
    );
  }

  let body: {
    action: "blueprint" | "regenerate";
    startupId: string;
    idea?: string;
    audience?: string;
    problem?: string;
    monetization?: string;
    stage?: string;
    goal?: string;
    section?: string;
  } | null = null;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }
  if (!body) return jsonError("Invalid request");

  const startup = await db.startup.findFirst({
    where: { id: body.startupId, userId: user.id },
  });
  if (!startup) return jsonError("Startup not found", 404);

  const planKey: PlanKey = (user.plan as PlanKey) ?? "free";
  const used = await countGenerationsThisMonth(user.id);
  if (used >= PLAN_LIMITS[planKey].aiGenerationsPerMonth) {
    return jsonError(
      `You've reached your ${PLAN_LIMITS[planKey].label} plan limit of ${PLAN_LIMITS[planKey].aiGenerationsPerMonth} AI generations this month.`,
      429,
    );
  }

  try {
    if (body.action === "blueprint") {
      const sections = await db.startupSection.findMany({
        where: { startupId: startup.id },
      });
      const existing: Record<string, unknown> = {};
      for (const s of sections) existing[s.key] = s.data;

      const input = {
        name: startup.name,
        idea: body.idea ?? startup.idea,
        audience: body.audience ?? startup.audience ?? "",
        problem: body.problem ?? startup.problem ?? "",
        monetization: body.monetization ?? startup.monetization ?? "",
        stage: body.stage ?? startup.stage,
        goal: body.goal ?? startup.goal ?? "",
      };

      const result = await generateBlueprint(input);

      const blueprint = result.data as Record<string, unknown> & { mvp?: Record<string, unknown>; product?: Record<string, unknown> };

      // Persist each section for full knowledge graph.
      const titles: Record<string, string> = {
        vision: "Vision",
        problem: "Problem",
        targetCustomers: "Target Customers",
        valueProposition: "Value Proposition",
        market: "Market",
        competitors: "Competitors",
        differentiation: "Differentiation",
        businessModel: "Business Model",
        pricing: "Pricing",
        product: "Product",
        mvp: "MVP",
        technology: "Technology",
        roadmap: "Roadmap",
        marketing: "Marketing",
        launch: "Launch",
        risks: "Risks",
        nextActions: "Next Actions",
      };

      for (const key of Object.keys(blueprint)) {
        if (key in titles) {
          await saveSection(startup.id, key, titles[key], blueprint[key], "ai");
        }
      }

      await db.startup.update({
        where: { id: startup.id },
        data: { score: estimateScore(blueprint) },
      });

      await recordGeneration({
        userId: user.id,
        startupId: startup.id,
        action: "blueprint",
        tokensIn: result.tokensIn,
        tokensOut: result.tokensOut,
        durationMs: result.durationMs,
      });

      const saved = await db.startupSection.findMany({ where: { startupId: startup.id } });
      const sectionsObj: Record<string, unknown> = {};
      for (const s of saved) sectionsObj[s.key] = s.data;

      return Response.json({
        ok: true,
        action: "blueprint",
        data: sectionsObj,
        score: estimateScore(blueprint),
      });
    }

    if (body.action === "regenerate" && body.section) {
      const sections = await db.startupSection.findMany({ where: { startupId: startup.id } });
      const existingSectionsText = sections
        .map((s) => `${s.key}:\n${JSON.stringify(s.data)}`)
        .join("\n\n");

      const result = await regenerateSection(body.section, {
        startup: { name: startup.name, idea: startup.idea, stage: startup.stage },
        existingSections: existingSectionsText,
      });

      const key = body.section;
      const titles: Record<string, string> = {
        market: "Market",
        technology: "Technology",
        roadmap: "Roadmap",
        marketing: "Marketing",
        launch: "Launch",
        product: "Product",
        mvp: "MVP",
        businessModel: "Business Model",
        pricing: "Pricing",
      };
      await saveSection(
        startup.id,
        key,
        titles[key] ?? key,
        result.data,
        "ai",
      );

      await recordGeneration({
        userId: user.id,
        startupId: startup.id,
        action: `regenerate:${key}`,
        tokensIn: result.tokensIn,
        tokensOut: result.tokensOut,
        durationMs: result.durationMs,
      });

      return Response.json({ ok: true, action: "regenerate", key, data: result.data });
    }

    return jsonError("Unknown action", 400);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await recordGeneration({
      userId: user.id,
      startupId: startup.id,
      action: body.action === "blueprint" ? "blueprint" : `regenerate:${body.section}`,
      status: "error",
      error: message,
    });
    return jsonError("We couldn't complete this analysis. Your startup data is safe.", 500);
  }
}

export function estimateScore(blueprint: Record<string, unknown>): number {
  // Transparent heuristic across 7 dimensions. Each contributes 0–~14 points.
  let score = 40;

  const has = (key: string, field?: string) => {
    const value = blueprint[key];
    if (!value) return false;
    if (field && typeof value === "object" && value !== null) {
      return Boolean((value as Record<string, unknown>)[field]);
    }
    return true;
  };

  const len = (key: string, field?: string) => {
    const value = blueprint[key];
    if (!value) return 0;
    if (field && typeof value === "object" && value !== null) {
      const v = (value as Record<string, unknown>)[field];
      return Array.isArray(v) ? v.length : typeof v === "string" ? v.length : 0;
    }
    return Array.isArray(value) ? value.length : typeof value === "string" ? value.length : 0;
  };

  if (has("problem", "coreProblem")) score += 4;
  if (has("problem", "existingSolutions") && len("problem", "existingSolutions") >= 2) score += 3;

  if (has("market", "tam")) score += 3;
  if (has("market", "sam") && has("market", "som")) score += 3;

  if (has("targetCustomers", "primary")) score += 4;
  if (has("valueProposition", "promise")) score += 3;

  if (len("competitors") >= 2) score += 4;
  if (has("differentiation", "strategy")) score += 3;

  if (len("businessModel", "revenueStreams") >= 1) score += 5;

  if (len("pricing") >= 1) score += 4;

  if (len("product", "featureList") >= 3) score += 4;
  if (has("mvp", "coreFeatures") && len("mvp", "coreFeatures") >= 2) score += 4;

  if (len("roadmap", "phases") >= 2) score += 3;
  if (has("marketing", "positioning")) score += 3;
  if (len("launch") > 0) score += 2;

  return Math.max(0, Math.min(100, score));
}