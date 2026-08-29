import type { StartupAssessment, StartupProfile, StartupStage } from "../../types";
import { stageFromJourney, willingnessSignal, keywords } from "./helpers";

/**
 * Transparent scoring model. Every axis is derived from explicit signals in
 * the founder's profile + collected research. Scores are labeled as
 * estimates — they guide prioritization, they never pretend to be science.
 */

function scoreAxis(
  label: string,
  base: number,
  modifiers: { amount: number; reason: string }[]
): { value: number; note: string } {
  let value = base;
  let note = label;
  for (const m of modifiers) {
    value += m.amount;
    if (m.reason !== label) note += ` · ${m.reason}`;
  }
  return { value: Math.max(0, Math.min(100, value)), note };
}

export function computeAssessment(
  profile: StartupProfile,
  stage: StartupStage,
  marketFn?: {
    tam?: number;
    som?: number;
    inflated?: boolean;
  },
  competitorCoverage?: { count: number; verified: number }
): StartupAssessment {
  const ideaLen = profile.idea.trim().length;
  const ideaWords = profile.idea.trim().split(/\s+/).length;
  const audienceSpecific = profile.audience.trim().length >= 40;
  const problemSpecific = profile.problem.trim().length >= 60;
  const monetizationSpecific = profile.monetization.trim().length >= 25;
  const willingness = willingnessSignal(profile.audience);
  const kws = keywords(`${profile.idea} ${profile.audience}`, 4);

  const problem = scoreAxis("Problem", 58, [
    { amount: problemSpecific ? 22 : 0, reason: problemSpecific ? "specific, concrete problem" : "problem is vague" },
    { amount: ideaWords >= 30 ? 10 : 0, reason: ideaWords >= 30 ? "detailed idea" : "thin description" },
    { amount: -10, reason: "no customer interviews yet" },
  ]);

  const market = scoreAxis("Market", 60, [
    { amount: marketFn?.tam && marketFn.tam > 1e9 ? 12 : 0, reason: marketFn?.tam && marketFn.tam > 1e9 ? "large served market" : "market size unverified" },
    { amount: marketFn?.inflated ? -15 : 0, reason: marketFn?.inflated ? "estimate may be optimistic; needs validation" : "estimates flagged for verification" },
    { amount: audienceSpecific ? 8 : 0, reason: audienceSpecific ? "clear segment to attack first" : "audience too broad to size" },
  ]);

  const competition = scoreAxis("Competition", 58, [
    { amount: competitorCoverage && competitorCoverage.count > 0 ? 12 : 0, reason: competitorCoverage && competitorCoverage.count > 0 ? `${competitorCoverage.count} competitors tracked` : "no competitor data yet" },
    { amount: competitorCoverage && competitorCoverage.verified > 0 ? 10 : 0, reason: competitorCoverage && competitorCoverage.verified > 0 ? "verified intelligence" : "competitor data unverified — treat as directional" },
  ]);

  const differentiation = scoreAxis("Differentiation", 52, [
    { amount: problemSpecific && ideaWords >= 25 ? 16 : 0, reason: problemSpecific && ideaWords >= 25 ? "clear angle on the problem" : "positioning not yet crisp" },
    { amount: -8, reason: "differentiation must be pressure-tested against incumbents" },
  ]);

  const monetization = scoreAxis("Monetization", 50, [
    { amount: monetizationSpecific ? 22 : 0, reason: monetizationSpecific ? "a real revenue path exists" : "no concrete revenue model" },
    { amount: Math.round(willingness.strength * 30 - 12), reason: willingness.note },
  ]);

  const feasibility = scoreAxis("Feasibility", 64, [
    { amount: stage === "beta" || stage === "launch" || stage === "growth" ? 18 : 0, reason: stage === "beta" || stage === "launch" || stage === "growth" ? "existing traction reduces risk" : "pre-MVP — build risk is high" },
    { amount: problemSpecific ? 6 : 0, reason: problemSpecific ? "problem is well-scoped" : "unclear scope" },
  ]);

  const growth = scoreAxis("Growth", 54, [
    { amount: marketFn?.som && marketFn.som > 1e7 ? 12 : 0, reason: marketFn?.som && marketFn.som > 1e7 ? "reachable beachhead" : "no distribution plan yet" },
    { amount: audienceSpecific ? 8 : 0, reason: audienceSpecific ? "segment suggests a repeatable channel" : "acquisition channel unknown" },
  ]);

  const breakdown = {
    problem: problem.value,
    market: market.value,
    competition: competition.value,
    differentiation: differentiation.value,
    monetization: monetization.value,
    feasibility: feasibility.value,
    growth: growth.value,
  };

  const total = Math.round(
    Object.values(breakdown).reduce((a, b) => a + b, 0) / 7
  );

  const grade =
    total >= 80 ? "Strong" :
    total >= 65 ? "Promising" :
    total >= 50 ? "Buildable" :
    total >= 35 ? "Fragile" : "Idea-stage";

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const opportunities: string[] = [];
  const risks: string[] = [];
  const nextActions: string[] = [];

  if (problemSimple(problem.value)) strengths.push("Well-defined problem worth solving");
  else weaknesses.push(problemSimple2(problem.value));
  if (marketSimple(market.value)) strengths.push("Large addressable space");
  if (monetization.value >= 60) strengths.push("Concrete monetization engine");
  if (monetization.value < 45) weaknesses.push("Monetization is the weakest link — validate willingness to pay early");
  if (feasibility.value < 60 && stage === "idea")
    weaknesses.push("No build traction yet — de-risk with a thrown-away prototype");
  if (stage === "growth" || stage === "launch") strengths.push("Has product-market traction");
  if (competition.value < 55)
    risks.push("Competitor response could compress your wedge before traction");
  opportunities.push(
    `Attack the "${kws[0] ?? "core"}" use case before generalists move in`,
    `Talk to ${firstSegment(profile.audience)} early via a paid-interest landing page`
  );
  risks.push(
    "Sizing is estimated, not verified — a 10-person interview loop would cut this risk substantially"
  );
  nextActions.push("Run 5–7 problem interviews with the target segment", "Ship a single-feature prototype to a small group this week");

  return {
    startupId: profile.startupId,
    score: { total, breakdown, grade, isEstimate: true },
    strengths,
    weaknesses,
    opportunities,
    risks,
    nextActions,
    stage: stageFromJourney(profile.journeyStage),
    generatedAt: new Date().toISOString(),
  };
}

function problemSimple(v: number): boolean {
  return v >= 62;
}
function problemSimple2(v: number): string {
  return v < 50 ? "Problem needs sharpening — it risks being a solution looking for a problem" : "Problem is described but not validated end-to-end";
}
function marketSimple(v: number): boolean {
  return v >= 68;
}
function firstSegment(audience: string): string {
  const seg = audience.trim().split(/[.,;]/)[0].trim();
  return seg.length > 60 ? seg.slice(0, 60) + "…" : seg || "your target segment";
}