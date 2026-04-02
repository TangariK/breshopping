import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantSession } from "@/shared/lib/api-auth";
import { createSupplierQuick, listSuppliers } from "@/features/catalog/services/supplier.service";

type Params = { tenantSlug: string };

const postSchema = z.object({
  name: z.string().min(2).max(255),
});

/**
 * GET /api/tenants/:tenantSlug/suppliers
 * POST /api/tenants/:tenantSlug/suppliers — cadastro rápido (modal).
 */
export async function GET(_request: Request, context: { params: Promise<Params> }) {
  const { tenantSlug } = await context.params;
  const gate = await requireTenantSession(tenantSlug);
  if ("response" in gate) return gate.response;
  const rows = await listSuppliers(gate.session.tenantId);
  return NextResponse.json({ suppliers: rows });
}

export async function POST(request: Request, context: { params: Promise<Params> }) {
  const { tenantSlug } = await context.params;
  const gate = await requireTenantSession(tenantSlug);
  if ("response" in gate) return gate.response;
  const json = await request.json();
  const parsed = postSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Nome inválido" }, { status: 400 });
  }
  const row = await createSupplierQuick(gate.session.tenantId, parsed.data.name);
  return NextResponse.json({ supplier: row }, { status: 201 });
}
