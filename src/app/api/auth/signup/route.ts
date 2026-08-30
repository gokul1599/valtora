import { NextRequest } from "next/server";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { signupSchema } from "@/lib/validation/schemas";
import { jsonError, zodErrorMessage } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed));
  }

  const { name, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return jsonError("An account with this email already exists", 409);
  }

  const user = await db.user.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
      plan: "free",
    },
  });

  await createSession({ userId: user.id, email: user.email, name: user.name });

  return Response.json({
    ok: true,
    user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
  });
}