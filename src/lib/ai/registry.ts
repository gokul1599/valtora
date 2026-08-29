import type { AiGenerationKind, StartupContext } from "../types";
import { generateWithProvider, getActiveProvider } from "./provider";
import { buildContextPrompt, buildSystemPrompt, buildSectionPrompt, sectionPrompt } from "./prompt-builder";
import { generateMarket } from "./engine/market";
import { generateCompetitors } from "./engine/competitors";
import { generatePersonas } from "./engine/personas";
import { generateMvp } from "./engine/mvp";
import { generateProductVision, generateUserStories, seedFeatures } from "./engine/product";
import { generateBusinessModel, generateMarketing } from "./engine/marketing";
import { generateLaunchPlan, generateRoadmap } from "./engine/launch";
import { generateTechnicalPlan } from "./engine/technical";
import { generateBlueprintSections } from "./engine/blueprint";
import { computeAssessment } from "./engine/score";
import { buildFallbackReply } from "./engine/chat";
import type { BlueprintSlug } from "../types";

export interface GenerationRequest {
  kind: AiGenerationKind;
  ctx: StartupContext;
  section?: BlueprintSlug;
  message?: string;
}

const provider = () => getActiveProvider();

/** Route a generation request to a provider, falling back to the engine. */
export async function generate(request: GenerationRequest): Promise<unknown> {
  const { kind, ctx } = request;
  const engine = engineFor(kind, request);

  if (kind === "chat") return engine;

  const system = buildSystemPrompt("generate structured, founder-ready startup intelligence");
  const user = buildContextPrompt(ctx);

  const mapped = await generateWithProvider(provider(), { system, user, kind, schema: { description: "json" } }, async () => engine);
  return mapped.content;
}

export async function generateSection(ctx: StartupContext, slug: BlueprintSlug): Promise<string> {
  // Prefer the local engine for deterministic, editable Markdown sections.
  const section = generateBlueprintSections(ctx).find((s) => s.slug === slug);
  const engineContent = section?.content ?? "";
  const active = provider();
  if (!active) return engineContent;
  try {
    const res = await generateWithProvider(
      active,
      {
        system: buildSystemPrompt("write one startup blueprint section"),
        user: buildSectionPrompt(ctx, slug),
        kind: "blueprint-section",
      },
      async () => engineContent
    );
    return String(res.content);
  } catch {
    return engineContent;
  }
}

function engineFor(kind: AiGenerationKind, request: GenerationRequest): unknown {
  const ctx = request.ctx;
  switch (kind) {
    case "blueprint":
      return generateBlueprintSections(ctx);
    case "blueprint-section":
      return request.section
        ? generateBlueprintSections(ctx).find((s) => s.slug === request.section)?.content ?? ""
        : "";
    case "market":
      return generateMarket(ctx);
    case "competitors":
      return generateCompetitors(ctx);
    case "personas":
      return generatePersonas(ctx);
    case "mvp":
      return generateMvp(ctx);
    case "product-vision":
      return { vision: generateProductVision(ctx), stories: generateUserStories(ctx), features: seedFeatures(ctx) };
    case "business-model":
      return generateBusinessModel(ctx);
    case "pricing":
      return { pricing: generateBusinessModel(ctx).pricingTiers };
    case "marketing":
      return generateMarketing(ctx);
    case "launch":
      return generateLaunchPlan(ctx);
    case "roadmap":
      return generateRoadmap(ctx);
    case "technical":
      return generateTechnicalPlan(ctx);
    case "chat":
      return buildFallbackReply(ctx, (request as any).message ?? "");
    default:
      return null;
  }
}

export function assess(ctx: StartupContext) {
  return computeAssessment(
    ctx.profile,
    ctx.startup.stage,
    ctx.market ? { tam: ctx.market.tam, som: ctx.market.som, inflated: !ctx.market.verified } : undefined,
    ctx.competitors
      ? { count: ctx.competitors.length, verified: ctx.competitors.filter((c) => c.verified).length }
      : undefined
  );
}