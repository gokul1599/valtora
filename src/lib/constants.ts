import type { Plan } from "./types";

export const APP_NAME = "ForgeAI";

export const PLAN_LIMITS: Record<
  Plan,
  { startups: number; aiGenerationsPerMonth: number; label: string }
> = {
  free: { startups: 1, aiGenerationsPerMonth: 20, label: "Free" },
  pro: { startups: 10, aiGenerationsPerMonth: 200, label: "Pro" },
  founder: { startups: 100, aiGenerationsPerMonth: 1000, label: "Founder" },
};

export const PLANS: {
  id: Plan;
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    cadence: "/month",
    tagline: "Run your first idea through the Forge.",
    features: [
      "1 active startup",
      "Basic startup blueprint",
      "20 AI generations / month",
      "Startup intelligence score",
      "Roadmap basics",
    ],
    cta: "Start free",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    cadence: "/month",
    tagline: "For founders building for real.",
    features: [
      "10 startup projects",
      "Advanced AI analysis",
      "Competitor intelligence",
      "MVP generator & technical architect",
      "Unlimited market snapshots",
      "Full export suite (PDF, Markdown, JSON, CSV)",
      "200 AI generations / month",
    ],
    cta: "Go Pro",
    highlighted: true,
  },
  {
    id: "founder",
    name: "Founder",
    price: "$79",
    cadence: "/month",
    tagline: "The full co-founder experience.",
    features: [
      "Unlimited projects",
      "Advanced research & reports",
      "AI automation & structured actions",
      "Team collaboration",
      "Priority processing",
      "1,000 AI generations / month",
    ],
    cta: "Become a Founder",
    highlighted: false,
  },
];

/**
 * Billing architecture.
 *
 * Payments are not simulated. Plans map to a `Subscription` record and an
 * `upsertSubscription` repository call. When payments go live, attach the
 * resulting Stripe objects here (Stripe Checkout session -> subscription
 * → webhook updates `status`/`stripeCustomerId`/`currentPeriodEnd`). The
 * `billing.ts` module isolates Stripe so nothing in the UI touches it.
 */
export const BILLING = {
  stripeReady: false,
  checkoutUrl: null as string | null,
  portalUrl: null as string | null,
} as const;

export const GENERATION_WARN_AT = 80; // % of monthly quota before warning