import type { BusinessModel, MarketingPlan, StartupContext } from "../../types";
import { willingnessSignal, keywords } from "./helpers";

export function generateBusinessModel(ctx: StartupContext): BusinessModel {
  const { profile } = ctx;
  const isSaaS = /(saas|software|app|tool|platform|subscription|api)/i.test(profile.idea);
  const willingness = willingnessSignal(profile.audience);
  const kws = keywords(profile.idea, 1);

  return {
    startupId: ctx.startup.id,
    model: isSaaS
      ? "Recurring software subscription (SaaS) with a simple two-tier structure."
      : "Outcome-based fee attached to the core transaction the platform enables.",
    revenueStreams: isSaaS
      ? [
          "Core monthly subscription",
          "Annual prepayment (2 months effective discount)",
          "Scale tier for teams/usage beyond the standard plan",
        ]
      : [
          "Per-transaction or per-outcome fee",
          "Premium tier for priority handling",
          "Setup/service fee for onboarding",
        ],
    pricingTiers: isSaaS
      ? [
          {
            name: "Starter",
            price: willingness.strength >= 0.6 ? "−" : "$0",
            cadence: "/month",
            features: ["One active workspace", "Core job, limited usage", "Community support"],
            highlighted: false,
          },
          {
            name: "Core",
            price: "$19–$39",
            cadence: "/month",
            features: ["Unlimited core usage", "History & exports", "Priority support"],
            highlighted: true,
          },
          {
            name: "Team",
            price: "Custom",
            cadence: "/year",
            features: ["Seats & permissions", "SSO", "Dedicated success"],
            highlighted: false,
          },
        ]
      : [
          {
            name: "Per use",
            price: "Small",
            cadence: "per outcome",
            features: ["Pay only for value delivered", "No monthly commitment", "Feels fair to early adopters"],
            highlighted: true,
          },
          {
            name: "Heavy user",
            price: "Bundled",
            cadence: "per month",
            features: ["Unlimited usage", "Priority slots", "Better margin per user"],
            highlighted: false,
          },
        ],
    unitEconomics: isSaaS
      ? "Target: CAC recovered in < 6 months, LTV/CAC ≥ 3, gross margin ≥ 80% (hosting is overhead at this scale)."
      : "Target: positive contribution margin per outcome; CAC recovered within two repeat transactions.",
    notes: `Pricing is a proposal, not gospel. ${willingness.note} Validate with paid-interest tests before locking numbers.`,
    updatedAt: new Date().toISOString(),
  };
}

export function generateMarketing(ctx: StartupContext): MarketingPlan {
  const { profile } = ctx;
  const kws = keywords(profile.idea, 3);
  const aud = profile.audience.split(/[.,;]/)[0].trim();
  const isC = /(consumer|home|parent|student|people|everyone)/i.test(profile.audience);
  const isTech = /(developer|engineer|analyst|it|dev)/i.test(profile.audience);

  return {
    startupId: ctx.startup.id,
    positioning: `For ${lower(aud)} who ${firstPhrase(profile.problem)}, ${ctx.startup.name} is the ${kws[0] ?? "dedicated"} tool that finishes the job — built for this, not for everyone.`,
    tagline: "Built for this. Not everything.",
    landingCopy: `${firstSentenceCap(profile.problem)}.\n\n${ctx.startup.name} does the ${kws[0] ?? "core"} work in minutes, keeps a clean record, and hands you a shareable result. No spreadsheets. No email chains. No redoing it every week.\n\nStart free — the first outcome is on us.`,
    targetAudience: profile.audience.trim(),
    acquisitionChannels: isC
      ? ["TikTok / Instagram demo loops", "Organic how-to content", "Referrals from first users"]
      : isTech
        ? ["Developer newsletters", "Community posts solving the exact issue", "SEO on the specific problem phrase"]
        : ["LinkedIn problem-focused posts", "Niche communities/Slack/Discord", "Product directory launch (Product Hunt)"],
    contentStrategy: [
      `Weekly "how to ${firstPhrase2(profile.problem)} without [current workaround]" posts`,
      "One deep screen recording showing the outcome in 90 seconds",
      "Founder notes: the before/after of real pilot users",
    ],
    socialStrategy: [
      "X/LinkedIn: problem Monday, proof Thursday cadence",
      "Reply to people describing the pain with a direct, non-spammy answer",
      "Community leaderboard of early adopters (opt-in only)",
    ],
    launchCampaign: [
      "Pre-launch: waitlist or paid-interest page + 3 weeks of content",
      "Launch day: Product Hunt + a live demo thread",
      "Post-day-1: follow-up email with the founder's numbers, not features",
    ],
    emailCampaign: [
      "Welcome: problem → promise → 90-second video",
      "Day 1: first outcome walkthrough",
      "Day 7: one success story from a pilot user",
      "Day 21: reopen with a new capability (or honest founder note)",
    ],
    seoIdeas: [
      `Rank for "${firstPhrase3(profile.problem)} without <workaround>"`,
      "Comparison page vs the generalist tool",
      `Pillar page: everything about ${kws[0] ?? "the core topic"} for ${lower(aud)}`,
    ],
    updatedAt: new Date().toISOString(),
  };
}

function firstPhrase(text: string): string {
  const t = text.trim().toLowerCase();
  const cut = t.replace(/^(the problem?|problem is|solve[s]?|help[s]?|handle)[, ]+/i, "");
  const words = cut.split(/\s+/).slice(0, 9).join(" ");
  return words || "deal with the problem";
}
function firstPhrase2(text: string): string {
  return firstPhrase(text);
}
function firstPhrase3(text: string): string {
  return firstPhrase(text).replace(/[^a-z0-9 ]+/g, "");
}
function firstSentenceCap(text: string): string {
  const m = text.trim().match(/^[^.]+\./);
  const s = (m ? m[0] : text.trim()).trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function lower(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}