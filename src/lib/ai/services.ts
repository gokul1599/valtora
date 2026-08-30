import "server-only";

import { createProvider } from "@/lib/ai/provider";
import type { ZodType } from "zod";
import {
  blueprintSchema,
  type Blueprint,
  visionSchema,
  problemSchema,
  marketAnalysisSchema,
  competitorAnalysesSchema,
  personasSchema,
  productSchema,
  businessModelSchema,
  pricingStrategySchema,
  mvpPlanSchema,
  techArchitectureSchema,
  roadmapPlanSchema,
  marketingPlanSchema,
  launchPlanSchema,
} from "@/lib/ai/schemas";
import { ideateSystemPrompt } from "@/lib/ai/prompts";

export const provider = createProvider();

export const sectionSchemas: Record<string, ZodType> = {
  vision: visionSchema,
  problem: problemSchema,
  market: marketAnalysisSchema,
  competitors: competitorAnalysesSchema,
  customers: personasSchema,
  businessModel: businessModelSchema,
  pricing: pricingStrategySchema,
  product: productSchema,
  mvp: mvpPlanSchema,
  technology: techArchitectureSchema,
  roadmap: roadmapPlanSchema,
  marketing: marketingPlanSchema,
  launch: launchPlanSchema,
};

interface OnboardingInput {
  name: string;
  idea: string;
  audience: string;
  problem: string;
  monetization: string;
  stage: string;
  goal: string;
}

export async function generateBlueprint(
  input: OnboardingInput,
): Promise<{ data: Blueprint; tokensIn: number; tokensOut: number; durationMs: number }> {
  const context = [
    `Startup name: ${input.name}`,
    `Core idea: ${input.idea}`,
    `Target audience: ${input.audience}`,
    `Problem solved: ${input.problem}`,
    `Monetization: ${input.monetization}`,
    `Current stage: ${input.stage}`,
    `90-day goal: ${input.goal}`,
  ].join("\n");

  const result = await provider.generateStructured<Blueprint>({
    system: ideateSystemPrompt(),
    zodSchema: blueprintSchema,
    prompt: `${context}

Generate the COMPLETE startup blueprint as strict JSON with this exact shape:
{
  "vision": { "mission": "", "summary": "", "northStar": "", "values": [] },
  "problem": { "coreProblem": "", "whoFeelsIt": "", "painMagnitude": "", "existingSolutions": [], "whyNow": "" },
  "targetCustomers": { "primary": "", "secondary": [], "earlyAdopters": "" },
  "valueProposition": { "promise": "", "differentiators": [], "whyBetter": "" },
  "market": { "marketDefinition": "", "tam": "", "sam": "", "som": "", "growthDrivers": [], "marketChallenges": [] },
  "competitors": [{ "name": "", "description": "", "strengths": [], "weaknesses": [], "positioning": "", "opportunity": "" }],
  "differentiation": { "strategy": "", "defensibility": "", "moat": "" },
  "businessModel": { "customerSegments": [], "valueProposition": "", "channels": [], "customerRelationships": "", "revenueStreams": [{ "name": "", "source": "" }], "keyResources": [], "keyActivities": [], "keyPartnerships": [], "costStructure": [] },
  "pricing": [{ "name": "", "targetCustomer": "", "priceHypothesis": "", "features": [], "valueJustification": "", "upgradeTrigger": "" }],
  "product": { "vision": "", "positioning": "", "primaryUseCases": [], "featureList": [{ "name": "", "description": "", "priority": "medium", "status": "proposed", "effort": 1, "impact": 1, "confidence": 3 }] },
  "mvp": { "objective": "", "coreFeatures": [], "excludedFeatures": [], "userStories": [], "requiredScreens": [], "dependencies": [], "developmentTasks": [], "successMetrics": [] },
  "technology": { "frontend": "", "backend": "", "database": "", "authentication": "", "ai": "", "integrations": [], "infrastructure": "", "deployment": "", "risks": [] },
  "roadmap": { "phases": [{ "stage": "", "focus": "", "tasks": [], "duration": "" }] },
  "marketing": { "positioning": "", "messaging": "", "tagline": "", "icp": "", "acquisitionChannels": [], "contentStrategy": [], "seoIdeas": [], "launchCampaign": [] },
  "launch": { "preLaunch": [], "launchWeek": [], "postLaunch": [], "metrics": [], "risks": [] },
  "risks": [{ "risk": "", "severity": "medium", "likelihood": "medium", "mitigation": "" }],
  "nextActions": []
}

Fill every field with reasoned, specific, non-generic content based on the startup context.

Pricing and market size must be explicitly framed as hypotheses/estimates. Clearly distinguish assumption from analysis. Return ONLY JSON.`,
    temperature: 0.4,
    maxTokens: 6000,
  });

  return result;
}

const SHAPEMAP: Record<string, string> = {
  vision: `{ "vision": { "mission": "", "summary": "", "northStar": "", "values": [] } }`,
  problem: `{ "problem": { "coreProblem": "", "whoFeelsIt": "", "painMagnitude": "", "existingSolutions": [], "whyNow": "" } }`,
  market: `{ "marketDefinition": "", "customerSegments": [], "tam": "", "sam": "", "som": "", "growthDrivers": [], "challenges": [], "opportunities": [], "verifiedFacts": [], "assumptions": [] }`,
  competitors: `[ { "name": "", "website": "", "description": "", "targetCustomers": "", "pricing": "", "strengths": [], "weaknesses": [], "positioning": "", "differentiationOpportunity": "" } ]`,
  customers: `[ { "name": "", "role": "", "industry": "", "companySize": "", "goals": [], "painPoints": [], "existingAlternatives": [], "buyingTriggers": [], "objections": [], "willingnessToPay": "", "acquisitionChannels": [] } ]`,
  businessModel: `{ "customerSegments": [], "valueProposition": "", "channels": [], "customerRelationships": "", "revenueStreams": [], "keyResources": [], "keyActivities": [], "keyPartnerships": [], "costStructure": [] }`,
  pricing: `[ { "name": "", "targetCustomer": "", "priceHypothesis": "", "features": [], "valueJustification": "", "upgradeTrigger": "" } ]`,
  product: `{ "vision": "", "positioning": "", "primaryUseCases": [], "featureList": [{ "name": "", "description": "", "priority": "medium", "status": "proposed", "effort": 1, "impact": 1, "confidence": 3 }] }`,
  mvp: `{ "objective": "", "coreFeatures": [], "excludedFeatures": [], "userStories": [], "requiredScreens": [], "apiRequirements": [], "databaseRequirements": [], "authRequirements": "", "integrations": [], "developmentTasks": [] }`,
  technology: `{ "frontend": "", "backend": "", "database": "", "authentication": "", "storage": "", "ai": "", "integrations": [], "infrastructure": "", "deployment": "", "diagram": "" }`,
  roadmap: `{ "phases": [{ "stage": "", "focus": "", "tasks": [], "duration": "" }] }`,
  marketing: `{ "positioning": "", "messaging": "", "tagline": "", "icp": "", "acquisitionChannels": [], "contentStrategy": [], "seoIdeas": [], "socialStrategy": [], "emailCampaigns": [], "launchCampaign": [] }`,
  launch: `{ "product": [], "business": [], "marketing": [], "launch": [], "completionCriteria": [] }`,
};

export async function regenerateSection(
  key: string,
  context: {
    startup: { name: string; idea: string; stage: string };
    existingSections: string;
  },
): Promise<{ data: unknown; tokensIn: number; tokensOut: number; durationMs: number }> {
  const shape = SHAPEMAP[key];
  const schema = sectionSchemas[key];
  if (!shape || !schema) throw new Error(`Unknown section: ${key}`);

  const result = await provider.generateStructured<unknown>({
    system: ideateSystemPrompt(),
    zodSchema: schema,
    prompt: `Startup: ${context.startup.name}
Idea: ${context.startup.idea}
Stage: ${context.startup.stage}

Existing startup knowledge:
${context.existingSections}

Regenerate ONLY this section as strict JSON with this exact shape: ${shape}

Make it specific, non-generic, and consistent with the existing knowledge. Return ONLY the JSON object/array (do not wrap in extra keys).`,
    temperature: 0.4,
    maxTokens: 2500,
  });

  return result;
}