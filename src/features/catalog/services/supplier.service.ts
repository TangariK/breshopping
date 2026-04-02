import { getPool } from "@/shared/lib/db";

/**
 * Fornecedores por tenant (inclui o registro padrão criado no onboarding).
 */

export async function listSuppliers(tenantId: string) {
  const pool = getPool();
  const r = await pool.query(
    `SELECT id, name, supplier_type, created_at FROM suppliers WHERE tenant_id = $1 ORDER BY name`,
    [tenantId],
  );
  return r.rows;
}

export async function createSupplierQuick(tenantId: string, name: string) {
  const pool = getPool();
  const r = await pool.query(
    `INSERT INTO suppliers (tenant_id, name, supplier_type) VALUES ($1, $2, 'external') RETURNING id, name`,
    [tenantId, name.trim()],
  );
  return r.rows[0];
}
