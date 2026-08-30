export const APP_NAME = "VALTORA";
export const AI_NAME = "Zorvyn";
export const AI_FULL_NAME = "Zorvyn AI";

export type PlanKey = "free" | "pro" | "founder";

export interface PlanConfig {
  label: string;
  startups: number;
  aiGenerationsPerMonth: number;
  tagline: string;
  features: string[];
}

export const PLAN_LIMITS: Record<PlanKey, PlanConfig> = {
  free: {
    label: "Free",
    startups: 1,
    aiGenerationsPerMonth: 20,
    tagline: "For validating a single idea.",
    features: [
      "1 startup",
      "Startup blueprint",
      "Basic AI (20 generations / month)",
      "Dashboard & next actions",
    ],
  },
  pro: {
    label: "Pro",
    startups: 10,
    aiGenerationsPerMonth: 200,
    tagline: "For founders building seriously.",
    features: [
      "Seek unlimited",
      "10 startups",
      "Advanced AI (200 generations / month)",
      "Market & competitor intelligence",
      "MVP generator",
      "Technical architecture",
      "Interactive roadmap",
      "Export suite",
    ],
  },
  founder: {
    label: "Founder",
    startups: 100,
    aiGenerationsPerMonth: 1000,
    tagline: "For teams and power founders.",
    features: [
      "Seek unlimited",
      "100 startups",
      "Highest AI usage (1000 generations / month)",
      "Team collaboration",
      "AI automation",
      "Advanced reports",
      "Priority processing",
    ],
  },
};

export const STAGES = [
  { key: "idea", label: "Just an idea" },
  { key: "researching", label: "Researching" },
  { key: "prototype", label: "Prototype" },
  { key: "mvp", label: "MVP" },
  { key: "early_customers", label: "Early customers" },
  { key: "growth", label: "Growth" },
] as const;

export const STAGE_LABELS: Record<string, string> = Object.fromEntries(
  STAGES.map((s) => [s.key, s.label]),
);

export const SCORE_DIMENSIONS = [
  "Problem strength",
  "Market opportunity",
  "Differentiation",
  "Customer clarity",
  "Monetization",
  "Feasibility",
  "Execution readiness",
] as const;

export const SEMANTIC_COLORS = {
  bg: "#08090B",
  surface: "#0D0F12",
  elevated: "#13161A",
  border: "#242930",
  fg: "#F5F7FA",
  secondary: "#9AA2AD",
  muted: "#68717D",
  accent: "#7C6BFF",
  accentSoft: "#6255D8",
  success: "#39B979",
  warning: "#D99B36",
  danger: "#D85C63",
} as const;

export const BILLING = {
  stripeReady: false,
  provider: "none",
} as const;