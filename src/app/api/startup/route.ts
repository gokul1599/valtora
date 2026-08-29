import { NextResponse } from "next/server";
import { startupProfileSchema } from "@/lib/validation/schemas";
import { db, userOwnsStartup } from "@/lib/db";
import { generateBlueprintSections, computeAssessment, generateMarket, generateCompetitors, generatePersonas, generateRoadmap, generateMvp, generateProductVision, generateBusinessModel, generateMarketing } from "@/lib/ai/engine";
import { newId, now as tsNow } from "@/lib/db/store";
import { PLAN_LIMITS } from "@/lib/constants";
import type { StartupContext } from "@/lib/ai/context";
import { apiUser } from "@/lib/api-helpers";

export const runtime = "nodejs";

/** Create a brand-new startup from scratch. */
export async function POST(req: Request) {
  const { user, error } = await apiUser();
  if (error) return error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = startupProfileSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first?.message ?? "Invalid input" }, { status: 422 });
  }

  const startups = await db.getStartups(user.id);
  if (startups.length >= PLAN_LIMITS[user.plan].startups)
    return NextResponse.json({ error: "Startup limit reached for your plan" }, { status: 403 });

  const ts = tsNow();
  const startup = await db.createStartup({
    id: newId("startup"),
    userId: user.id,
    name: parsed.data.name,
    tagline: parsed.data.tagline,
    stage: "idea",
    status: "active",
    createdAt: ts,
    updatedAt: ts,
  });
  await db.updateUser(user.id, { activeStartupId: startup.id });

  const profile = {
    id: newId("profile"),
    startupId: startup.id,
    idea: "",
    audience: "",
    problem: "",
    monetization: "",
    journeyStage: "just-idea" as const,
    updatedAt: ts,
  };
  await db.setProfile(profile);
  const ctx: StartupContext = { startup, profile };
  await db.saveBlueprint({
    startupId: startup.id,
    version: 1,
    generatedAt: ts,
    sections: generateBlueprintSections(ctx),
  });
  await db.saveAssessment(computeAssessment(profile, "idea", { inflated: true }));
  await db.saveMarket(generateMarket(ctx));
  await db.replaceCompetitors(startup.id, generateCompetitors(ctx));
  await Promise.all(generatePersonas(ctx).map((p) => db.createPersona(p)));
  await Promise.all(generateRoadmap(ctx).map((t) => db.createRoadmapTask(t)));
  await db.saveMvp(generateMvp(ctx));
  await db.saveProductVision(generateProductVision(ctx));
  await db.saveBusinessModel(generateBusinessModel(ctx));
  await db.saveMarketing(generateMarketing(ctx));

  return NextResponse.json({ ok: true, startup: { id: startup.id, name: startup.name } }, { status: 201 });
}

/** Patch the startup name/tagline. */
export async function PUT(req: Request) {
  const { user, error } = await apiUser();
  if (error) return error;
  const body = (await req.json().catch(() => ({}))) as {
    startupId?: string;
    name?: string;
    tagline?: string;
  };
  if (!body.startupId || !(await userOwnsStartup(user.id, body.startupId)))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const patch: { name?: string; tagline?: string } = {};
  if (typeof body.name === "string" && body.name.trim()) patch.name = body.name.trim().slice(0, 120);
  if (typeof body.tagline === "string") patch.tagline = body.tagline.trim().slice(0, 200);
  await db.updateStartup(body.startupId, patch);
  return NextResponse.json({ ok: true });
}