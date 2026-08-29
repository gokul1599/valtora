import { NextRequest, NextResponse } from "next/server";
import { resetPasswordSchema } from "@/lib/validation/schemas";
import { hashPassword, verifyResetToken } from "@/lib/auth/password";
import { getUserByEmail, updateUserByIdentity } from "@/lib/db";
import { createSession } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first?.message ?? "Invalid input" }, { status: 422 });
  }

  const { token, password } = parsed.data;
  const email = await verifyResetToken(token);
  if (!email) {
    return NextResponse.json({ error: "This reset link is invalid or expired." }, { status: 400 });
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "This reset link is invalid or expired." }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);
  const updated = await updateUserByIdentity(user.email, { passwordHash });
  if (!updated)
    return NextResponse.json({ error: "Could not update the account." }, { status: 500 });

  await createSession(updated);
  return NextResponse.json({ ok: true });
}