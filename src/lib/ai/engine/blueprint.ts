import type {
  Blueprint,
  BlueprintSection,
  BlueprintSlug,
  StartupContext,
} from "../../types";
import { now } from "../../db/store";
import {
  industryMultipliers,
  keywords,
  sentences,
  titleCase,
  willingnessSignal,
} from "./helpers";

function heading(section: string, body: string): string {
  return body;
}

function buildVision(ctx: StartupContext): string {
  const { profile } = ctx;
  const idea = profile.idea.trim();
  return `We are building **${ctx.startup.name}** to turn "${firstShort(profile.audience)}" from a painful daily reality into a solved problem.

## Vision statement
In three years, ${ctx.startup.name} is the default way ${shortAudience(profile.audience)} ${shortSolve(profile.problem)} — measured in ${shortMetric(profile)}.

## Why now
${industryMultipliers(idea).trendLabels[0]}. Combined with the problem described at this level, timing is favorable but not guaranteed: the window closes as generalists bolt on a shallow version of this idea.

## North star (working principles)
- **Focus**: one segment, one use case, one happy job-to-be-done before expanding.
- **Speed**: decisions that take two weeks become one-day decisions.
- **Evidence**: every assumption here is an estimate until validated by real users.`;
}

function buildProblem(ctx: StartupContext): string {
  const { profile } = ctx;
  const probs = sentences(profile.problem);
  const kws = keywords(profile.problem, 4);
  return `## The problem
${profile.problem}

## Why it matters
${firstShort(profile.audience)} loses real money / time / quality every day this stays unsolved. The pain is **${painAdjective(kws[0] ?? "core")}**: it recurs weekly, there is no acceptable default fix, and the current workaround is manual.

## Existing workarounds (what people do today)
- DIY with spreadsheets, email and memory — error-prone and unowned
- Paying a generalist tool that solves everything except this
- Doing nothing and accepting the cost

## Evidence status
- Problem stated by the founder: estimated
- Validated via interviews: **not yet** — this is the first confirmation to pursue.`;
}

function buildTargetCustomers(ctx: StartupContext): string {
  const { profile } = ctx;
  return `## Primary segment
${firstShort(profile.audience)} who are actively ${shortSolve(profile.problem)} today — 5–7 interviews this week will confirm the wedge.

## Why this segment first
- **Pain is sharp today** (they already spend effort solving it manually).
- **Halo stage**: early adopters in this group influence the wider market.
- **Contained acquisition**: they cluster in ${channelHint(profile.audience)}.

## Early adopter profile (draft)
- Has the problem at least weekly
- Has already tried a workaround
- Has budget (or a gatekeeper with budget)
- Wants to be first: open to unstable early tools

> Priority when segmenting: pick the narrowest group that feels the sharpest pain — breadth is a trap at this stage.`;
}

function buildValueProposition(ctx: StartupContext): string {
  const { profile } = ctx;
  const audience = firstShort(profile.audience);
  return `## One-liner
For ${lowerInit(audience)}, ${ctx.startup.name} is a way to ${shortSolve(profile.problem)} without the usual manual grind — unlike generalist tools, it is built for exactly this job.

## Value ladder
- **Core**: ${firstShort(profile.problem)}
- **Speed**: results in minutes instead of days
- **Confidence**: structured, auditable, editable — not a black box

## Message that resonates (test this)
"${valueHook(profile)}"

## What we promise NOT to be
A feature-laden generic tool. Single job, done exceptionally well.`;
}

function buildMarket(ctx: StartupContext): string {
  const mult = industryMultipliers(ctx.profile.idea);
  const willingness = willingnessSignal(ctx.profile.audience);
  const tam = mult.tamBase;
  const samPct = 0.04;
  const somPct = 0.005;
  return `## TAM — ${tamLabel(tam)} *(estimate)*
$${billions(tam)} total addressable market across the broader industry the idea sits in. This is a directional figure from a top-down lens. *(ESTIMATE — validate before quoting to investors.)*

## SAM — addressable within reach
$${billions(tam * samPct)} served market defined by geography, segment and use case that ${ctx.startup.name} can realistically reach.

## SOM — realistic near-term service
$${billions(tam * somPct)} obtainable in the first 24–36 months with a focused beachhead.

## Market trends
${mult.trendLabels.map((t) => `- ${t}`).join("\n")}

Growth feels ${mult.growth}.

## Willingness to pay
${willingness.note}`;
}

function buildCompetition(ctx: StartupContext): string {
  const comps = ctx.competitors ?? [];
  if (comps.length === 0) {
    return `## Competitive landscape
No competitors are tracked yet. Run the competitor scan to build the matrix — for now these are the categories to watch:

- **Direct**: others attempting the same promise as ${ctx.startup.name}
- **Indirect**: generalist tools users work around today
- **Invisible**: doing nothing / keeping the manual workaround

## Positioning gap
Most incumbents win on breadth or brand. The gap: a specialist that actually finishes this specific job, at a price a small team can absorb.

> Without competitor data this section is a hypothesis. Run the scan to make it useful.`;
  }
  const lines = comps
    .map(
      (c) => `### ${c.company} — ${c.product}
- **Targets**: ${c.targetUsers || "unknown"}
- **Pricing**: ${c.pricing || "unknown"}
- **Strengths**: ${c.strengths.join(", ") || "unknown"}
- **Weaknesses**: ${c.weaknesses.join(", ") || "unknown"}
- **Where we beat them**: ${c.differentiation || "undecided"}`
    )
    .join("\n\n");
  return `## Direct competitors
${lines}

## Competitive matrix takeaways
- Most competitors optimize for ${comps[0]?.strengths[0] ?? "scale"}, leaving the specific job underserved.
- Low switching friction: if ${ctx.startup.name} is 2× faster at this one job, adoption is realistic (data ${comps.every((c) => c.verified) ? "verified" : "estimated"}).`;
}

function buildDifferentiation(ctx: StartupContext): string {
  const comps = ctx.competitors ?? [];
  const kws = keywords(ctx.profile.idea, 3);
  const wedge = kws[0] ?? "the focused use case";
  return `## The wedge
${ctx.startup.name} competes on **specialization**: built exclusively for ${firstShort(ctx.profile.audience)}, rather than a generic add-on.

## Defense layers
1. **Category ownership**: be the obvious name for "${wedge}"
2. **Workflow lock-in**: the tool embeds into their ${shortSolve(ctx.profile.problem)} routine
3. **Data compounding**: their usage inside the platform makes it harder to leave (and better for them)
4. **Speed of iteration**: re-engage users monthly, not yearly

## Where existing players are vulnerable
${comps.length ? comps.map((c) => `- **${c.company}**: ${c.weaknesses[0] ?? "broad but shallow coverage"}`).join("\n") : "- Generalists do 80% of use cases worse than a specialist; this is the crack to drive into."}

## Proof we still need
Competitor and customer evidence is ${comps.length && comps.every((c) => c.verified) ? "partly verified" : "an estimate"} — validate the wedge with 5 paid-interest tests before doubling down.`;
}

function buildBusinessModel(ctx: StartupContext): string {
  const bm = ctx.businessModel;
  if (bm) {
    return `## Revenue engine
${bm.model}

### Streams
${bm.revenueStreams.map((s) => `- ${s}`).join("\n")}

### Unit economics
${bm.unitEconomics || "Estimate these once real usage data exists."}

### Notes
${bm.notes}`;
  }
  const willingness = willingnessSignal(ctx.profile.audience);
  const fallsTo = /(business|saas|software|app|tool|platform)/i.test(ctx.profile.idea)
    ? "subscription (SaaS) with a usage-scaled tier"
    : "transaction / service fee on top of the value delivered";
  return `## Revenue engine (draft)
**Primary model:** ${fallsTo}.

Streams to consider in priority order:
- Recurring access for the core value (predictable, compounds) — recommended
- Setup / onboarding fee for first-time value delivery
- Premium tier for enterprise-grade needs (teams, audit, SSO later)

## Unit economics to chase
- CAC: paid channel with ROI within 60 days
- LTV: ×3+ of CAC
- Gross margin: 80%+ at software scale

> Willingness to pay looks ${willingness.strength >= 0.6 ? "strong" : "moderate"} for this audience. Test a paid tier before free tier.`;
}

function buildPricing(ctx: StartupContext): string {
  const willingness = willingnessSignal(ctx.profile.audience);
  const sep = /(business|saas|software|app|tool|platform)/i.test(ctx.profile.idea) ? "\" per seat" : "\" per use";
  return `## Pricing strategy (proposal)
**Principle:** charge for the outcome, keep the anchor simple.

- **Free**: a taste that proves value in one session (no time-based trial friction)
- **Core**: the complete job at a flat ${willingness.strength >= 0.6 ? "$" : "proven"} monthly price
- **Scale**: for teams / heavier usage, annual contract

Suggested anchors (to A/B):
- Core: $19–39${sep} per month — pick the number that a 15-minute interview says feels fair
- Annual: 2 months free at sign-up

### Rules
- Never discount promiscuously; grandfather early adopters at 20% off
- Raise prices as the job gets more valuable — do not anchor low permanently
- Published evidence: founder estimate, validate with paid tests.`;
}

function buildProduct(ctx: StartupContext): string {
  const features = ctx.features?.filter((f) => f.category !== "not-now") ?? [];
  if (features.length) {
    const f = features
      .map(
        (fe) => `- **[${fe.category.toUpperCase().replace("-", " ")}]** ${fe.name} — ${fe.description}`
      )
      .join("\n");
    return `## Product definition
${ctx.productVision?.vision ?? `Product pending a vision statement — draft one in the Product section.`}

## Core feature set
${f}

## Experience principles
- First value in under 90 seconds
- Zero config for the primary job
- Every screen moves the user toward the outcome, never toward the menu`;
  }
  return `## Product definition
Product assets not generated yet. Draft a clear product vision and feature list in the **Product** workspace, then return here.

Working draft: the first-session experience should let ${firstShort(ctx.profile.audience)} ${shortSolve(ctx.profile.problem)} with one click, from first screen to complete outcome.

## Backlog outline (generate in Product)
- Must-have flow for the core job
- One differentiator the incumbents won't build soon
- Everything else is cut for now.`;
}

function buildMvp(ctx: StartupContext): string {
  const mvp = ctx.mvpRecord;
  return mvp
    ? `## MVP objective
${mvp.objective}

## Core features
${mvp.coreFeatures.map((c) => `- ${c}`).join("\n")}

## Screens
${mvp.screens.map((s) => `- ${s}`).join("\n")}

**Status:** ${mvp.status} (v${mvp.version}). Full plan in the MVP workspace.`
    : `## MVP — the smallest thing that proves value
The MVP is **not** a smaller version of the full product; it is the quickest path to prove the sharpest assumption: that ${firstShort(ctx.profile.audience)} will ${shortSolve(ctx.profile.problem)} with ${ctx.startup.name} and pay for it.

Proposed first slice:
- One primary user story, end to end, for one segment
- Manual parts allowed (email, spreadsheets) where code is wasteful
- Success metric: % of testers who reach the outcome and return next week

Generate the full MVP plan in the **MVP** workspace.`;
}

function buildTechnology(ctx: StartupContext): string {
  const tech = ctx.technical;
  return tech
    ? `## Architecture summary
${tech.summary}

## Stack
- **Frontend**: ${tech.frontend}
- **Backend**: ${tech.backend}
- **Database**: ${tech.database}
- **Auth**: ${tech.authentication}
- **Deploy**: ${tech.infrastructure}

Full plan in the **Technology** workspace.`
    : `## Architecture approach (draft)
Until the Technical Architect generates a full plan:
- Ship the macro-thin slice that proves the MVP flow
- Prefer boring, well-known technologies (fast hiring, low surprise)
- Deploy on a managed platform; add infra only when a metric demands it

Generate the full architecture in the **Technology** workspace.`;
}

function buildRoadmap(ctx: StartupContext): string {
  const tasks = ctx.roadmap ?? [];
  const phases = ["validation", "mvp", "beta", "launch", "growth"];
  const byPhase = phases.map(
    (p) =>
      `### ${titleCase(p)}\n` +
      (tasks.filter((t) => t.phase === p).map((t) => `- ${t.status === "done" ? "✅" : "▢"} ${t.title} — ${t.priority} priority`).join("\n") || "- Nothing scheduled yet")
  );
  return `## Roadmap at a glance
${byPhase.join("\n\n")}

Progress: ${pctDone(tasks)}% of all tasks complete. Full interactive roadmap in the **Roadmap** workspace.`;
}

function buildMarketing(ctx: StartupContext): string {
  const mkt = ctx.marketing;
  return mkt
    ? `## Positioning
${mkt.positioning}

## Tagline
> ${mkt.tagline}

## Channels
${mkt.acquisitionChannels.map((c) => `- ${c}`).join("\n")}

Full campaign structure in the **Marketing** workspace.`
    : `## Positioning draft
${ctx.startup.name} is for ${firstShort(ctx.profile.audience)} who are tired of ${shortLower(ctx.profile.problem)} — the alternative is a purpose-built tool that finishes the job instead of adding to it.

Suggested tagline candidates (A/B later):
- "${taglineCandidate(ctx)}" 
- "Built for this. Not everything."

Generate the full marketing plan in the **Marketing** workspace.`;
}

function buildLaunch(ctx: StartupContext): string {
  const launch = ctx.launch;
  const items = launch ?? [];
  const done = items.filter((i) => i.status === "done").length;
  return `## Launch readiness
${items.length ? `${pct(done, items.length)}% checked off (${done}/${items.length}). ` : ""}Launch plan ${items.length ? "exists" : "not yet generated"} — generate it in the **Launch** workspace.

### Pillars of the launch
1. A product that finishes its one job without embarrassment
2. A landing page that converts the problem statement to a yes
3. Analytics + feedback wired before the announcement
4. A pre-warmed audience (beta users / waitlist) to compress day-one feedback`;
}

function buildRisks(ctx: StartupContext): string {
  const risks = ctx.assessment?.risks ?? [];
  return `## Top risks
${(risks.length ? risks : [
  "Market sizing is estimated — unvalidated TAM can support false confidence",
  "Competitor response could arrive before traction",
  "Founder time split between building and selling",
  "Willingness to pay unproven — free usage ≠ revenue",
]).map((r) => `- **${r}**`).join("\n")}

## De-risking protocol
- Interview 5–7 target users before writing more code
- Publish a paid-interest landing page this week (a $0 signup is less evidence)
- Assign each risk an owner and a one-week deadline to either confirm or retire it`;
}

const SECTION_BUILDERS: Record<BlueprintSlug, (ctx: StartupContext) => string> = {
  vision: (c) => buildVision(c),
  problem: (c) => buildProblem(c),
  "target-customers": (c) => buildTargetCustomers(c),
  "value-proposition": (c) => buildValueProposition(c),
  market: (c) => buildMarket(c),
  competition: (c) => buildCompetition(c),
  differentiation: (c) => buildDifferentiation(c),
  "business-model": (c) => buildBusinessModel(c),
  pricing: (c) => buildPricing(c),
  product: (c) => buildProduct(c),
  mvp: (c) => buildMvp(c),
  technology: (c) => buildTechnology(c),
  roadmap: (c) => buildRoadmap(c),
  marketing: (c) => buildMarketing(c),
  launch: (c) => buildLaunch(c),
  risks: (c) => buildRisks(c),
};

export function generateBlueprintSections(ctx: StartupContext): BlueprintSection[] {
  const ts = now();
  return (Object.keys(SECTION_BUILDERS) as BlueprintSlug[]).map((slug) => ({
    id: `bp_${slug}_${ts.replace(/[^0-9]/g, "").slice(2, 12)}`,
    slug,
    title: titleCase(slug.replace(/-/g, " ")),
    content: heading(slug, SECTION_BUILDERS[slug](ctx)),
    status: "draft",
    updatedAt: ts,
  }));
}

export function generateBlueprint(ctx: StartupContext): Blueprint {
  return {
    startupId: ctx.startup.id,
    version: (ctx.blueprintVersion ?? 1) + 1,
    generatedAt: now(),
    sections: generateBlueprintSections(ctx),
  };
}

function firstShort(text: string): string {
  const t = text.trim();
  if (t.length <= 90) return t;
  return t.slice(0, 90).trimEnd() + "…";
}
function shortAudience(text: string): string {
  const t = text.trim().toLowerCase();
  if (t.length <= 40) return t;
  return t.split(/[.,;]/)[0].toLowerCase() || t.slice(0, 40);
}
function shortSolve(text: string): string {
  const t = text.trim().toLowerCase();
  const cut = t.replace(/^(the problem?|solve[s]?nds?|help[s]?|handle)[ ,]+/i, "");
  const words = cut.split(/\s+/).slice(0, 8).join(" ");
  return words || "solve it";
}
function shortLower(text: string): string {
  const s = shortSolve(text);
  return s;
}
function shortMetric(p: { idea: string; monetization: string }): string {
  if (/(saas|software|app|tool|subscription)/i.test(p.monetization))
    return "a retained, paying user base";
  if (/(advertis|marketplace|commission)/i.test(p.monetization))
    return "healthy transaction volume";
  return "measurable time or cost saved per user";
}
function painAdjective(kw: string): string {
  const map: Record<string, string> = {
    manual: "daily",
    costly: "expensive",
    slow: "recurring",
    inefficient: "chronic",
  };
  return map[kw] ?? "recurring";
}
function channelHint(audience: string): string {
  if (/(business|company|smb|team|agency|saas)/i.test(audience)) return "LinkedIn + niche communities";
  if (/(developer|engineer)/i.test(audience)) return "GitHub, dev newsletters, X";
  if (/(consumer|home|parent|student)/i.test(audience)) return "TikTok / Instagram + word of mouth";
  return "the communities where they already complain about this";
}
function lowerInit(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
function valueHook(p: { audience: string; problem: string }): string {
  const aud = firstShort(p.audience).split(/[.,;]/)[0];
  const prob = shortSolve(p.problem);
  return `Stop ${prob} the manual way. ${aud} get everything done in one place — in minutes, not days.`;
}
function tamLabel(v: number): string {
  return v >= 1e12 ? "trillions" : "billions";
}
function billions(v: number): string {
  return (v / 1e9).toFixed(v >= 1e12 ? 0 : 1);
}
function pctDone(tasks: { status: string }[]): number {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((t) => t.status === "done").length / tasks.length) * 100);
}
function pct(a: number, b: number): number {
  return b === 0 ? 0 : Math.round((a / b) * 100);
}
function taglineCandidate(ctx: StartupContext): string {
  const aud = shortAudience(ctx.profile.audience).split(/[.,;]/)[0];
  return `${aud} deserve better than a workaround — ${ctx.startup.name} is the fix.`;
}