import type { AiActionType, StartupContext } from "../../types";
import { contextToTranscript, summarizeContext } from "../context";
import { generateLaunchPlan } from "./launch";
import { generateBusinessModel } from "./marketing";
import { generateMarketing } from "./marketing";

export interface CofounderReply {
  text: string;
  action?: {
    type: AiActionType;
    summary: string;
    payload: unknown;
  };
}

/** Structured action detection — the AI Co-Founder acts, not just chats. */
export function detectAction(message: string): {
  type: AiActionType;
  payload: unknown;
} | null {
  const m = message.toLowerCase();

  const on = (re: RegExp): boolean => re.test(m);

  if (on(/create.{0,20}(feature|features)/) || on(/add.{0,20}(feature|features)/) || on(/new feature/)) {
    return { type: "create-feature", payload: { name: "" } };
  }
  if (on(/delete.{0,20}(feature|features)/) || on(/remove.{0,20}(feature|features)/)) {
    return { type: "delete-feature", payload: { name: "" } };
  }
  if (on(/create.{0,20}(persona|customer persona|buyer persona)/) || on(/new persona/)) {
    return { type: "create-persona", payload: { name: "" } };
  }
  if (on(/update|change|revise|improve/ ) && on(/business model/)) {
    return { type: "update-business-model", payload: {} };
  }
  if (on(/pricing|price model|how.*charge|how.*make money|monetiz/)) {
    return { type: "generate-pricing", payload: {} };
  }
  if (on(/create.{0,20}(task|tasks)/) || on(/add.{0,20}(task|tasks)/)) {
    return { type: "create-task", payload: {} };
  }
  if (on(/change.{0,15}priority|move.{0,20}(phase|stage|roadmap)|prioritiz/)) {
    return { type: "change-priority", payload: {} };
  }
  if (on(/modify.{0,20}(roadmap|plan)/) || on(/roadmap/)) {
    return { type: "modify-roadmap", payload: {} };
  }
  if (on(/launch plan|create.{0,20}launch|launch checklist|launch campaign/)) {
    return { type: "generate-launch-plan", payload: {} };
  }
  return null;
}

function intentFor(type: AiActionType): string {
  const map: Record<AiActionType, string> = {
    "create-feature": "create a new feature",
    "delete-feature": "remove a feature",
    "modify-roadmap": "adjust the roadmap",
    "create-persona": "create a customer persona",
    "update-business-model": "update the business model",
    "generate-pricing": "generate a pricing model",
    "create-task": "create a roadmap task",
    "change-priority": "reprioritize a task",
    "generate-launch-plan": "generate the launch plan",
  };
  return map[type];
}

export function buildFallbackReply(
  ctx: StartupContext,
  message: string,
  actionResponse?: { type: AiActionType; summary: string; payload: unknown }
): string {
  const sum = summarizeContext(ctx);
  const action = actionResponse ?? detectAction(message);
  const m = message.toLowerCase();

  if (action) {
    const summary = (action as { summary?: string }).summary ?? `"${message.trim()}"`;
    return `I can ${intentFor(action.type)} for you. Here's what I propose:\n\n${summary}\n\nI've queued this as a **pending action** — approve it and I'll write it into your workspace, or tell me what to change first.`;
  }

  if (/(differentiat|compete|competitor)/.test(m)) {
    const comps = ctx.competitors ?? [];
    if (comps.length) {
      const holes = comps.map((c) => c.weaknesses[0]).filter(Boolean).join("; ");
      return `You differentiate against ${comps.map((c) => c.company).join(", ")} by owning the specific job: **${sum.idea.slice(0, 80)}…** while they ${holes}.\n\nThe fastest proof: a paid-interest page aimed at ${sum.audience.slice(0, 60)} this week. Want me to draft the differentiation section of your blueprint?`;
    }
    return `Nobody's tracked yet — run the competitor scan and I'll build your positioning against the real field.`;
  }
  if (/(mvp|prototype|build.*first|five features|reduce)/.test(m) && /(feature|mvp)/.test(m)) {
    return `Your MVP, kept ruthless, is three things:\n1. ${sum.idea.slice(0, 70)} for one segment\n2. History so nothing is rebuilt\n3. A shared outcome\n\nCut everything else. The MVP objective should be a single sentence: prove ${sum.audience.slice(0, 50)} will use this to ${sum.problem.slice(0, 50)} and come back. Open the MVP workspace to generate the full plan.`;
  }
  if (/(target|who.*first|first customer|segment)/.test(m)) {
    return `Target the sharpest pain first: **${sum.problem.slice(0, 80)}**. The narrowest group that feels this weekly is your beachhead. Today that reads as ${sum.audience.slice(0, 70)}, but verify with 5 interviews before you commit — the answers will be sharper than the guess.`;
  }
  if (/(risk|risks|danger|worst)/.test(m)) {
    const risks = ctx.assessment?.risks ?? [];
    return `Your biggest risks right now:\n${risks.map((r) => `- ${r}`).join("\n")}\n\nOwn each one: assign it a name, a test, and a one-week deadline. Which risk should we tackle first?`;
  }
  if (/(launch|announce|public)/.test(m)) {
    return `Launch is a sequence, not a day. Before the announcement:\n\n1. Product does its one job without embarrassment\n2. A landing page that converts the problem to a yes\n3. Analytics + a feedback loop live\n4. 10 warm beta users ready\n\nSay "create a launch plan" and I'll build the checklist into your Launch workspace.`;
  }
  if (/(market|tam|size|opportunity)/.test(m)) {
    if (ctx.market) {
      return `Your market snapshot (estimated, not verified):\n- TAM ≈ $${formatBn(ctx.market.tam)}\n- SAM ≈ $${formatBn(ctx.market.sam)}\n- SOM ≈ $${formatBn(ctx.market.som)}\n\nThese are top-down numbers — they set the story, not the plan. Before sharing them anywhere, triangulate with bottom-up counts.`;
    }
    return "No market snapshot yet — generate one and I'll show you TAM, SAM, SOM with each clearly labeled as an estimate.";
  }
  if (/(pricing|charge|price|money)/.test(m)) {
    const willingness = /(business|company|enterprise|team|agency)/i.test(sum.audience)
      ? "strong — business buyers pay for time saved"
      : "moderate — test willingness with paid interest before locking numbers";
    return `Pricing proposal: anchor on the outcome. Your audience reads as ${willingness}.\n\nA simple three-tier setup (free-taste → core → scale) lets you learn faster than a single price. Say "generate pricing" and I'll write it into your business model.`;
  }
  if (/(business model|revenue|streams|make money)/.test(m)) {
    return `Your monetization inputs say: ${sum.monetization}. Current revenue thinking: ${sum.monetization.slice(0, 120)}. The model should match how the value is delivered — subscription if the job repeats, fee-per-outcome if it's a transaction. Want me to formalize a business model section?`;
  }
  if (/(roadmap|next|what.*do|priority|first step)/.test(m)) {
    const actions = ctx.assessment?.nextActions
      ? ctx.assessment.nextActions.map((a) => `- ${a}`).join("\n")
      : "- Run 5 interviews\n- Preview a paid-interest page";
    return `Here's the order of operations:\n\n${actions}\n\nThe first step that cuts real risk is talking to users — not writing more code. Why not book those 5 interviews this week?`;
  }
  if (/(hello|hi|hey|help|start)/.test(m) && m.length < 60) {
    return `I'm your co-founder. I have the full picture of ${sum.name} in front of me — its problem, market and roadmap. Ask me to differentiate, cut your MVP to five features, set pricing, or plan the launch. Or just say "what should I do next?".`;
  }

  return `Reading your startup:\n- **${sum.name}** — ${sum.stage} stage\n- Problem: ${sum.problem.slice(0, 84)}…\n- Target: ${sum.audience.slice(0, 70)}…\n\nTo be most useful, tell me what to do — e.g. "create a launch plan", "reduce my MVP to five features", "who should I target first?", or "what are my biggest risks?".`;
}

function formatBn(n: number): string {
  return n >= 1e12 ? `${(n / 1e12).toFixed(1)}T` : `${(n / 1e9).toFixed(1)}B`;
}

/** Build the prompt sent to a remote provider for chat. */
export function buildChatPrompt(
  ctx: StartupContext,
  history: { role: string; content: string }[],
  message: string
): string {
  return `You are ForgeAI, an AI co-founder. Ground every answer in the startup context below; never invent facts you cannot source from it — mark estimates clearly.

STARTUP CONTEXT:
${contextToTranscript(ctx)}

CONVERSATION SO FAR:
${history.map((h) => `${h.role.toUpperCase()}: ${h.content}`).join("\n")}

FOUNDER: ${message}

Answer as a sharp, concise co-founder. Prefer structured bullet output. If the founder asks for a concrete change, end with a short "Action:" line describing the structure change you recommend so the system can build an approval step.`;
}