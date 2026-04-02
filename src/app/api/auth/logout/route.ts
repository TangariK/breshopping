import { NextResponse } from "next/server";
import { getCookieName } from "@/shared/lib/session";

/**
 * POST /api/auth/logout — remove o cookie de sessão.
 */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(getCookieName(), "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
