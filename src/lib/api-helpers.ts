import "server-only";

import { NextResponse } from "next/server";
import { getSession, type SessionPayload } from "@/lib/auth/session";
import { db } from "@/lib/db";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Response("Unauthorized", { status: 401 });
  return session;
}

export async function requireUser() {
  const session = await requireSession();
  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user) throw new Response("User not found", { status: 401 });
  return user;
}

export function zodErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "issues" in error) {
    const issues = (error as { issues?: Array<{ message: string }> }).issues;
    return issues?.[0]?.message ?? "Invalid input";
  }
  return "Invalid input";
}

export function parseBody<T>(
  text: string,
): { data: T } | { error: string } {
  try {
    return { data: JSON.parse(text) as T };
  } catch {
    return { error: "Invalid JSON body" };
  }
}