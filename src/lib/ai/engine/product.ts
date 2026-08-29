import type { ProductVision, UserStory, Feature, StartupContext } from "../../types";
import { newId, now as tsNow } from "../../db/store";
import { keywords } from "./helpers";

export function generateProductVision(ctx: StartupContext): ProductVision {
  const { profile } = ctx;
  const kws = keywords(profile.idea, 3);
  return {
    startupId: ctx.startup.id,
    vision: `${ctx.startup.name} exists so ${lower(profile.audience.split(/[.,;]/)[0] || "its customers")} can ${firstPhrase(profile.problem)} — without the manual grind, without another spreadsheet, without wondering whether it was done right. By 12 months, one unremarkable task stops being a task at all.`,
    valueProposition: `For ${firstShort(profile.audience)} who ${firstPhrase(profile.problem)}, ${ctx.startup.name} is the ${kws[0] ?? "focused"} tool that finishes the job in minutes — unlike generalist alternatives that only organize the problem.`,
    customerSegments: [profile.audience.trim()],
    goals: [
      "First value in under 90 seconds",
      "Activation: 60% of signups reach the core outcome in their first session",
      "Retention: 30% weekly active return in month two",
    ],
    updatedAt: new Date().toISOString(),
  };
}

export function generateUserStories(ctx: StartupContext): UserStory[] {
  const ts = tsNow();
  const aud = ctx.profile.audience.split(/[.,;]/)[0].trim();
  const kws = keywords(ctx.profile.idea, 2);
  return [
    {
      id: newId("us"),
      startupId: ctx.startup.id,
      asA: lower(aud),
      iWant: `to ${kws[0] ?? "complete the core task"} in one session`,
      soThat: "I get the outcome without managing multiple tools",
      acceptanceCriteria: "Start → completed outcome → shareable result; under 5 minutes on first run.",
      category: "must",
      createdAt: ts,
    },
    {
      id: newId("us"),
      startupId: ctx.startup.id,
      asA: lower(aud),
      iWant: "my work history to persist",
      soThat: "I never rebuild results and can hand them over",
      acceptanceCriteria: "History screen lists prior results; each opens or re-runs.",
      category: "must",
      createdAt: ts,
    },
    {
      id: newId("us"),
      startupId: ctx.startup.id,
      asA: lower(aud),
      iWant: `to invite a teammate to ${kws[0] ?? "collaborate"}`,
      soThat: "the outcome is shared, not siloed",
      acceptanceCriteria: "Invite link grants read access within an org later.",
      category: "should",
      createdAt: ts,
    },
    {
      id: newId("us"),
      startupId: ctx.startup.id,
      asA: lower(aud),
      iWant: "exportable reports",
      soThat: "I can share progress with stakeholders outside the product",
      acceptanceCriteria: "Export produces a clean PDF/Markdown/CSV.",
      category: "could",
      createdAt: ts,
    },
  ];
}

export function seedFeatures(ctx: StartupContext): Feature[] {
  const ts = tsNow();
  const kws = keywords(ctx.profile.idea, 3);
  const aud = ctx.profile.audience.split(/[.,;]/)[0].trim();
  return [
    {
      id: newId("feat"),
      startupId: ctx.startup.id,
      name: `Core ${kws[0] ?? "task"} flow`,
      description: `End-to-end flow for ${lower(aud)} to ${firstPhrase(ctx.profile.problem)} in one session.`,
      category: "must",
      status: "planned",
      createdAt: ts,
    },
    {
      id: newId("feat"),
      startupId: ctx.startup.id,
      name: "History & recents",
      description: "Every result saved and re-openable; no rebuilds from scratch.",
      category: "must",
      status: "planned",
      createdAt: ts,
    },
    {
      id: newId("feat"),
      startupId: ctx.startup.id,
      name: "Shareable outcome",
      description: "One link or export that hands the result to a teammate.",
      category: "should",
      status: "planned",
      createdAt: ts,
    },
    {
      id: newId("feat"),
      startupId: ctx.startup.id,
      name: "Recurring reminders",
      description: "Brings users back weekly with a small, useful nudge.",
      category: "could",
      status: "planned",
      createdAt: ts,
    },
    {
      id: newId("feat"),
      startupId: ctx.startup.id,
      name: "Team workspaces",
      description: "Shared space for a whole team — later, once retention is proven.",
      category: "not-now",
      status: "planned",
      createdAt: ts,
    },
  ];
}

function firstPhrase(text: string): string {
  const t = text.trim().toLowerCase();
  const cut = t.replace(/^(the problem?|problem is|solve[s]?|help[s]?|handle)[, ]+/i, "");
  return cut.split(/\s+/).slice(0, 10).join(" ") || "solve the problem";
}
function firstShort(text: string): string {
  const t = text.trim();
  return t.length <= 70 ? t : t.slice(0, 70).trimEnd() + "…";
}
function lower(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}