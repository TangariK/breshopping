import { NextResponse } from "next/server";
import { requireTenantSession } from "@/shared/lib/api-auth";
import { listCategories } from "@/features/catalog/services/category.service";

type Params = { tenantSlug: string };

/**
 * GET /api/tenants/:tenantSlug/categories
 */
export async function GET(_request: Request, context: { params: Promise<Params> }) {
  const { tenantSlug } = await context.params;
  const gate = await requireTenantSession(tenantSlug);
  if ("response" in gate) return gate.response;
  const rows = await listCategories(gate.session.tenantId);
  return NextResponse.json({ categories: rows });
}
