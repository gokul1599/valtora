import { NextRequest, NextResponse } from "next/server";
import { apiUser, apiStartupId } from "@/lib/api-helpers";
import { getStartup, buildContextFor } from "@/lib/startup";
import type { StartupContext } from "@/lib/ai/context";

export const runtime = "nodejs";

/** Return the full context ForgeAI holds for the current startup. */
export async function GET(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;

  const { startupId, error: err } = await apiStartupId(req, user);
  if (err) return err;

  const startup = await getStartup(startupId);
  if (!startup) return NextResponse.json({ error: "Startup not found" }, { status: 404 });

  const context: StartupContext = await buildContextFor(startup);
  return NextResponse.json({ context });
}