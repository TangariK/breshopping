import { NextResponse } from "next/server";
import { requireTenantSession } from "@/shared/lib/api-auth";
import { getDashboardSummary } from "@/features/tenant/services/tenant.service";

type Params = { tenantSlug: string };

/**
 * GET /api/tenants/:tenantSlug/summary — totais para o dashboard.
 */
export async function GET(_request: Request, context: { params: Promise<Params> }) {
  const { tenantSlug } = await context.params;
  const gate = await requireTenantSession(tenantSlug);
  if ("response" in gate) return gate.response;
  const summary = await getDashboardSummary(gate.session.tenantId);
  return NextResponse.json(summary);
}
