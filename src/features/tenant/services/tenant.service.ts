import { getPool } from "@/shared/lib/db";

/**
 * Consultas de tenant por slug (rotas públicas e dashboard).
 */

export async function getTenantBySlug(slug: string) {
  const pool = getPool();
  const r = await pool.query(
    `SELECT t.id, t.name, t.slug, t.address, t.city,
            COALESCE(ts.currency_code, 'BRL') AS currency_code,
            COALESCE(ts.measure_system, 'metric') AS measure_system
     FROM tenants t
     LEFT JOIN tenant_settings ts ON ts.tenant_id = t.id
     WHERE t.slug = $1`,
    [slug],
  );
  return r.rows[0] ?? null;
}

export async function getDashboardSummary(tenantId: string) {
  const pool = getPool();
  const r = await pool.query(
    `SELECT
       COUNT(p.id)::int AS total_items,
       COALESCE(SUM(pp.current_display_price) FILTER (WHERE p.status = 'disponivel'), 0)::numeric AS stock_value
     FROM products p
     LEFT JOIN product_pricing pp ON pp.product_id = p.id
     WHERE p.tenant_id = $1`,
    [tenantId],
  );
  return {
    totalItems: Number(r.rows[0]?.total_items ?? 0),
    stockValue: String(r.rows[0]?.stock_value ?? "0"),
  };
}
