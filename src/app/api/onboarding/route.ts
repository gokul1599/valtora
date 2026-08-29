import { NextRequest, NextResponse } from "next/server";
import { onboardingSchema } from "@/lib/validation/schemas";
import { apiUser } from "@/lib/api-helpers";
import { db } from "@/lib/db";
import { newId, now as tsNow } from "@/lib/db/store";
import {
  generateBlueprint,
  computeAssessment,
  generateMarket,
  generateCompetitors,
  generatePersonas,
  generateRoadmap,
  generateMvp,
  generateProductVision,
  generateBusinessModel,
  generateMarketing,
} from "@/lib/ai/engine";
import { stageFromJourney, deriveStartupName } from "@/lib/ai/engine/helpers";
import type { StartupContext } from "@/lib/ai/context";
import { PLAN_LIMITS } from "@/lib/constants";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = onboardingSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first?.message ?? "Invalid input" }, { status: 422 });
  }

  const startups = await db.getStartups(user.id);
  if (startups.length >= PLAN_LIMITS[user.plan].startups) {
    return NextResponse.json(
      { error: `Your ${user.plan} plan allows ${PLAN_LIMITS[user.plan].startups} active startup${PLAN_LIMITS[user.plan].startups === 1 ? "" : "s"}. Upgrade to add more.`, plan: user.plan },
      { status: 403 }
    );
  }

  const input = parsed.data;
  const ts = tsNow();
  const name = deriveStartupName(input.idea);
  const initialStage = stageFromJourney(input.journeyStage);

  const startup = await db.createStartup({
    id: newId("startup"),
    userId: user.id,
    name,
    tagline: "",
    stage: initialStage,
    status: "active",
    createdAt: ts,
    updatedAt: ts,
  });

  const profile = {
    id: newId("profile"),
    startupId: startup.id,
    idea: input.idea,
    audience: input.audience,
    problem: input.problem,
    monetization: input.monetization,
    journeyStage: input.journeyStage,
    updatedAt: ts,
  };
  await db.setProfile(profile);
  await db.updateUser(user.id, { activeStartupId: startup.id });

  const ctx: StartupContext = { startup, profile };

  const [assessment, blueprint, market, competitors, personas, roadmap, mvp, vision, businessModel, marketing] =
    await Promise.all([
      computeAssessment(profile, initialStage, { inflated: true }),
      generateBlueprint(ctx),
      generateMarket(ctx),
      generateCompetitors(ctx),
      generatePersonas(ctx),
      generateRoadmap(ctx),
      generateMvp(ctx),
      generateProductVision(ctx),
      generateBusinessModel(ctx),
      generateMarketing(ctx),
    ]);

  await Promise.all([
    db.saveAssessment(assessment),
    db.saveBlueprint(blueprint),
    db.saveMarket(market),
    db.replaceCompetitors(startup.id, competitors),
    ...personas.map((p) => db.createPersona(p)),
    ...roadmap.map((t) => db.createRoadmapTask(t)),
    db.saveMvp(mvp),
    db.saveProductVision(vision),
    db.saveBusinessModel(businessModel),
    db.saveMarketing(marketing),
    db.createGeneration({
      id: newId("gen"),
      userId: user.id,
      startupId: startup.id,
      kind: "blueprint",
      provider: "forge-engine",
      model: "forge-engine-v1",
      createdAt: ts,
    }),
  ]);

  return NextResponse.json(
    {
      ok: true,
      startup: { id: startup.id, name: startup.name, stage: startup.stage },
      score: assessment.score.total,
      next: "/dashboard",
    },
    { status: 201 }
  );
}