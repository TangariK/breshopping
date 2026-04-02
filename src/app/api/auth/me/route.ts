import { NextResponse } from "next/server";
import { getServerSession } from "@/shared/lib/get-session";

/**
 * GET /api/auth/me — dados mínimos da sessão atual.
 */
export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({
    user: {
      email: session.email,
      tenantId: session.tenantId,
      tenantSlug: session.tenantSlug,
    },
  });
}
