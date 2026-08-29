import type { LaunchItem, RoadmapTask, StartupContext } from "../../types";
import { newId, now as tsNow } from "../../db/store";

export function generateLaunchPlan(ctx: StartupContext): LaunchItem[] {
  const ts = tsNow();
  const items: [string, string, string, string][] = [
    ["product-ready", "Product ready", "The core job works end-to-end without embarrassment, for the chosen segment.", "Product"],
    ["landing", "Landing page", "Problem → promise → CTA. Loads fast, converts on mobile, analytics installed.", "Marketing"],
    ["pricing", "Pricing", "Paid tier is live and the numbers are validated with a few interviews.", "Business"],
    ["analytics", "Analytics", "Activation and retention events wired; a dashboard exists that the founder actually checks.", "Operations"],
    ["auth", "Authentication", "Signup/login work; password reset works; sessions are secure.", "Product"],
    ["payment", "Payment", "Checkout works in the chosen region; invoices or receipts are issued.", "Business"],
    ["docs", "Documentation", "Getting-started doc exists so support doesn't become a bottleneck.", "Product"],
    ["beta", "Beta users", "5–10 pilot users are actively using the product before the announcement.", "G&A"],
    ["feedback", "Feedback system", "In-app or 1:1 feedback loop so the first 30 days improve the product visibly.", "Product"],
    ["announcement", "Launch announcement", "The narrative is written: who it's for, what changes, the number that matters.", "Marketing"],
    ["producthunt", "Product Hunt preparation", "Listing drafted, early supporters notified, first-day engagement plan set.", "Marketing"],
    ["social", "Social campaign", "3-week content runway (problem → proof) and a day-of thread ready.", "Marketing"],
  ];
  return items.map(([id, title, description, category], i) => ({
    id: newId("launch"),
    startupId: ctx.startup.id,
    title,
    description,
    category,
    status: "pending",
    order: i,
    createdAt: ts,
  }));
}

export function generateRoadmap(ctx: StartupContext): RoadmapTask[] {
  const ts = tsNow();
  const plan: { phase: RoadmapTask["phase"]; title: string; description: string; priority: RoadmapTask["priority"] }[] = [
    // Validation
    { phase: "validation", title: "Problem interviews", description: "5–7 deep interviews with the target segment; capture the exact words they use.", priority: "high" },
    { phase: "validation", title: "Paid-interest landing page", description: "Publish a landing page that captures interest — signups are soft, willingness to pay is hard.", priority: "high" },
    { phase: "validation", title: "Competitor teardown", description: "Document 3 competitors' pricing, features and weaknesses; mark verified vs estimated.", priority: "med" },
    // MVP
    { phase: "mvp", title: "Core flow prototype", description: "Single-feature end-to-end flow for the sharpest use case.", priority: "high" },
    { phase: "mvp", title: "10 tester cohort", description: "Invite 10 pilot users; measure activation and 7-day return rate.", priority: "high" },
    { phase: "mvp", title: "Pricing experiment", description: "Offer a paid tier to half the cohort; measure conversion.", priority: "med" },
    // Beta
    { phase: "beta", title: "Beta invite", description: "Open a capped beta; collect structured feedback weekly.", priority: "high" },
    { phase: "beta", title: "Churn analysis", description: "Identify the top reason beta users stop; fix it before opening wide.", priority: "high" },
    // Launch
    { phase: "launch", title: "Public launch", description: "Product Hunt + announcement + 3-week content runway.", priority: "high" },
    { phase: "launch", title: "Retention sprint", description: "Ship the top retention lever twice per month for two months.", priority: "med" },
    // Growth
    { phase: "growth", title: "Channel proof", description: "Double down on the single acquisition channel with real ROI.", priority: "high" },
    { phase: "growth", title: "Second segment", description: "Only after retention is proven: expand to the adjacent segment.", priority: "low" },
  ];
  return plan.map((t, i) => ({
    id: newId("task"),
    startupId: ctx.startup.id,
    phase: t.phase,
    title: t.title,
    description: t.description,
    status: "todo" as const,
    priority: t.priority,
    order: i,
    createdAt: ts,
  }));
}

export function progressOf(items: { status: string }[]): number {
  if (!items.length) return 0;
  return Math.round((items.filter((i) => i.status === "done").length / items.length) * 100);
}