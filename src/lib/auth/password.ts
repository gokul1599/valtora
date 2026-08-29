import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const ROUNDS = 12;
const RESET_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "forgeai-dev-secret-change-me"
);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

/** Stateless password-reset token (signed JWT carrying the account email). */
export async function issueResetToken(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30m")
    .sign(RESET_SECRET);
}

export async function verifyResetToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, RESET_SECRET);
    const email = payload.email;
    return typeof email === "string" ? email : null;
  } catch {
    return null;
  }
}