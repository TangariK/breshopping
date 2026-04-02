import { NextResponse } from "next/server";
import { requireTenantSession } from "@/shared/lib/api-auth";
import { createProductSchema } from "@/features/catalog/model/product.schema";
import { createProduct, listProducts } from "@/features/catalog/services/product.service";

type Params = { tenantSlug: string };

/**
 * GET /api/tenants/:tenantSlug/products — listagem com filtros opcionais.
 * POST /api/tenants/:tenantSlug/products — novo item.
 */
export async function GET(request: Request, context: { params: Promise<Params> }) {
  const { tenantSlug } = await context.params;
  const gate = await requireTenantSession(tenantSlug);
  if ("response" in gate) return gate.response;
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const search = searchParams.get("q") ?? undefined;
  const rows = await listProducts(gate.session.tenantId, { categoryId, status, search });
  return NextResponse.json({ products: rows });
}

export async function POST(request: Request, context: { params: Promise<Params> }) {
  const { tenantSlug } = await context.params;
  const gate = await requireTenantSession(tenantSlug);
  if ("response" in gate) return gate.response;
  const json = await request.json();
  const parsed = createProductSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos", issues: parsed.error.flatten() }, { status: 400 });
  }
  try {
    const result = await createProduct(gate.session.tenantId, parsed.data);
    return NextResponse.json({ id: result.id }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Não foi possível criar o item." }, { status: 500 });
  }
}
