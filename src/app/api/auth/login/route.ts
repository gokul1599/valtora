import { NextRequest } from "next/server";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validation/schemas";
import { jsonError, zodErrorMessage } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed));
  }

  const { email, password } = parsed.data;

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.password))) {
    return jsonError("Invalid email or password", 401);
  }

  await createSession({ userId: user.id, email: user.email, name: user.name });

  return Response.json({
    ok: true,
    user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
  });
}