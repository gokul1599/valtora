import { PLAN_LIMITS } from "../constants";
import { countGenerationsThisMonth, getStartups } from "../db";
import type { User } from "../types";

export interface UsageStatus {
  used: number;
  limit: number;
  remaining: number;
  percent: number;
  ok: boolean;
  startups: number;
  startupLimit: number;
  canCreateStartup: boolean;
}

export async function getUsage(user: User): Promise<UsageStatus> {
  const used = await countGenerationsThisMonth(user.id);
  const startups = await getStartups(user.id);
  const limits = PLAN_LIMITS[user.plan];
  return {
    used,
    limit: limits.aiGenerationsPerMonth,
    remaining: Math.max(0, limits.aiGenerationsPerMonth - used),
    percent: Math.min(100, Math.round((used / limits.aiGenerationsPerMonth) * 100)),
    ok: used < limits.aiGenerationsPerMonth,
    startups: startups.length,
    startupLimit: limits.startups,
    canCreateStartup: startups.length < limits.startups,
  };
}