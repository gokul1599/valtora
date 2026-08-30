import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().trim().email("Enter a valid email").max(120),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(120),
  password: z.string().min(1, "Password is required"),
});

export const onboardingSchema = z.object({
  idea: z.string().trim().min(20, "Describe your idea in more detail (20+ characters)").max(2000),
  audience: z.string().trim().min(3, "Who is it for?").max(500),
  problem: z.string().trim().min(10, "What problem does it solve?").max(1000),
  monetization: z.string().trim().min(3, "How will it make money?").max(500),
  stage: z.enum(["idea", "researching", "prototype", "mvp", "early_customers", "growth"]),
  goal: z.string().trim().min(10, "What do you want to achieve in 90 days?").max(500),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export const startupNameSchema = z.object({
  name: z.string().trim().min(2).max(80),
});

export const sectionSaveSchema = z.object({
  key: z.string().min(1),
  data: z.unknown(),
});

export const featureSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  effort: z.number().int().min(1).max(5).default(1),
  impact: z.number().int().min(1).max(5).default(1),
  confidence: z.number().int().min(1).max(5).default(3),
});

export const taskSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  stage: z.string().default("validation"),
});

export const chatSchema = z.object({
  message: z.string().trim().min(1).max(4000),
  startupId: z.string().optional(),
  conversationId: z.string().optional(),
});
export type ChatInput = z.infer<typeof chatSchema>;

export const upgradeSchema = z.object({
  plan: z.enum(["pro", "founder"]),
});