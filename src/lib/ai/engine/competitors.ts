import type { Competitor, StartupContext } from "../../types";
import { now as tsNow, newId } from "../../db/store";
import { keywords } from "./helpers";

/**
 * Deterministic competitor intelligence.
 *
 * These profiles are clearly provisional: the engine infers realistic
 * archetypes from the problem statement so the workspace is immediately
 * usable. Every row is flagged `verified: false` and must be either edited
 * or verified by the founder (or replaced by real research later).
 */
export function generateCompetitors(ctx: StartupContext): Competitor[] {
  const { profile } = ctx;
  const kws = keywords(profile.idea, 3);
  const wedge = kws[0] ?? "this use case";
  const ts = tsNow();

  const doItYourself: Competitor = {
    id: newId("comp"),
    startupId: ctx.startup.id,
    company: "DIY / manual workaround",
    product: "Spreadsheets, email chains and tribal knowledge",
    targetUsers: profile.audience.trim().slice(0, 90) || "the target segment",
    pricing: "Free in cash, expensive in time and errors",
    strengths: [
      "Zero switching cost",
      "Feels like 'under control' until it isn't",
      "No procurement or approvals needed",
    ],
    weaknesses: [
      "Does not scale with workload",
      "Errors compound with every person added",
      "No owner — quality is whatever the busiest person does",
    ],
    differentiation: `${ctx.startup.name} removes the manual work entirely instead of organizing it in another spreadsheet.`,
    verified: false,
    createdAt: ts,
  };

  const generalist: Competitor = {
    id: newId("comp"),
    startupId: ctx.startup.id,
    company: "Generalist platform",
    product: "A broad suite that hand-waves a shallow version of the need",
    targetUsers: "Anyone who fits a wide category, nobody in particular",
    pricing: "Monthly subscription with per-seat fees",
    strengths: [
      "Lots of features (breadth)", 
      "Large brand and existing user base",
      "Integrations already built",
    ],
    weaknesses: [
      "The specific job is done shallowly",
      "Slow to change: your wedge is a ticket in their roadmap",
      "Subscription fatigue — buyers are subtracting tools, not adding",
    ],
    differentiation: `Generalists win on breadth and lose on depth. ${ctx.startup.name} wins the ${wedge} job they will never finish.`,
    verified: false,
    createdAt: ts,
  };

  const emerging: Competitor = {
    id: newId("comp"),
    startupId: ctx.startup.id,
    company: "Indirect substitute",
    product: "A related tool the segment already pays for",
    targetUsers: profile.audience.trim().slice(0, 90) || "the same target segment",
    pricing: "Per-seat SaaS, often annual",
    strengths: [
      "Already installed in the segment's workflow",
      "Trusted relationship with buyers",
      "Data already lives inside their account",
    ],
    weaknesses: [
      "Owns a different job — this one is scope creep for them",
      "Will not be measured on this outcome",
      "Migration of a separate concern makes them a weak default",
    ],
    differentiation: `They are not the incumbent of this job; ${ctx.startup.name} can own it the moment it works well.`,
    verified: false,
    createdAt: ts,
  };

  return [doItYourself, generalist, emerging];
}

export function competitorMatrix(competitors: Competitor[]): {
  headers: string[];
  rows: Competitor[];
} {
  return { headers: ["Company", "Product", "Pricing", "Strengths", "Weaknesses", "Differentiation"], rows: competitors };
}