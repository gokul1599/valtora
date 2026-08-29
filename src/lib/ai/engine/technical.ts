import type { TechnicalPlan, StartupContext } from "../../types";
import { keywords } from "./helpers";

export function generateTechnicalPlan(ctx: StartupContext): TechnicalPlan {
  const { profile } = ctx;
  const kws = keywords(profile.idea, 3);
  const heavyData = /(data|report|benchmark|analysis|research|tool|platform|saas)/i.test(profile.idea);

  return {
    startupId: ctx.startup.id,
    summary: `A single deployable web app: JAMstack front end, stateless API, managed Postgres, and everything server-side behind typed endpoints. Chosen for speed and boring reliability — this plan avoids novelty to protect the build.`,
    frontend: "Next.js (App Router) + React + TypeScript. Server components for content, typed client components for workspaces. Tailwind for styling. Rendered edge-side where possible.",
    backend: "Next.js API routes behind a gate: session authentication, zod input validation, repository access via the data layer. All AI work is queued behind a provider abstraction, never blocking interactivity unnecessarily.",
    database: `Postgres with the schema in \`prisma/schema.prisma\`. Core entities: \`User\`, \`Startup\`, \`Blueprint\`, \`Feature\`, \`RoadmapTask\`, \`Competitor\`, \`AiConversation\`. Indexes on \`(startupId)\` and \`(userId, createdAt)\`.`,
    authentication: "Credential sessions (bcrypt + signed JWT cookies) today; OAuth-ready provider interface for Google. Authorization enforced server-side on every mutation by startup ownership.",
    infrastructure: "Managed platform (Vercel) for the web app; managed Postgres; object storage for exported documents; edge cache for static marketing content. No self-managed servers at this stage.",
    ai: heavyData
      ? "Provider-abstracted generation (OpenAI/Anthropic-compatible) with a deterministic local engine as fallback. Structured outputs validated by zod before any write to the database."
      : "Lightweight: same provider abstraction, but AI is used for formatting/planning, not as a core runtime dependency of the product itself.",
    integrations: [
      "Email/SMTP for transactional + campaign emails",
      "Analytics events (activation & retention funnel)",
      "Object storage for exports",
      "Payment gateway (Stripe) — added at the pricing milestone, isolated behind one module",
    ],
    dataModel: [
      { entity: "Startup", purpose: "One project per founder workspace; owns all child records", relations: "1:N everything below; owned by User" },
      { entity: "BlueprintSection", purpose: "Editable sections of the startup blueprint", relations: "Blueprint 1:N, Blueprint 1:1 Startup" },
      { entity: "Feature / RoadmapTask", purpose: "Prioritization and execution tracking", relations: "1:N Startup, indexed by (startupId, phase)" },
      { entity: "AiConversation + Message", purpose: "Co-founder chat memory across sessions", relations: "Conversation 1:N Message; Conversation 1:1 Startup" },
      { entity: "AiGeneration", purpose: "Usage metering per plan", relations: "N:1 User, indexed by (userId, createdAt)" },
    ],
    updatedAt: new Date().toISOString(),
  };
}