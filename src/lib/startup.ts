import "server-only";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

type JsonValue =
  | { [key: string]: JsonValue }
  | JsonValue[]
  | string
  | number
  | boolean;

function toJson(value: unknown): JsonValue {
  if (value === null || typeof value === "undefined") {
    return "" as unknown as JsonValue;
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value as string | number | boolean;
  }
  if (Array.isArray(value)) {
    return value
      .map(toJson)
      .filter((v) => v !== "");
  }
  if (typeof value === "object") {
    const result: { [key: string]: JsonValue } = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      result[k] = toJson(v);
    }
    return result;
  }
  return String(value);
}

export interface StartupContext {
  user: {
    id: string;
    name: string;
    email: string;
    plan: string;
  };
  settings: {
    founderMode: boolean;
  };
  startup: {
    id: string;
    name: string;
    idea: string;
    stage: string;
    score: number;
  } | null;
  sections: Record<string, unknown>;
}

export async function requireDashboardData(): Promise<StartupContext> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: { startups: { orderBy: { updatedAt: "desc" } } },
  });

  if (!user) throw new Error("UNAUTHORIZED");

  const startup = user.startups[0] ?? null;

  const sections: Record<string, unknown> = {};
  if (startup) {
    const rows = await db.startupSection.findMany({
      where: { startupId: startup.id },
    });
    for (const row of rows) {
      sections[row.key] = row.data;
    }
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan,
    },
    settings: { founderMode: false },
    startup: startup
      ? {
          id: startup.id,
          name: startup.name,
          idea: startup.idea,
          stage: startup.stage,
          score: startup.score,
        }
      : null,
    sections,
  };
}

export async function saveSection(
  startupId: string,
  key: string,
  title: string,
  data: unknown,
  source: "ai" | "user" = "user",
) {
  const existing = await db.startupSection.findUnique({
    where: { startupId_key: { startupId, key } },
  });

  if (existing) {
    return db.startupSection.update({
      where: { id: existing.id },
      data: { data: toJson(data), source, status: "complete" },
    });
  }

  return db.startupSection.create({
    data: { startupId, key, title, data: toJson(data), source, status: "complete" },
  });
}

export async function getSection(
  startupId: string,
  key: string,
): Promise<unknown | null> {
  const row = await db.startupSection.findUnique({
    where: { startupId_key: { startupId, key } },
  });
  return row?.data ?? null;
}

export async function countGenerationsThisMonth(userId: string): Promise<number> {
  const month = new Date().toISOString().slice(0, 7);
  const usage = await db.usage.findUnique({
    where: { userId_month: { userId, month } },
  });
  return usage?.generations ?? 0;
}

export async function recordGeneration(params: {
  userId: string;
  startupId?: string;
  action: string;
  status?: string;
  error?: string;
  tokensIn?: number;
  tokensOut?: number;
  durationMs?: number;
}) {
  const month = new Date().toISOString().slice(0, 7);

  await db.$transaction([
    db.aiGeneration.create({ data: params }),
    db.usage.upsert({
      where: { userId_month: { userId: params.userId, month } },
      create: {
        userId: params.userId,
        month,
        generations: 1,
        tokensIn: params.tokensIn ?? 0,
        tokensOut: params.tokensOut ?? 0,
      },
      update: {
        generations: { increment: 1 },
        tokensIn: { increment: params.tokensIn ?? 0 },
        tokensOut: { increment: params.tokensOut ?? 0 },
      },
    }),
  ]);
}

export function computeScore(sections: Record<string, unknown>): number {
  // Transparent six-dimension methodology, each dimension 0–100 weighted evenly.
  let score = 0;
  const weights = 7;

  const has = (key: string, field?: string) => {
    const value = sections[key];
    if (!value) return false;
    if (field && typeof value === "object" && value !== null) {
      return Boolean((value as Record<string, unknown>)[field]);
    }
    return true;
  };

  const len = (key: string, field?: string) => {
    const value = sections[key];
    if (!value) return 0;
    if (field && typeof value === "object" && value !== null) {
      const v = (value as Record<string, unknown>)[field];
      return Array.isArray(v) ? v.length : typeof v === "string" ? v.length : 0;
    }
    return Array.isArray(value) ? value.length : typeof value === "string" ? value.length : 0;
  };

  // Problem strength
  let d = 0;
  if (has("problem", "coreProblem")) d += 40;
  if (has("problem", "existingSolutions") && len("problem", "existingSolutions") >= 2) d += 30;
  if (has("problem", "whyNow")) d += 30;
  score += d;

  // Market opportunity
  d = 0;
  if (has("market", "tam")) d += 30;
  if (has("market", "sam")) d += 35;
  if (has("market", "som")) d += 35;
  score += d;

  // Customer clarity
  d = 0;
  if (has("targetCustomers", "primary")) d += 50;
  if (has("targetCustomers", "earlyAdopters")) d += 25;
  if (len("customers") >= 1) d += 25;
  score += d;

  // Differentiation
  d = 0;
  if (len("competitors") >= 2) d += 50;
  if (has("differentiation", "strategy")) d += 50;
  score += d;

  // Monetization
  d = 0;
  if (len("businessModel", "revenueStreams") >= 1) d += 40;
  if (len("pricing") >= 1) d += 60;
  score += d;

  // Product readiness
  d = 0;
  if (len("product", "featureList") >= 3) d += 30;
  if (has("product", "vision")) d += 20;
  if (len("mvp", "coreFeatures") >= 2) d += 30;
  if (has("technology", "frontend")) d += 10;
  if (has("technology", "backend")) d += 10;
  score += d;

  // Execution readiness
  d = 0;
  if (len("roadmap", "phases") >= 2) d += 40;
  if (has("marketing", "positioning")) d += 30;
  if (len("launch") > 0) d += 30;
  score += d;

  return Math.max(0, Math.min(100, Math.round(score / weights)));
}