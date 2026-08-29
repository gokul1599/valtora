import type { AiActionType, StartupContext } from "../types";
import { newId, now as tsNow } from "../db/store";

/**
 * Applies an approved AI action to the startup workspace.
 * Every write route goes through ownership checks upstream in the API.
 */

export interface ActionApplication {
  ok: boolean;
  message: string;
}

export async function applyAction(
  type: AiActionType,
  payload: Record<string, unknown>,
  ctx: StartupContext
): Promise<ActionApplication> {
  switch (type) {
    case "create-feature": {
      const { createFeature } = await import("../db");
      const name =
        String(payload.name ?? "").trim() || `New feature ${new Date().toLocaleDateString()}`;
      await createFeature({
        id: newId("feat"),
        startupId: ctx.startup.id,
        name,
        description: String(payload.description ?? "").trim() || "Drafted by the AI co-founder.",
        category: (payload.category as any) ?? "should",
        status: "planned",
        createdAt: tsNow(),
      });
      return { ok: true, message: `Added "${name}" to the feature backlog.` };
    }

    case "delete-feature": {
      const { getFeatures, deleteFeature } = await import("../db");
      const name = String(payload.name ?? "").toLowerCase();
      const matches = await getFeatures(ctx.startup.id);
      const target = name
        ? matches.find((f) => f.name.toLowerCase().includes(name))
        : matches[matches.length - 1];
      if (!target)
        return { ok: false, message: "No matching feature found to delete." };
      await deleteFeature(target.id);
      return { ok: true, message: `Removed "${target.name}" from the backlog.` };
    }

    case "create-task":
    case "change-priority":
    case "modify-roadmap": {
      const { createRoadmapTask, getRoadmap, updateRoadmapTask } = await import("../db");
      const title = String(payload.title ?? "").trim();
      const phase = (payload.phase as any) ?? "validation";
      const priority = (payload.priority as any) ?? "med";
      if (title) {
        const tasks = await getRoadmap(ctx.startup.id);
        await createRoadmapTask({
          id: newId("task"),
          startupId: ctx.startup.id,
          phase,
          title,
          description: String(payload.description ?? "").trim(),
          status: "todo",
          priority,
          order: tasks.length,
          createdAt: tsNow(),
        });
        return { ok: true, message: `Added "${title}" to ${phase} phase.` };
      }
      const tasks = await getRoadmap(ctx.startup.id);
      const target =
        typeof payload.taskId === "string"
          ? tasks.find((t) => t.id === payload.taskId)
          : tasks.find((t) => t.title.toLowerCase().includes(String(payload.name ?? "").toLowerCase()));
      if (target) {
        const patch: Record<string, unknown> = {
          phase: (payload.phase as any) ?? target.phase,
          priority: (payload.priority as any) ?? target.priority,
          status: (payload.status as any) ?? target.status,
        };
        await updateRoadmapTask(target.id, patch);
        return { ok: true, message: `Updated "${target.title}".` };
      }
      return { ok: false, message: "No roadmap task matched that request." };
    }

    case "create-persona": {
      const { createPersona } = await import("../db");
      const name = String(payload.name ?? "").trim() || "New persona";
      await createPersona({
        id: newId("persona"),
        startupId: ctx.startup.id,
        name,
        role: String(payload.role ?? "").trim() || ctx.profile.audience.slice(0, 80),
        demographics: String(payload.demographics ?? "").trim(),
        goals: String(payload.goals ?? "").trim(),
        painPoints: String(payload.painPoints ?? "").trim(),
        quote: String(payload.quote ?? "").trim(),
        channel: String(payload.channel ?? "").trim(),
        priority: "primary",
        createdAt: tsNow(),
      });
      return { ok: true, message: `Created persona "${name}".` };
    }

    case "update-business-model": {
      const { saveBusinessModel } = await import("../db");
      await saveBusinessModel({
        startupId: ctx.startup.id,
        model: String(payload.model ?? ctx.businessModel?.model ?? "").trim(),
        revenueStreams: (payload.revenueStreams as string[]) ?? ctx.businessModel?.revenueStreams ?? [],
        pricingTiers: (payload.pricingTiers as any[]) ?? ctx.businessModel?.pricingTiers ?? [],
        unitEconomics: String(payload.unitEconomics ?? ctx.businessModel?.unitEconomics ?? "").trim(),
        notes: String(payload.notes ?? ctx.businessModel?.notes ?? "").trim(),
        updatedAt: tsNow(),
      });
      return { ok: true, message: "Business model updated." };
    }

    case "generate-pricing": {
      const { generateBusinessModel } = await import("./engine/marketing");
      const { saveBusinessModel } = await import("../db");
      await saveBusinessModel({ ...generateBusinessModel(ctx), updatedAt: tsNow() });
      return { ok: true, message: "A three-tier pricing model was written into the business model." };
    }

    case "generate-launch-plan": {
      const { generateLaunchPlan } = await import("./engine/launch");
      const { replaceLaunch } = await import("../db");
      await replaceLaunch(ctx.startup.id, generateLaunchPlan(ctx));
      return { ok: true, message: "Launch checklist generated with 12 items." };
    }

    default:
      return { ok: false, message: "Unknown action type." };
  }
}