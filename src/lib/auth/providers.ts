/**
 * Auth provider architecture.
 *
 * Credentials auth is implemented with sessions (bcrypt + signed JWT
 * cookies). Google OAuth is integration-ready: the strategy below is a
 * thin wrapper around an authorization-code exchange. Set GOOGLE_CLIENT_ID
 * / GOOGLE_CLIENT_SECRET and flip `enabled` to activate it.
 */

export interface OAuthProfile {
  provider: "google";
  providerId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface OAuthProviderConfig {
  id: "google";
  enabled: boolean;
  authorizeUri: string;
  tokenUri: string;
  userinfoUri: string;
  clientId: string;
}

export const googleOAuthProvider: OAuthProviderConfig = {
  id: "google",
  enabled: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  authorizeUri: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUri: "https://oauth2.googleapis.com/token",
  userinfoUri: "https://www.googleapis.com/oauth2/v3/userinfo",
  clientId: process.env.GOOGLE_CLIENT_ID ?? "",
};

export function buildGoogleAuthorizeUri(
  redirectUri: string,
  state: string
): string {
  const params = new URLSearchParams({
    client_id: googleOAuthProvider.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });
  return `${googleOAuthProvider.authorizeUri}?${params.toString()}`;
}

export async function exchangeGoogleCode(
  code: string,
  redirectUri: string
): Promise<OAuthProfile> {
  const res = await fetch(googleOAuthProvider.tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error("Google token exchange failed");
  const tokens = (await res.json()) as { access_token: string };
  const info = await fetch(googleOAuthProvider.userinfoUri, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!info.ok) throw new Error("Google userinfo failed");
  const profile = (await info.json()) as {
    sub: string;
    email: string;
    name: string;
    picture?: string;
  };
  return {
    provider: "google",
    providerId: profile.sub,
    email: profile.email,
    name: profile.name,
    avatarUrl: profile.picture,
  };
}