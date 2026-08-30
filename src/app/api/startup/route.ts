import { NextRequest } from "next/server";
import { requireUser } from "@/lib/api-helpers";
import { PLAN_LIMITS, type PlanKey } from "@/lib/constants";
import { db } from "@/lib/db";

export async function GET() {
  const user = await requireUser();
  const startups = await db.startup.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      stage: true,
      score: true,
      updatedAt: true,
    },
  });
  return Response.json({ startups });
}

export async function POST(request: NextRequest) {
  const user = await requireUser();

  interface StartupBody {
    name?: string;
    idea?: string;
    audience?: string;
    problem?: string;
    monetization?: string;
    stage?: string;
    goal?: string;
    email?: string;
    startupId?: string;
  }
  let body: StartupBody = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  if (!name) {
    return Response.json({ error: "Startup name is required" }, { status: 400 });
  }

  if (body.startupId) {
    const existing = await db.startup.findFirst({
      where: { id: body.startupId, userId: user.id },
    });
    if (!existing) {
      return Response.json({ error: "Startup not found" }, { status: 404 });
    }
    const updated = await db.startup.update({
      where: { id: existing.id },
      data: {
        name,
        idea: body.idea ?? existing.idea,
        audience: body.audience ?? existing.audience,
        problem: body.problem ?? existing.problem,
        monetization: body.monetization ?? existing.monetization,
        stage: body.stage ?? existing.stage,
        goal: body.goal ?? existing.goal,
        email: body.email ?? user.email,
      },
    });
    return Response.json({ ok: true, startup: { id: updated.id, name: updated.name } });
  }

  const planKey: PlanKey = (user.plan as PlanKey) ?? "free";
  const limits = PLAN_LIMITS[planKey];
  const count = await db.startup.count({ where: { userId: user.id } });
  if (count >= limits.startups) {
    return Response.json(
      {
        error: `Your ${limits.label} plan allows ${limits.startups} startup(s). Upgrade to add more.`,
      },
      { status: 403 },
    );
  }

  const startup = await db.startup.create({
    data: {
      userId: user.id,
      name,
      idea: body.idea ?? "",
      audience: body.audience ?? null,
      problem: body.problem ?? null,
      monetization: body.monetization ?? null,
      stage: body.stage ?? "idea",
      goal: body.goal ?? null,
      email: body.email ?? user.email,
    },
  });

  return Response.json({ ok: true, startup: { id: startup.id, name: startup.name } });
}