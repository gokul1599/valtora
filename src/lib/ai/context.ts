import type {
  AiMessage,
  BusinessModel,
  Competitor,
  Feature,
  MarketResearch,
  MarketingPlan,
  Persona,
  ProductVision,
  RoadmapTask,
  Startup,
  StartupAssessment,
  StartupProfile,
} from "../types";

/** Everything ForgeAI knows about a startup — the AI Co-Founder's memory. */
export interface StartupContext {
  startup: Startup;
  profile: StartupProfile;
  assessment?: StartupAssessment | null;
  competitors?: Competitor[];
  market?: MarketResearch | null;
  features?: Feature[];
  personas?: Persona[];
  productVision?: ProductVision | null;
  businessModel?: BusinessModel | null;
  roadmap?: RoadmapTask[];
  marketing?: MarketingPlan | null;
  mvpRecord?: import("../types").Mvp | null;
  technical?: import("../types").TechnicalPlan | null;
  launch?: import("../types").LaunchItem[] | null;
  blueprintVersion?: number;
}

export function summarizeContext(ctx: StartupContext): {
  name: string;
  idea: string;
  audience: string;
  problem: string;
  monetization: string;
  stage: string;
  hasCompetitors: boolean;
  hasMarket: boolean;
  hasFeatures: boolean;
  hasPersonas: boolean;
  hasRoadmap: boolean;
  hasBusinessModel: boolean;
  score?: number;
} {
  return {
    name: ctx.startup.name,
    idea: ctx.profile.idea,
    audience: ctx.profile.audience,
    problem: ctx.profile.problem,
    monetization: ctx.profile.monetization,
    stage: ctx.startup.stage,
    hasCompetitors: (ctx.competitors?.length ?? 0) > 0,
    hasMarket: !!ctx.market,
    hasFeatures: (ctx.features?.length ?? 0) > 0,
    hasPersonas: (ctx.personas?.length ?? 0) > 0,
    hasRoadmap: (ctx.roadmap?.length ?? 0) > 0,
    hasBusinessModel: !!ctx.businessModel,
    score: ctx.assessment?.score.total,
  };
}

export function contextToTranscript(ctx: StartupContext): string {
  const parts: string[] = [`STARTUP: ${ctx.startup.name}`, `STAGE: ${ctx.startup.stage}`];
  parts.push(`WHAT THEY ARE BUILDING:\n${ctx.profile.idea}`);
  parts.push(`BUILT FOR:\n${ctx.profile.audience}`);
  parts.push(`PROBLEM IT SOLVES:\n${ctx.profile.problem}`);
  parts.push(`HOW IT MAKES MONEY:\n${ctx.profile.monetization}`);
  if (ctx.assessment) {
    parts.push(`SCORE: ${ctx.assessment.score.total}/100 (${ctx.assessment.score.grade})`);
    parts.push(`STRENGTHS: ${ctx.assessment.strengths.join("; ")}`);
    parts.push(`WEAKNESSES: ${ctx.assessment.weaknesses.join("; ")}`);
    parts.push(`RISKS: ${ctx.assessment.risks.join("; ")}`);
  }
  if (ctx.market) {
    parts.push(
      `MARKET (${ctx.market.verified ? "verified" : "estimate"}): TAM $${ctx.market.tam}, ` +
        `SAM $${ctx.market.sam}, SOM $${ctx.market.som}. Trends: ${ctx.market.trends.join("; ")}`
    );
  }
  if (ctx.competitors?.length) {
    parts.push(
      "COMPETITORS:\n" +
        ctx.competitors
          .map(
            (c) =>
              `- ${c.company} (${c.product}): pricing ${c.pricing}. Strengths: ${c.strengths.join(", ")}. Weaknesses: ${c.weaknesses.join(", ")}`
          )
          .join("\n")
    );
  }
  if (ctx.personas?.length) {
    parts.push(
      "CUSTOMERS:\n" + ctx.personas.map((p) => `- ${p.name}, ${p.role}`).join("\n")
    );
  }
  if (ctx.features?.length) {
    parts.push(
      "FEATURES:\n" +
        ctx.features
          .map((f) => `- [${f.category}] ${f.name} (${f.status})`)
          .join("\n")
    );
  }
  if (ctx.productVision) {
    parts.push(`PRODUCT VISION: ${ctx.productVision.vision}`);
  }
  if (ctx.businessModel) {
    parts.push(
      `BUSINESS MODEL: ${ctx.businessModel.model}. Streams: ${ctx.businessModel.revenueStreams.join(", ")}`
    );
  }
  if (ctx.roadmap?.length) {
    parts.push(
      "ROADMAP:\n" +
        ctx.roadmap
          .map((t) => `- [${t.phase}] ${t.title} — ${t.status}`)
          .join("\n")
    );
  }
  if (ctx.marketing) {
    parts.push(`POSITIONING: ${ctx.marketing.positioning}`);
  }
  return parts.join("\n\n");
}

export function recentMessages(messages: AiMessage[], window = 12): string {
  return messages
    .slice(-window)
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n\n");
}