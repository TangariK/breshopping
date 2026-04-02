import { NextResponse } from "next/server";
import { registerBodySchema } from "@/features/auth/model/register.schema";
import { registerTenantAndAdmin } from "@/features/auth/services/register.service";
import { signSession, getCookieName } from "@/shared/lib/session";

/**
 * POST /api/auth/register — cria tenant, admin, categorias iniciais e fornecedor padrão.
 */
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = registerBodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos", issues: parsed.error.flatten() }, { status: 400 });
    }
    const body = parsed.data;
    const result = await registerTenantAndAdmin(body);
    const token = await signSession({
      sub: result.userId,
      email: body.email.toLowerCase(),
      tenantId: result.tenantId,
      tenantSlug: result.slug,
    });
    const res = NextResponse.json({ ok: true, tenantSlug: result.slug });
    res.cookies.set(getCookieName(), token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro";
    if (msg === "SLUG_TAKEN") {
      return NextResponse.json({ error: "Este slug já está em uso." }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: "Não foi possível concluir o cadastro." }, { status: 500 });
  }
}
