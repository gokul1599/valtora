import { NextRequest, NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validation/schemas";
import { getUserByEmail } from "@/lib/db";
import { issueResetToken } from "@/lib/auth/password";

export const runtime = "nodejs";

/**
 * Password reset. Issues a token and returns a dev-mode reset link so the
 * flow is testable end-to-end without an SMTP provider. When EMAIL_ENABLED
 * and an SMTP transport are configured, send the same link by email and
 * remove the token from the response.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first?.message ?? "Invalid input" }, { status: 422 });
  }

  // Always return the same message to avoid user enumeration.
  const generic = NextResponse.json({
    ok: true,
    message: "If that account exists, a reset link has been sent.",
  });

  const user = await getUserByEmail(parsed.data.email);
  if (!user) return generic;

  const token = await issueResetToken(user.email);

  if (process.env.EMAIL_ENABLED === "true") {
    // TODO: wire SMTP sender here (lib/mail). Response stays generic.
    return generic;
  }

  // Dev fallback: surface the working link locally.
  const port = process.env.PORT ?? "3000";
  const url = process.env.APP_URL ?? `http://localhost:${port}`;
  return NextResponse.json({
    ok: true,
    message: "Dev mode — use the reset link below (this would be emailed).",
    resetUrl: `${url}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`,
  });
}