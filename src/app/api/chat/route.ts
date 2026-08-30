import { NextRequest } from "next/server";
import { requireUser, jsonError } from "@/lib/api-helpers";
import { db } from "@/lib/db";
import { createProvider } from "@/lib/ai/provider";
import { systemPrompt } from "@/lib/ai/prompts";
import { chatSchema, type ChatInput } from "@/lib/validation/schemas";
import { recordGeneration, countGenerationsThisMonth } from "@/lib/startup";
import { PLAN_LIMITS, type PlanKey } from "@/lib/constants";
import { isAiConfigured } from "@/lib/ai/groq";

const provider = createProvider();

export async function GET() {
  const user = await requireUser();
  const conversations = await db.aiConversation.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: 50,
    select: {
      id: true,
      title: true,
      startupId: true,
      updatedAt: true,
      messages: { orderBy: { createdAt: "asc" }, take: 2 },
    },
  });

  return Response.json({ conversations });
}

export async function POST(request: NextRequest) {
  const user = await requireUser();

  if (!isAiConfigured()) {
    return jsonError(
      "Zorvyn AI is not configured. Set GROQ_API_KEY to enable conversations.",
      503,
    );
  }

  const planKey: PlanKey = (user.plan as PlanKey) ?? "free";
  const used = await countGenerationsThisMonth(user.id);
  if (used >= PLAN_LIMITS[planKey].aiGenerationsPerMonth) {
    return jsonError(
      `You've reached your monthly limit of ${PLAN_LIMITS[planKey].aiGenerationsPerMonth} AI generations.`,
      429,
    );
  }

  let body: ChatInput = { message: "" };
  try {
    const json = await request.json();
    const parsed = chatSchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid message", 400);
    }
    body = parsed.data;
  } catch {
    return jsonError("Invalid JSON body");
  }

  // Resolve startup context.
  let startup = null;
  if (body.startupId) {
    startup = await db.startup.findFirst({
      where: { id: body.startupId, userId: user.id },
    });
  }

  // Resolve or create conversation.
  let conversation = null;
  if (body.conversationId) {
    conversation = await db.aiConversation.findFirst({
      where: { id: body.conversationId, userId: user.id },
      include: { messages: { orderBy: { createdAt: "asc" }, take: 12 } },
    });
  }
  if (!conversation) {
    conversation = await db.aiConversation.create({
      data: {
        userId: user.id,
        startupId: startup?.id ?? null,
        title: body.message.slice(0, 60),
        messages: { create: [{ role: "user", content: body.message }] },
      },
      include: { messages: true },
    });
  } else {
    await db.aiMessage.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: body.message,
      },
    });
  }

  // Gather startup context for the AI.
  let sectionContext = "";
  if (startup) {
    const sections = await db.startupSection.findMany({
      where: { startupId: startup.id },
    });
    sectionContext = sections
      .map((s) => `${s.key}:\n${JSON.stringify(s.data)}`)
      .join("\n\n");
  }

  const history = conversation.messages
    .filter((m) => m.role !== "user" || m.content !== body.message || m.id === conversation.messages.at(-1)?.id)
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

  const started = Date.now();
  let reply: string;
  let tokensIn = 0;
  let tokensOut = 0;
  try {
    const result = await provider.chat({
      system: systemPrompt(
        startup
          ? {
              startup: { name: startup.name, idea: startup.idea, stage: startup.stage },
              sections: sectionContext.slice(0, 12000),
            }
          : undefined,
      ),
      messages: history,
    });
    reply = result.data;
    tokensIn = result.tokensIn;
    tokensOut = result.tokensOut;
  } catch (err) {
    await recordGeneration({
      userId: user.id,
      startupId: startup?.id,
      action: "chat",
      status: "error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
    return jsonError("We couldn't reach Zorvyn AI right now. Please try again.", 502);
  }

  await db.aiMessage.create({
    data: { conversationId: conversation.id, role: "assistant", content: reply },
  });

  await db.aiConversation.update({
    where: { id: conversation.id },
    data: { updatedAt: new Date() },
  });

  await recordGeneration({
    userId: user.id,
    startupId: startup?.id,
    action: "chat",
    tokensIn,
    tokensOut,
    durationMs: Date.now() - started,
  });

  return Response.json({
    ok: true,
    reply,
    conversationId: conversation.id,
    conversationTitle: conversation.title,
  });
}