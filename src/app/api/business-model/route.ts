import { NextRequest, NextResponse } from "next/server";
import { apiUser, apiStartupId } from "@/lib/api-helpers";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/** Persist the editable business model for the current startup. */
export async function PUT(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;
  const body = (await req.json().catch(() => ({}))) as any;
  const { startupId, error: err } = await apiStartupId(req, user, body);
  if (err) return err;

  const existing = await db.getBusinessModel(startupId);
  const next = {
    startupId,
    model: String(body.model ?? existing?.model ?? "").trim(),
    revenueStreams: Array.isArray(body.revenueStreams)
      ? body.revenueStreams.map(String).slice(0, 10)
      : existing?.revenueStreams ?? [],
    pricingTiers: Array.isArray(body.pricingTiers) ? body.pricingTiers : existing?.pricingTiers ?? [],
    unitEconomics: String(body.unitEconomics ?? existing?.unitEconomics ?? "").trim(),
    notes: String(body.notes ?? existing?.notes ?? "").trim(),
    updatedAt: new Date().toISOString(),
  };
  await db.saveBusinessModel(next);
  return NextResponse.json({ ok: true, businessModel: next });
}