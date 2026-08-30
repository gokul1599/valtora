import "server-only";

import type { ZodType } from "zod";
import { getGroqClient, getModel } from "@/lib/ai/groq";

export interface AiResult<T> {
  data: T;
  raw: string;
  tokensIn: number;
  tokensOut: number;
  durationMs: number;
}

export interface AiProvider {
  generateStructured<T>(
    opts: {
      system: string;
      prompt: string;
      zodSchema: ZodType<T>;
      temperature?: number;
      maxTokens?: number;
    },
  ): Promise<AiResult<T>>;

  chat(opts: {
    system: string;
    messages: Array<{ role: "user" | "assistant"; content: string }>;
    temperature?: number;
    maxTokens?: number;
  }): Promise<AiResult<string>>;
}

/**
 * Groq provider. Kept fully server-side. Never import into client components.
 */
export class GroqProvider implements AiProvider {
  async generateStructured<T>(opts: {
    system: string;
    prompt: string;
    zodSchema: ZodType<T>;
    temperature?: number;
    maxTokens?: number;
  }): Promise<AiResult<T>> {
    const started = Date.now();
    const client = getGroqClient();
    const model = getModel();

    const userContent = `${opts.prompt}\n\nReturn ONLY valid JSON that conforms to the schema described. No markdown, no commentary.`;

    // Retry once on schema noncompliance: long structured outputs are prone to
    // occasional structural slips (arrays rendered as strings, truncated keys).
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await client.chat.completions.create({
        model,
        temperature: opts.temperature ?? 0.4,
        max_tokens: opts.maxTokens ?? 4000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: opts.system },
          { role: "user", content: userContent },
        ],
      });

      const raw = response.choices[0]?.message?.content ?? "";
      const tokenUsage = response.usage;
      const tokensIn = tokenUsage?.prompt_tokens ?? 0;
      const tokensOut = tokenUsage?.completion_tokens ?? 0;
      const durationMs = Date.now() - started;

      const parsed = safeJsonParse(raw);
      const validated = opts.zodSchema.safeParse(parsed);
      if (validated.success) {
        return { data: validated.data, raw, tokensIn, tokensOut, durationMs };
      }

      const messages =
        validated.error?.issues
          ?.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
          .join("; ") ?? "Unknown validation error";

      if (attempt === 1) {
        throw new Error(`AI returned invalid structured data: ${messages}`);
      }
    }

    throw new Error("AI generation failed unexpectedly");
  }

  async chat(opts: {
    system: string;
    messages: Array<{ role: "user" | "assistant"; content: string }>;
    temperature?: number;
    maxTokens?: number;
  }): Promise<AiResult<string>> {
    const started = Date.now();
    const client = getGroqClient();
    const model = getModel();

    const response = await client.chat.completions.create({
      model,
      temperature: opts.temperature ?? 0.5,
      max_tokens: opts.maxTokens ?? 2000,
      messages: [
        { role: "system", content: opts.system },
        ...opts.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
    });

    const raw = response.choices[0]?.message?.content ?? "";
    const tokenUsage = response.usage;

    return {
      data: raw,
      raw,
      tokensIn: tokenUsage?.prompt_tokens ?? 0,
      tokensOut: tokenUsage?.completion_tokens ?? 0,
      durationMs: Date.now() - started,
    };
  }
}

function safeJsonParse(text: string): unknown {
  const cleaned = text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
  // If wrapped in array/object, try direct parse; fallback to extraction.
  try {
    return JSON.parse(cleaned);
  } catch {
    // Attempt to find JSON between first { and last }
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        // fall through
      }
    }
    throw new Error("AI returned unparseable JSON");
  }
}

/** Factory: swap providers here without touching the rest of the app. */
export function createProvider(): AiProvider {
  return new GroqProvider();
}