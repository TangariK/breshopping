import { SignJWT, jwtVerify } from "jose";

/**
 * Payload da sessão JWT (cookie httpOnly).
 */
export type SessionPayload = {
  sub: string;
  email: string;
  tenantId: string;
  tenantSlug: string;
};

const COOKIE_NAME = "breshopping_session";

export function getCookieName(): string {
  return COOKIE_NAME;
}

function getSecret(): Uint8Array {
  const secret =
    process.env.JWT_SECRET ??
    (process.env.NODE_ENV === "development" ? "dev-only-insecure-jwt-secret-min-16-chars" : "");
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET inválido ou ausente");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload, maxAgeSec = 60 * 60 * 24 * 7) {
  return new SignJWT({
    email: payload.email,
    tenantId: payload.tenantId,
    tenantSlug: payload.tenantSlug,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSec}s`)
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const sub = typeof payload.sub === "string" ? payload.sub : null;
    const email = typeof payload.email === "string" ? payload.email : null;
    const tenantId = typeof payload.tenantId === "string" ? payload.tenantId : null;
    const tenantSlug = typeof payload.tenantSlug === "string" ? payload.tenantSlug : null;
    if (!sub || !email || !tenantId || !tenantSlug) return null;
    return { sub, email, tenantId, tenantSlug };
  } catch {
    return null;
  }
}
