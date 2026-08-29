export type Plan = "free" | "pro" | "founder";

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash?: string;
  authProvider: "credentials" | "google";
  googleId?: string;
  avatarUrl?: string;
  plan: Plan;
  activeStartupId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionClaims {
  sub: string;
  email: string;
  name: string;
}

export type StartupStage =
  | "idea"
  | "validation"
  | "mvp"
  | "beta"
  | "launch"
  | "growth";

export type JourneyStage =
  | "just-idea"
  | "researching"
  | "building-mvp"
  | "have-mvp"
  | "have-customers"
  | "growing";

export interface Startup {
  id: string;
  userId: string;
  name: string;
  tagline: string;
  stage: StartupStage;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
}

/** Raw founder inputs captured during onboarding. */
export interface StartupProfile {
  startupId: string;
  idea: string;
  audience: string;
  problem: string;
  monetization: string;
  journeyStage: JourneyStage;
  updatedAt: string;
}

export type BlueprintSlug =
  | "vision"
  | "problem"
  | "target-customers"
  | "value-proposition"
  | "market"
  | "competition"
  | "differentiation"
  | "business-model"
  | "pricing"
  | "product"
  | "mvp"
  | "technology"
  | "roadmap"
  | "marketing"
  | "launch"
  | "risks";

export const BLUEPRINT_SECTIONS: BlueprintSlug[] = [
  "vision",
  "problem",
  "target-customers",
  "value-proposition",
  "market",
  "competition",
  "differentiation",
  "business-model",
  "pricing",
  "product",
  "mvp",
  "technology",
  "roadmap",
  "marketing",
  "launch",
  "risks",
];

export const BLUEPRINT_TITLES: Record<BlueprintSlug, string> = {
  vision: "Vision",
  problem: "Problem",
  "target-customers": "Target Customers",
  "value-proposition": "Value Proposition",
  market: "Market",
  competition: "Competition",
  differentiation: "Differentiation",
  "business-model": "Business Model",
  pricing: "Pricing",
  product: "Product",
  mvp: "MVP",
  technology: "Technology",
  roadmap: "Roadmap",
  marketing: "Marketing",
  launch: "Launch",
  risks: "Risks",
};

export interface BlueprintSection {
  id: string;
  slug: BlueprintSlug;
  title: string;
  content: string;
  status: "draft" | "reviewed" | "approved";
  updatedAt: string;
}

export interface Blueprint {
  startupId: string;
  version: number;
  generatedAt: string;
  sections: BlueprintSection[];
}

export interface Persona {
  id: string;
  startupId: string;
  name: string;
  role: string;
  demographics: string;
  goals: string;
  painPoints: string;
  quote: string;
  channel: string;
  priority: "primary" | "secondary";
  createdAt: string;
}

export interface Competitor {
  id: string;
  startupId: string;
  company: string;
  product: string;
  targetUsers: string;
  pricing: string;
  strengths: string[];
  weaknesses: string[];
  differentiation: string;
  verified: boolean;
  createdAt: string;
}

export interface MarketResearch {
  id: string;
  startupId: string;
  tam: number;
  sam: number;
  som: number;
  tamNote: string;
  samNote: string;
  somNote: string;
  trends: string[];
  growthRate: string;
  estimationMethod: string;
  verified: boolean;
  generatedAt: string;
}

export type FeatureCategory = "must" | "should" | "could" | "not-now";

export interface Feature {
  id: string;
  startupId: string;
  name: string;
  description: string;
  category: FeatureCategory;
  userStory?: string;
  status: "planned" | "in-progress" | "done";
  createdAt: string;
}

export interface Mvp {
  startupId: string;
  objective: string;
  coreFeatures: string[];
  userStories: string[];
  screens: string[];
  databaseRequirements: string[];
  apis: string[];
  authentication: string;
  integrations: string[];
  devTasks: string[];
  status: "draft" | "approved";
  version: number;
  updatedAt: string;
}

export type RoadmapPhase = "validation" | "mvp" | "beta" | "launch" | "growth";

export const ROADMAP_PHASES: { id: RoadmapPhase; label: string }[] = [
  { id: "validation", label: "Validation" },
  { id: "mvp", label: "MVP" },
  { id: "beta", label: "Beta" },
  { id: "launch", label: "Launch" },
  { id: "growth", label: "Growth" },
];

export interface RoadmapTask {
  id: string;
  startupId: string;
  phase: RoadmapPhase;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "med" | "high";
  dueDate?: string;
  order: number;
  createdAt: string;
}

export interface PricingTier {
  name: string;
  price: string;
  cadence: string;
  features: string[];
  highlighted: boolean;
}

export interface BusinessModel {
  startupId: string;
  model: string;
  revenueStreams: string[];
  pricingTiers: PricingTier[];
  unitEconomics: string;
  notes: string;
  updatedAt: string;
}

export type ProductArea =
  | "product-vision"
  | "personas"
  | "user-stories"
  | "prioritization"
  | "user-flow";

export interface ProductVision {
  startupId: string;
  vision: string;
  valueProposition: string;
  customerSegments: string[];
  goals: string[];
  updatedAt: string;
}

export interface UserStory {
  id: string;
  startupId: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string;
  category: FeatureCategory;
  createdAt: string;
}

export const USER_FLOW_STEPS = [
  "Landing",
  "Signup",
  "Onboarding",
  "Dashboard",
  "Core Product",
  "Payment",
  "Retention",
];

export interface MarketingPlan {
  startupId: string;
  positioning: string;
  tagline: string;
  landingCopy: string;
  targetAudience: string;
  acquisitionChannels: string[];
  contentStrategy: string[];
  socialStrategy: string[];
  launchCampaign: string[];
  emailCampaign: string[];
  seoIdeas: string[];
  updatedAt: string;
}

export interface TechnicalPlan {
  startupId: string;
  summary: string;
  frontend: string;
  backend: string;
  database: string;
  authentication: string;
  infrastructure: string;
  ai: string;
  integrations: string[];
  dataModel: { entity: string; purpose: string; relations: string }[];
  updatedAt: string;
}

export interface LaunchItem {
  id: string;
  startupId: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "in-progress" | "done";
  order: number;
  createdAt: string;
}

export type AiActionType =
  | "create-feature"
  | "delete-feature"
  | "modify-roadmap"
  | "create-persona"
  | "update-business-model"
  | "generate-pricing"
  | "create-task"
  | "change-priority"
  | "generate-launch-plan";

export interface AiAction {
  id: string;
  type: AiActionType;
  summary: string;
  payload: unknown;
  status: "pending-approval" | "approved" | "applied" | "rejected";
  createdAt: string;
}

export interface AiMessage {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  kind: "chat" | "action";
  action?: AiAction;
  createdAt: string;
}

export interface AiConversation {
  id: string;
  startupId: string;
  userId: string;
  title: string;
  messages: AiMessage[];
  createdAt: string;
  updatedAt: string;
}

export type AiGenerationKind =
  | "blueprint"
  | "blueprint-section"
  | "market"
  | "competitors"
  | "personas"
  | "mvp"
  | "product-vision"
  | "business-model"
  | "pricing"
  | "marketing"
  | "launch"
  | "roadmap"
  | "technical"
  | "chat";

export interface AiGeneration {
  id: string;
  userId: string;
  startupId: string;
  kind: AiGenerationKind;
  provider: string;
  model: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: Plan;
  status: "trialing" | "active" | "past_due" | "canceled";
  stripeCustomerId?: string;
  currentPeriodEnd?: string;
  createdAt: string;
}

export interface Document {
  id: string;
  startupId: string;
  kind: "markdown" | "json" | "csv" | "pdf";
  title: string;
  content: string;
  createdAt: string;
}

/** Startup intelligence output — computed + generated, with explicit provenance. */
export interface StartupScore {
  total: number; // 0-100
  breakdown: {
    problem: number;
    market: number;
    competition: number;
    differentiation: number;
    monetization: number;
    feasibility: number;
    growth: number;
  };
  grade: string;
  isEstimate: boolean;
}

export interface StartupAssessment {
  startupId: string;
  score: StartupScore;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  risks: string[];
  nextActions: string[];
  stage: StartupStage;
  generatedAt: string;
}

export type MarketResearchInput = MarketResearch;
export type RoadmapInput = RoadmapTask;
export type MvpInput = Mvp;
export type CompetitorInput = Competitor;
export type PersonaInput = Persona;
export type FeatureInput = Feature;
export type MarketingInput = MarketingPlan;
export type LaunchInput = LaunchItem;
export type BusinessModelInput = BusinessModel;
export type ProductVisionInput = ProductVision;
export type UserStoryInput = UserStory;
export type BlueprintInput = Blueprint;
export type AiGenerationInput = AiGeneration;
export type DocumentInput = Document;
export type StartupInput = Startup;
export type UserInput = User;
export type StartupProfileInput = StartupProfile;
export type SubscriptionInput = Subscription;
export type AiConversationInput = AiConversation;
export type AiMessageInput = AiMessage;
export type AiActionInput = AiAction;

export type { StartupContext } from "../ai/context";