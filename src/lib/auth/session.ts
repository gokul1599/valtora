import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { SessionClaims, User } from "../types";

const SESSION_COOKIE = "forgeai_session";
const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "forgeai-dev-secret-change-me"
);
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export async function createSession(user: User): Promise<void> {
  const token = await new SignJWT({
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(SECRET_KEY);

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionClaims | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    if (!payload.sub) return null;
    return {
      sub: payload.sub,
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
    };
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<SessionClaims> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function currentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  const { getUserById } = await import("../db");
  return getUserById(session.sub);
}