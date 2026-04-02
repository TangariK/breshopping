import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyCredentials } from "@/features/auth/services/login.service";
import { signSession, getCookieName } from "@/shared/lib/session";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * POST /api/auth/login — emite cookie de sessão JWT.
 */
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    const user = await verifyCredentials(parsed.data.email, parsed.data.password);
    if (!user) {
      return NextResponse.json({ error: "Email ou senha incorretos." }, { status: 401 });
    }
    const token = await signSession({
      sub: user.userId,
      email: user.email,
      tenantId: user.tenantId,
      tenantSlug: user.tenantSlug,
    });
    const res = NextResponse.json({ ok: true, tenantSlug: user.tenantSlug });
    res.cookies.set(getCookieName(), token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Falha no login." }, { status: 500 });
  }
}
