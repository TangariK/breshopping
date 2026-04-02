import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCookieName, verifySession } from "@/shared/lib/session";

/**
 * Protege rotas do painel por tenant: exige cookie JWT cujo `tenantSlug` coincide com o primeiro segmento da URL.
 * Rotas públicas: `/`, `/login`, `/register` e arquivos estáticos.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (!first) return NextResponse.next();

  const token = request.cookies.get(getCookieName())?.value;
  const session = token ? await verifySession(token) : null;
  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (session.tenantSlug !== first) {
    const url = request.nextUrl.clone();
    url.pathname = `/${session.tenantSlug}/dashboard`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
