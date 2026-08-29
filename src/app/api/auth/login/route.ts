import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation/schemas";
import { verifyPassword } from "@/lib/auth/password";
import { getUserByEmail } from "@/lib/db";
import { createSession } from "@/lib/auth/session";
import { rateLimit } from "@/lib/auth/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (!rateLimit(`login:${ip}`)) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first?.message ?? "Invalid input" }, { status: 422 });
  }

  const { email, password } = parsed.data;
  const user = await getUserByEmail(email);
  if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json(
      { error: "Incorrect email or password." },
      { status: 401 }
    );
  }

  await createSession(user);
  return NextResponse.json({
    ok: true,
    user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
  });
}