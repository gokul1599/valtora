import type { Mvp, StartupContext, FeatureCategory } from "../../types";
import { firstSentence, keywords, capitalize, lower } from "./helpers";

export function generateMvp(ctx: StartupContext): Mvp {
  const { profile } = ctx;
  const kws = keywords(profile.idea, 3);
  const job = kws[0] ?? "the core job";
  const audience = profile.audience.split(/[.,;]/)[0].trim();
  const problem = firstSentence(profile.problem);

  return {
    startupId: ctx.startup.id,
    objective: `Prove that ${lower(audience)} will ${job} with ${ctx.startup.name} — and keep coming back — before building anything broader.`,
    coreFeatures: [
      `${capitalize(job)} in one flow for one segment — start to finish`,
      "A minimal record of what was done (their own history)",
      "Shareable result / output the user can take away",
      "One obvious next step that pulls them back next week",
    ],
    userStories: [
      `As a ${lower(audience)}, I want to ${job} without setup so I get the result in minutes, not days.`,
      `As a ${lower(audience)}, I want my past results saved so I never redo work.`,
      `As a ${lower(audience)}, I want to share the outcome so my team can act on it.`,
      `As the founder, I want to see return-visit frequency so I can judge whether value is real.`,
    ],
    screens: [
      "Landing page (problem → one-click promise)",
      "Sign up / first-run (zero config)",
      "Core flow: input → result",
      "History / recents",
      "Share or export outcome",
    ],
    databaseRequirements: [
      "Accounts & sessions",
      "User-generated inputs associated with history",
      "Results / outputs with timestamps",
      "Feature-flag table for the manual-parts migration",
    ],
    apis: [
      "Auth endpoints",
      `Core ${job} execution endpoint`,
      "History read/write",
    ],
    authentication: "Email + password with session cookies; OAuth later. No multi-tenant complexity yet.",
    integrations: [
      "Email delivery (transactional)",
      "Basic analytics / event tracking",
      "Payment (only if the MVP is the pricing experiment)",
    ],
    devTasks: [
      "Skeleton app with auth",
      "Single core flow end-to-end",
      "History screen",
      "Landing page with waitlist or paid-interest gate",
      "Analytics events for activation + retention",
      "Hard deploy to a public URL; invite 10 testers",
    ],
    status: "draft",
    version: 1,
    updatedAt: new Date().toISOString(),
  };
}

export const FEATURE_CATEGORY_ORDER: FeatureCategory[] = [
  "must",
  "should",
  "could",
  "not-now",
];