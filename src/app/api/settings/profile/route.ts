import { NextRequest, NextResponse } from "next/server";
import { apiUser } from "@/lib/api-helpers";
import { updateUser } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

export const runtime = "nodejs";

/** Update profile (name / avatar). */
export async function PUT(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;

  const body = (await req.json().catch(() => ({}))) as { name?: string };
  const patch: { name?: string } = {};
  if (typeof body.name === "string" && body.name.trim().length >= 2)
    patch.name = body.name.trim().slice(0, 80);
  if (!Object.keys(patch).length)
    return NextResponse.json({ error: "Nothing to update" }, { status: 422 });

  const updated = await updateUser(user.id, patch);
  return NextResponse.json({ ok: true, user: updated });
}

/** Change password. */
export async function POST(req: NextRequest) {
  const { user, error } = await apiUser();
  if (error) return error;

  const body = (await req.json().catch(() => ({}))) as {
    currentPassword?: string;
    newPassword?: string;
  };

  if (!user.passwordHash) {
    return NextResponse.json({ error: "Password login isn't enabled for this account." }, { status: 422 });
  }
  if (!body.currentPassword || await verifyPassword(body.currentPassword, user.passwordHash) === false) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
  }
  if (!body.newPassword || body.newPassword.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 422 });
  }

  const passwordHash = await hashPassword(body.newPassword);
  await updateUser(user.id, { passwordHash });
  return NextResponse.json({ ok: true });
}