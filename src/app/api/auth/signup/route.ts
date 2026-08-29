import { NextRequest, NextResponse } from "next/server";
import { signupSchema } from "@/lib/validation/schemas";
import { hashPassword } from "@/lib/auth/password";
import { createUser, getUserByEmail } from "@/lib/db";
import { createSession } from "@/lib/auth/session";
import { newId } from "@/lib/db/store";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Invalid input" },
      { status: 422 }
    );
  }

  const { name, email, password } = parsed.data;
  const existing = await getUserByEmail(email);
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({
    id: newId("user"),
    email,
    name,
    passwordHash,
    authProvider: "credentials",
    plan: "free",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await createSession(user);
  return NextResponse.json(
    { ok: true, user: { id: user.id, name: user.name, email: user.email, plan: user.plan } },
    { status: 201 }
  );
}