import { NextRequest, NextResponse } from "next/server";
import { aiChatSchema } from "@/lib/validation/schemas";
import { apiUser, apiStartupId } from "@/lib/api-helpers";
import { getStartup, buildContextFor } from "@/lib/startup";
import { db } from "@/lib/db";
import { newId, now as tsNow } from "@/lib/db/store";
import { buildFallbackReply, detectAction } from "@/lib/ai/engine/chat";
import { buildChatPrompt } from "@/lib/ai/engine/chat";
import { generateWithProvider, getActiveProvider } from "@/lib/ai/provider";
import { buildSystemPrompt } from "@/lib/ai/prompt-builder";
import { getUsage } from "@/lib/auth/usage";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const parsed = aiChatSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Message required" }, { status: 422 });

  const { startupId, error: err } = await apiStartupId(req as any, user, body);
  if (err) return err;

  const usage = await getUsage(user);
  if (!usage.ok)
    return NextResponse.json(
      { error: `Monthly AI limit reached (${usage.used}/${usage.limit}).`, usage },
      { status: 429 }
    );

  const startup = await getStartup(startupId);
  if (!startup) return NextResponse.json({ error: "Startup not found" }, { status: 404 });
  const ctx = await buildContextFor(startup);

  // Resolve or create the conversation.
  let conversation = parsed.data.conversationId
    ? await db.getConversation(parsed.data.conversationId)
    : null;
  if (conversation && conversation.startupId !== startupId)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!conversation) {
    conversation = await db.createConversation({
      id: newId("conv"),
      startupId,
      userId: user.id,
      title: parsed.data.message.slice(0, 48),
      messages: [],
      createdAt: tsNow(),
      updatedAt: tsNow(),
    });
  }

  await db.appendMessage(conversation.id, {
    id: newId("msg"),
    conversationId: conversation.id,
    role: "user",
    content: parsed.data.message,
    kind: "chat",
    createdAt: tsNow(),
  });

  // Detect a prospective structured action.
  const action = detectAction(parsed.data.message);

  // 1) If a provider is configured, let it write the answer.
  const active = getActiveProvider();
  let text: string;

  if (active?.available()) {
    try {
      const history = conversation.messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await generateWithProvider(
        active,
        {
          system: buildSystemPrompt("answering the founder from startup context", true),
          user: buildChatPrompt(ctx, history, parsed.data.message),
          kind: "chat",
        },
        async () => buildFallbackReply(ctx, parsed.data.message)
      );
      text = typeof res.content === "string" ? res.content : String(res.content);
    } catch {
      text = buildFallbackReply(ctx, parsed.data.message);
    }
  } else {
    text = buildFallbackReply(ctx, parsed.data.message);
  }

  // 2) Build the approval action when an intent fired.
  let savedAction: { id: string; type: string; summary: string; status: string; payload: unknown } | undefined;
  if (action) {
    const payload: Record<string, unknown> =
      typeof action.payload === "object" && action.payload
        ? (action.payload as Record<string, unknown>)
        : {};
    const summary = summarizeActionText(action.type, parsed.data.message, ctx);
    savedAction = {
      id: newId("act"),
      type: action.type,
      summary,
      status: "pending-approval",
      payload: { ...payload, prompt: parsed.data.message },
    };
  }

  await db.appendMessage(conversation.id, {
    id: newId("msg"),
    conversationId: conversation.id,
    role: "assistant",
    content: text,
    kind: savedAction ? "action" : "chat",
    action: savedAction,
    createdAt: tsNow(),
  });

  await db.createGeneration({
    id: newId("gen"),
    userId: user.id,
    startupId,
    kind: "chat",
    provider: "forge-engine",
    model: "forge-engine-v1",
    createdAt: tsNow(),
  });

  const updated = await db.getConversation(conversation.id);
  return NextResponse.json({ conversation: updated });
}

function summarizeActionText(type: string, message: string, ctx: { startup: { name: string }; profile: { idea: string } }): string {
  const idea = ctx.profile.idea.slice(0, 90);
  switch (type) {
    case "create-feature":
      return `Add a new feature to the backlog for ${ctx.startup.name}. Based on your request: "${message.slice(0, 70)}".`;
    case "delete-feature":
      return `Remove a feature from the ${ctx.startup.name} backlog. I'll match it to the closest item.`;
    case "create-task":
      return `Create a roadmap task under ${ctx.startup.name}.`;
    case "change-priority":
      return `Reprioritize a task or move it between roadmap phases.`;
    case "modify-roadmap":
      return `Adjust the roadmap plan for ${ctx.startup.name}.`;
    case "create-persona":
      return `Create a new customer persona for ${ctx.startup.name}, focused on ${idea}.`;
    case "update-business-model":
      return `Update the business model — streams, tiers or unit economics — for ${ctx.startup.name}.`;
    case "generate-pricing":
      return `Generate a three-tier pricing model matched to ${ctx.startup.name}.`;
    case "generate-launch-plan":
      return `Generate the full launch checklist for ${ctx.startup.name}.`;
    default:
      return `Apply the requested change to ${ctx.startup.name}.`;
  }
}