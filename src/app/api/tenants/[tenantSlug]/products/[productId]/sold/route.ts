import { NextResponse } from "next/server";
import { requireTenantSession } from "@/shared/lib/api-auth";
import { markProductSold } from "@/features/catalog/services/product.service";

type Params = { tenantSlug: string; productId: string };

/**
 * POST /api/tenants/:tenantSlug/products/:productId/sold — marca como vendido.
 */
export async function POST(_request: Request, context: { params: Promise<Params> }) {
  const { tenantSlug, productId } = await context.params;
  const gate = await requireTenantSession(tenantSlug);
  if ("response" in gate) return gate.response;
  const ok = await markProductSold(gate.session.tenantId, productId);
  if (!ok) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
