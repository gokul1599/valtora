import { z } from "zod";

export const jsonText = z.string().describe("Markdown-friendly text content");

export const blueprintSchema = z.object({
  vision: z.object({
    mission: jsonText,
    summary: jsonText,
    northStar: jsonText,
    values: z.array(jsonText).max(5),
  }),
  problem: z.object({
    coreProblem: jsonText,
    whoFeelsIt: jsonText,
    painMagnitude: jsonText,
    existingSolutions: z.array(jsonText).max(5),
    whyNow: jsonText,
  }),
  targetCustomers: z.object({
    primary: jsonText,
    secondary: z.array(jsonText).max(4),
    earlyAdopters: jsonText,
  }),
  valueProposition: z.object({
    promise: jsonText,
    differentiators: z.array(jsonText).max(4),
    whyBetter: jsonText,
  }),
  market: z.object({
    marketDefinition: jsonText,
    tam: jsonText,
    sam: jsonText,
    som: jsonText,
    growthDrivers: z.array(jsonText).max(5),
    marketChallenges: z.array(jsonText).max(5),
  }),
  competitors: z.array(
    z.object({
      name: jsonText,
      description: jsonText,
      strengths: z.array(jsonText).max(4),
      weaknesses: z.array(jsonText).max(4),
      positioning: jsonText,
      opportunity: jsonText,
    }),
  ).max(6),
  differentiation: z.object({
    strategy: jsonText,
    defensibility: jsonText,
    moat: jsonText,
  }),
  businessModel: z.object({
    customerSegments: z.array(jsonText).max(5),
    valueProposition: jsonText,
    channels: z.array(jsonText).max(5),
    customerRelationships: jsonText,
    revenueStreams: z.array(
      z.object({
        name: jsonText,
        source: jsonText,
      }),
    ).max(5),
    keyResources: z.array(jsonText).max(5),
    keyActivities: z.array(jsonText).max(5),
    keyPartnerships: z.array(jsonText).max(5),
    costStructure: z.array(jsonText).max(5),
  }),
  pricing: z.array(
    z.object({
      name: jsonText,
      targetCustomer: jsonText,
      priceHypothesis: jsonText,
      features: z.array(jsonText).max(6),
      valueJustification: jsonText,
      upgradeTrigger: jsonText,
    }),
  ).max(4),
  product: z.object({
    vision: jsonText,
    positioning: jsonText,
    primaryUseCases: z.array(jsonText).max(5),
    featureList: z.array(
      z.object({
        name: jsonText,
        description: jsonText,
        priority: z.enum(["low", "medium", "high", "critical"]),
        status: z.enum(["proposed", "planned", "in-progress", "done"]).default("proposed"),
        effort: z.number().int().min(1).max(5),
        impact: z.number().int().min(1).max(5),
        confidence: z.number().int().min(1).max(5),
      }),
    ).max(20),
  }),
  mvp: z.object({
    objective: jsonText,
    coreFeatures: z.array(jsonText).max(8),
    excludedFeatures: z.array(jsonText).max(8),
    userStories: z.array(jsonText).max(8),
    requiredScreens: z.array(jsonText).max(8),
    dependencies: z.array(jsonText).max(5),
    developmentTasks: z.array(jsonText).max(10),
    successMetrics: z.array(jsonText).max(5),
  }),
  technology: z.object({
    frontend: jsonText,
    backend: jsonText,
    database: jsonText,
    authentication: jsonText,
    ai: jsonText,
    integrations: z.array(jsonText).max(6),
    infrastructure: jsonText,
    deployment: jsonText,
    risks: z.array(jsonText).max(5),
  }),
  roadmap: z.object({
    phases: z.array(
      z.object({
        stage: z.string(),
        focus: jsonText,
        tasks: z.array(jsonText).max(8),
        duration: jsonText,
      }),
    ).max(6),
  }),
  marketing: z.object({
    positioning: jsonText,
    messaging: jsonText,
    tagline: jsonText,
    icp: jsonText,
    acquisitionChannels: z.array(jsonText).max(6),
    contentStrategy: z.array(jsonText).max(6),
    seoIdeas: z.array(jsonText).max(6),
    launchCampaign: z.array(jsonText).max(6),
  }),
  launch: z.object({
    preLaunch: z.array(jsonText).max(6),
    launchWeek: z.array(jsonText).max(6),
    postLaunch: z.array(jsonText).max(6),
    metrics: z.array(jsonText).max(5),
    risks: z.array(jsonText).max(5),
  }),
  risks: z.array(
    z.object({
      risk: jsonText,
      severity: z.enum(["low", "medium", "high", "critical"]),
      likelihood: z.enum(["low", "medium", "high"]),
      mitigation: jsonText,
    }),
  ).max(8),
  nextActions: z.array(jsonText).max(6),
});

export type Blueprint = z.infer<typeof blueprintSchema>;

// ---- Lightweight single-section output schemas used by individual "regenerate" calls ----

export const visionSchema = blueprintSchema.pick({ vision: true });
export const problemSchema = blueprintSchema.pick({ problem: true });
export const productSchema = z.object({
  vision: jsonText,
  positioning: jsonText,
  primaryUseCases: z.array(jsonText).max(5),
  featureList: z.array(
    z.object({
      name: jsonText,
      description: jsonText,
      priority: z.enum(["low", "medium", "high", "critical"]),
      status: z.enum(["proposed", "planned", "in-progress", "done"]).default("proposed"),
      effort: z.number().int().min(1).max(5),
      impact: z.number().int().min(1).max(5),
      confidence: z.number().int().min(1).max(5),
    }),
  ).max(20),
});

export const businessModelSchema = z.object({
  customerSegments: z.array(jsonText).max(6),
  valueProposition: jsonText,
  channels: z.array(jsonText).max(6),
  customerRelationships: jsonText,
  revenueStreams: z.array(
    z.object({ name: jsonText, source: jsonText }),
  ).max(6),
  keyResources: z.array(jsonText).max(6),
  keyActivities: z.array(jsonText).max(6),
  keyPartnerships: z.array(jsonText).max(6),
  costStructure: z.array(jsonText).max(6),
});
export const personasSchema = z.array(
  z.object({
    name: jsonText,
    role: jsonText,
    industry: jsonText,
    companySize: jsonText,
    goals: z.array(jsonText).max(5),
    painPoints: z.array(jsonText).max(5),
    existingAlternatives: z.array(jsonText).max(5),
    buyingTriggers: z.array(jsonText).max(5),
    objections: z.array(jsonText).max(5),
    willingnessToPay: jsonText,
    acquisitionChannels: z.array(jsonText).max(5),
  }),
).max(4);

export const competitorAnalysesSchema = z.array(
  z.object({
    name: jsonText,
    website: jsonText.optional().default(""),
    description: jsonText,
    targetCustomers: jsonText,
    pricing: jsonText,
    strengths: z.array(jsonText).max(5),
    weaknesses: z.array(jsonText).max(5),
    positioning: jsonText,
    differentiationOpportunity: jsonText,
  }),
).max(6);

export const marketAnalysisSchema = z.object({
  marketDefinition: jsonText,
  customerSegments: z.array(jsonText).max(6),
  tam: jsonText,
  sam: jsonText,
  som: jsonText,
  growthDrivers: z.array(jsonText).max(6),
  challenges: z.array(jsonText).max(6),
  opportunities: z.array(jsonText).max(6),
  verifiedFacts: z.array(jsonText).max(5),
  assumptions: z.array(jsonText).max(5),
});

export const pricingStrategySchema = z.array(
  z.object({
    name: jsonText,
    targetCustomer: jsonText,
    priceHypothesis: jsonText,
    features: z.array(jsonText).max(6),
    valueJustification: jsonText,
    upgradeTrigger: jsonText,
  }),
).max(4);

export const mvpPlanSchema = z.object({
  objective: jsonText,
  coreFeatures: z.array(jsonText).max(8),
  excludedFeatures: z.array(jsonText).max(8),
  userStories: z.array(jsonText).max(8),
  requiredScreens: z.array(jsonText).max(8),
  apiRequirements: z.array(jsonText).max(8),
  databaseRequirements: z.array(jsonText).max(8),
  authRequirements: jsonText,
  integrations: z.array(jsonText).max(6),
  developmentTasks: z.array(jsonText).max(12),
});

export const roadmapPlanSchema = z.object({
  phases: z.array(
    z.object({
      stage: z.string(),
      focus: jsonText,
      tasks: z.array(jsonText).max(10),
      duration: jsonText,
    }),
  ).max(6),
});

export const marketingPlanSchema = z.object({
  positioning: jsonText,
  messaging: jsonText,
  tagline: jsonText,
  icp: jsonText,
  acquisitionChannels: z.array(jsonText).max(8),
  contentStrategy: z.array(jsonText).max(8),
  seoIdeas: z.array(jsonText).max(8),
  socialStrategy: z.array(jsonText).max(8),
  emailCampaigns: z.array(jsonText).max(8),
  launchCampaign: z.array(jsonText).max(8),
});

export const launchPlanSchema = z.object({
  product: z.array(jsonText).max(8),
  business: z.array(jsonText).max(8),
  marketing: z.array(jsonText).max(8),
  launch: z.array(jsonText).max(8),
  completionCriteria: z.array(jsonText).max(8),
});

export const techArchitectureSchema = z.object({
  frontend: jsonText,
  backend: jsonText,
  database: jsonText,
  authentication: jsonText,
  storage: jsonText,
  ai: jsonText,
  integrations: z.array(jsonText).max(6),
  infrastructure: jsonText,
  deployment: jsonText,
  diagram: jsonText.optional().default(""),
});