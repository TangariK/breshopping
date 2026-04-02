import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantSession } from "@/shared/lib/api-auth";
import { getProductDetail, patchProduct } from "@/features/catalog/services/product.service";

type Params = { tenantSlug: string; productId: string };

const patchSchema = z
  .object({
    title: z.string().min(2).max(255).optional(),
    description: z.string().max(5000).nullable().optional(),
    categoryId: z.string().uuid().nullable().optional(),
    supplierId: z.string().uuid().optional(),
    sku: z.string().max(50).nullable().optional(),
    size: z.string().max(20).nullable().optional(),
    color: z.string().max(50).nullable().optional(),
    brand: z.string().max(100).nullable().optional(),
    material: z.string().max(100).nullable().optional(),
    tags: z.array(z.string().max(40)).max(20).optional(),
    productCondition: z.string().optional(),
    status: z.string().optional(),
    acquisitionPrice: z.number().nonnegative().optional(),
    displayPrice: z.number().nonnegative().optional(),
  })
  .refine(
    (b) =>
      !(
        (b.acquisitionPrice !== undefined && b.displayPrice === undefined) ||
        (b.displayPrice !== undefined && b.acquisitionPrice === undefined)
      ),
    { message: "Informe custo e vitrine juntos ao alterar preços." },
  );

/**
 * GET /api/tenants/:tenantSlug/products/:productId
 * PATCH — atualização parcial; preços alteram histórico quando ambos enviados.
 */
export async function GET(_request: Request, context: { params: Promise<Params> }) {
  const { tenantSlug, productId } = await context.params;
  const gate = await requireTenantSession(tenantSlug);
  if ("response" in gate) return gate.response;
  const detail = await getProductDetail(gate.session.tenantId, productId);
  if (!detail) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }
  return NextResponse.json(detail);
}

export async function PATCH(request: Request, context: { params: Promise<Params> }) {
  const { tenantSlug, productId } = await context.params;
  const gate = await requireTenantSession(tenantSlug);
  if ("response" in gate) return gate.response;
  const json = await request.json();
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos", issues: parsed.error.flatten() }, { status: 400 });
  }
  try {
    await patchProduct(gate.session.tenantId, productId, parsed.data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "NOT_FOUND") {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }
    console.error(e);
    return NextResponse.json({ error: "Falha ao atualizar." }, { status: 500 });
  }
}
