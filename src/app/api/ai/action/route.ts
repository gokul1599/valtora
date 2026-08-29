import { NextRequest, NextResponse } from "next/server";
import { apiUser } from "@/lib/api-helpers";
import { db } from "@/lib/db";
import { getStartup, buildContextFor } from "@/lib/startup";
import { applyAction } from "@/lib/ai/actions";
import type { AiActionType } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;

  const body = (await req.json().catch(() => ({}))) as {
    conversationId?: string;
    actionId?: string;
    approve?: boolean;
  };

  if (!body.conversationId || !body.actionId)
    return NextResponse.json({ error: "conversationId and actionId required" }, { status: 422 });

  const conversation = await db.getConversation(body.conversationId);
  if (!conversation || conversation.userId !== user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const message = conversation.messages.find(
    (m) => m.action?.id === body.actionId
  );
  if (!message?.action)
    return NextResponse.json({ error: "Action not found" }, { status: 404 });

  const approve = body.approve !== false;

  if (!approve) {
    await db.updateMessage(conversation.id, message.id, {
      action: { ...message.action, status: "rejected" },
    });
    return NextResponse.json({ ok: true, status: "rejected" });
  }

  // Reset to approve → apply
  const startup = await getStartup(conversation.startupId);
  if (!startup) return NextResponse.json({ error: "Startup not found" }, { status: 404 });
  if (startup.userId !== user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const ctx = await buildContextFor(startup);
  const result = await applyAction(
    message.action.type as AiActionType,
    (message.action.payload as Record<string, unknown>) ?? {},
    ctx
  );

  await db.updateMessage(conversation.id, message.id, {
    action: {
      ...message.action,
      status: result.ok ? "applied" : "rejected",
    },
    content: result.ok
      ? message.content + `\n\n✅ **Applied:** ${result.message}`
      : message.content,
  });

  return NextResponse.json({ ok: result.ok, message: result.message, status: result.ok ? "applied" : "rejected" });
}