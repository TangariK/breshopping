import { cookies } from "next/headers";
import { getCookieName, verifySession, type SessionPayload } from "@/shared/lib/session";

/**
 * Lê e valida a sessão JWT nos cookies (Server Components e Route Handlers).
 */
export async function getServerSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const raw = jar.get(getCookieName())?.value;
  if (!raw) return null;
  return verifySession(raw);
}
