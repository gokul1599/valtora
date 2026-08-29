/**
 * AI provider abstraction.
 *
 * ForgeAI never hard-codes AI responses. Every generation flows through
 * this interface. Two implementations exist:
 *
 *  - A remote provider (OpenAI-compatible or Anthropic) used when keys are
 *    configured — see `getActiveProvider()`.
 *  - The built-in Forge Engine, a deterministic local generator used as a
 *    realistic development fallback so the product is fully functional
 *    without external credentials.
 *
 * Providers are swappable: implement `AiProvider` and register it.
 */

export type Provenance = "ai-generated" | "engine-generated" | "verified";

export interface GenerationResult<T> {
  content: T;
  provenance: Provenance;
  provider: string;
  model: string;
}

export interface GenerationOptions<T = unknown> {
  system: string;
  user: string;
  schema?: { description: string };
  kind: string;
  temperature?: number;
}

export interface AiProvider {
  readonly id: string;
  readonly name: string;
  available(): boolean;
  generateStructured<T>(opts: GenerationOptions): Promise<GenerationResult<T>>;
}

type RemoteSpec = {
  base: string;
  path?: string;
  model: string;
  key: string;
  headers?: Record<string, string>;
  body(app: { system: string; user: string; format?: string }): Record<string, unknown>;
};

function envKey(label: string): string {
  return process.env[label] ?? "";
}

class RemoteProvider implements AiProvider {
  readonly id: string;
  readonly name: string;
  private spec: RemoteSpec;

  constructor(id: string, name: string, spec: RemoteSpec) {
    this.id = id;
    this.name = name;
    this.spec = spec;
  }

  available(): boolean {
    return Boolean(this.spec.key);
  }

  async generateStructured<T>(opts: GenerationOptions): Promise<GenerationResult<T>> {
    const s = this.spec;
    const res = await fetch(`${s.base}${s.path ?? "/chat/completions"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${s.key}`,
        ...(s.headers ?? {}),
      },
      body: JSON.stringify(
        s.body({
          system: opts.system,
          user: opts.user,
          format: opts.schema ? "json_object" : undefined,
        })
      ),
    });
    if (!res.ok) throw new Error(`${this.name} request failed (${res.status})`);
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content ?? "";
    let parsed: T = text as T;
    if (opts.schema) {
      try {
        parsed = JSON.parse(sanitizeJson(text)) as T;
      } catch {
        throw new Error("AI returned malformed JSON");
      }
    }
    return {
      content: parsed,
      provenance: "ai-generated",
      provider: this.id,
      model: s.model,
    };
  }
}

export const providers: AiProvider[] = [
  new RemoteProvider("openai", "OpenAI", {
    base: "https://api.openai.com/v1",
    model: envKey("OPENAI_MODEL") || "gpt-4o-mini",
    key: envKey("OPENAI_API_KEY"),
    body: ({ system, user, format }) => ({
      model: envKey("OPENAI_MODEL") || "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      ...(format ? { response_format: { type: format } } : {}),
    }),
  }),
  new RemoteProvider("anthropic", "Anthropic", {
    base: "https://api.anthropic.com/v1",
    path: "/messages",
    model: envKey("ANTHROPIC_MODEL") || "claude-sonnet-4-5",
    key: envKey("ANTHROPIC_API_KEY"),
    headers: { "anthropic-version": "2023-06-01" },
    // Anthropic uses /messages, so map below accordingly.
    body: ({ system, user }) => ({
      model: envKey("ANTHROPIC_MODEL") || "claude-sonnet-4-5",
      max_tokens: 4000,
      system,
      messages: [{ role: "user", content: user }],
    }),
  }),
];

export function getActiveProvider(): AiProvider | null {
  const preferred = process.env.AI_PROVIDER;
  const candidate =
    providers.find((p) => p.id === preferred && p.available()) ??
    providers.find((p) => p.available());
  return candidate ?? null;
}

/** Robustly extract JSON from model output that may include prose. */
export function sanitizeJson(text: string): string {
  const start = text.search(/[\{\[]/);
  if (start === -1) return text;
  // Find matching close bracket
  const open = text[start];
  const close = open === "{" ? "}" : "]";
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === open) depth++;
    else if (text[i] === close) {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return text.slice(start);
}

export async function generateWithProvider<T>(
  provider: AiProvider | null,
  opts: GenerationOptions,
  fallback: () => Promise<T>
): Promise<GenerationResult<T>> {
  if (provider?.available()) {
    try {
      return await provider.generateStructured<T>(opts);
    } catch (err) {
      console.error(`[AI] provider ${provider.id} failed, using engine:`, err);
      // Fall through to the local engine so the product keeps working.
    }
  }
  const content = await fallback();
  return {
    content,
    provenance: "engine-generated",
    provider: "forge-engine",
    model: "forge-engine-v1",
  };
}