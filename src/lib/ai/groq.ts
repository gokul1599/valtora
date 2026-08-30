import "server-only";

import Groq from "groq-sdk";

const DEFAULT_MODEL = "qwen/qwen3.8-27b";

let cached: Groq | null = null;

export function getGroqClient(): Groq {
  if (cached) return cached;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not configured. Add it to your environment variables.",
    );
  }
  cached = new Groq({ apiKey });
  return cached;
}

export function getModel(): string {
  return process.env.GROQ_MODEL ?? DEFAULT_MODEL;
}

export function isAiConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}