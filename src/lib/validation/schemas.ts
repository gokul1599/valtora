import { z } from "zod";

const id = z.string().min(1);

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(8),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

export const onboardingSchema = z.object({
  idea: z.string().trim().min(20, "Describe your idea in at least 20 characters").max(4000),
  audience: z.string().trim().min(3, "Who is this for?").max(1000),
  problem: z.string().trim().min(10, "Describe the problem you solve").max(2000),
  monetization: z.string().trim().min(3, "How will you make money?").max(1000),
  journeyStage: z.enum([
    "just-idea",
    "researching",
    "building-mvp",
    "have-mvp",
    "have-customers",
    "growing",
  ]),
});

export const startupProfileSchema = z.object({
  name: z.string().trim().min(2).max(120),
  tagline: z.string().trim().max(200),
});

export const featureSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000),
  category: z.enum(["must", "should", "could", "not-now"]),
});

export const personaSchema = z.object({
  name: z.string().trim().min(2).max(80),
  role: z.string().trim().min(2).max(120),
  demographics: z.string().trim().max(1000),
  goals: z.string().trim().max(1000),
  painPoints: z.string().trim().max(1000),
  quote: z.string().trim().max(300),
  channel: z.string().trim().max(200),
  priority: z.enum(["primary", "secondary"]),
});

export const competitorSchema = z.object({
  company: z.string().trim().min(1).max(120),
  product: z.string().trim().max(300),
  targetUsers: z.string().trim().max(300),
  pricing: z.string().trim().max(200),
  strengths: z.array(z.string()).max(10).default([]),
  weaknesses: z.array(z.string()).max(10).default([]),
  differentiation: z.string().trim().max(1000),
  verified: z.boolean().default(false),
});

export const roadmapTaskSchema = z.object({
  phase: z.enum(["validation", "mvp", "beta", "launch", "growth"]),
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().max(1000),
  priority: z.enum(["low", "med", "high"]).default("med"),
  dueDate: z.string().optional(),
});

export const aiChatSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().trim().min(1).max(4000),
});

export const businessModelSchema = z.object({
  model: z.string().trim().max(200),
  revenueStreams: z.array(z.string()).max(10),
  unitEconomics: z.string().trim().max(2000),
  notes: z.string().trim().max(2000),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type FeatureInput = z.infer<typeof featureSchema>;
export type PersonaInput = z.infer<typeof personaSchema>;
export type CompetitorInput = z.infer<typeof competitorSchema>;
export type RoadmapTaskInput = z.infer<typeof roadmapTaskSchema>;
export type BusinessModelInput = z.infer<typeof businessModelSchema>;

export function parseOrNull<T>(schema: z.ZodType<T>, data: unknown): T | null {
  const res = schema.safeParse(data);
  return res.success ? res.data : null;
}