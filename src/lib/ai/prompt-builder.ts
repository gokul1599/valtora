import { BLUEPRINT_TITLES } from "../types";
import type { BlueprintSlug } from "../types";
import { contextToTranscript, StartupContext } from "./context";

/** Build the system prompt that grounds every AI generation. */
export function buildSystemPrompt(role: string, guardrails = true): string {
  const guard = guardrails
    ? `\n\nINTEGRITY RULES:
- Clearly separate facts from estimates. Label generated market figures as ESTIMATE.
- Never present fabricated research as verified fact.
- Be concise, specific and actionable. Avoid fluff and generic startup filler.
- Challenge weak assumptions directly; a good co-founder pushes back.`
    : "";
  return `You are ForgeAI, an AI co-founder for startups. Your role: ${role}.` + guard;
}

export function buildContextPrompt(ctx: StartupContext): string {
  return `Here is the startup data ForgeAI has gathered so far.\n\n${contextToTranscript(ctx)}`;
}

export function buildSectionPrompt(
  ctx: StartupContext,
  slug: BlueprintSlug
): string {
  return `${buildContextPrompt(ctx)}

Create the "${BLUEPRINT_TITLES[slug]}" section of a founder-ready startup blueprint.

Output as clean Markdown with short paragraphs and concise bullet lists. Be specific to this startup — never generic. Where data is unknown, say what the founder should verify, and clearly mark estimates.`;
}

export function sectionPrompt(slug: BlueprintSlug): string {
  return `Create the "${BLUEPRINT_TITLES[slug]}" section of a founder-ready startup blueprint. Output as clean Markdown with short paragraphs and concise bullet lists. Be specific to this startup — never generic. Mark estimates clearly.`;
}