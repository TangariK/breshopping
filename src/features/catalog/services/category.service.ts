import { getPool } from "@/shared/lib/db";

/**
 * Categorias de produto por tenant (seed no cadastro + futuras customizações).
 */

export async function listCategories(tenantId: string) {
  const pool = getPool();
  const r = await pool.query(
    `SELECT id, name, description FROM categories WHERE tenant_id = $1 ORDER BY name`,
    [tenantId],
  );
  return r.rows;
}
