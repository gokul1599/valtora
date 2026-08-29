import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./auth/session";
import { getUserById, getStartup, userOwnsStartup } from "./db";
import type { User } from "./types";

export async function apiUser(): Promise<
  { user: User; error: null } | { user: null; error: NextResponse }
> {
  const session = await getSession();
  if (!session)
    return { user: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const user = await getUserById(session.sub);
  if (!user)
    return { user: null, error: NextResponse.json({ error: "User not found" }, { status: 401 }) };
  return { user, error: null };
}

/** Resolve the target startup: explicit id (ownership-checked) or the active one. */
export async function apiStartupId(
  req: NextRequest,
  user: User,
  body?: unknown
): Promise<{ startupId: string; error: null } | { startupId: null; error: NextResponse }> {
  const raw = body ? (body as { startupId?: string }).startupId : undefined;
  if (raw) {
    if (!(await userOwnsStartup(user.id, raw)))
      return { startupId: null, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    return { startupId: raw, error: null };
  }
  if (user.activeStartupId && (await userOwnsStartup(user.id, user.activeStartupId)))
    return { startupId: user.activeStartupId, error: null };
  const startups = await (await import("./db")).getStartups(user.id);
  if (!startups.length)
    return { startupId: null, error: NextResponse.json({ error: "No startup found" }, { status: 404 }) };
  return { startupId: startups[0].id, error: null };
}

export async function readJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

export function ok(data: unknown): NextResponse {
  return NextResponse.json({ ok: true, data });
}

export function okData(data: unknown): NextResponse {
  return NextResponse.json(data);
}