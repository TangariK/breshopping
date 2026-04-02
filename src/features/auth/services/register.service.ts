import bcrypt from "bcryptjs";
import type { PoolClient } from "pg";
import type { RegisterBody } from "@/features/auth/model/register.schema";
import { getPool } from "@/shared/lib/db";

const DEFAULT_CATEGORIES = [
  "Camisa",
  "Calça",
  "Calçados",
  "Vestido",
  "Jaqueta",
  "Acessório",
  "Outros",
];

const DEFAULT_SUPPLIER_NAME = "Estoque Próprio / Doação Anônima";

/**
 * Cria tenant, configurações, categorias iniciais, fornecedor padrão e usuário admin.
 * Deve rodar dentro de transação.
 */
export async function registerTenantAndAdmin(
  body: RegisterBody,
): Promise<{ tenantId: string; userId: string; slug: string }> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const dup = await client.query(`SELECT id FROM tenants WHERE slug = $1`, [body.slug]);
    if (dup.rows.length > 0) {
      throw new Error("SLUG_TAKEN");
    }

    const tenantRes = await client.query(
      `INSERT INTO tenants (name, slug, address, city, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [body.shopName, body.slug, body.address, body.city, null],
    );
    const tenantId: string = tenantRes.rows[0].id;

    await ensureTenantSettings(client, tenantId, body.currencyCode, body.measureSystem);

    for (const cat of DEFAULT_CATEGORIES) {
      await client.query(
        `INSERT INTO categories (tenant_id, name, description) VALUES ($1, $2, $3)`,
        [tenantId, cat, null],
      );
    }

    await client.query(
      `INSERT INTO suppliers (tenant_id, name, supplier_type, contact_info)
       VALUES ($1, $2, $3, $4::jsonb)`,
      [tenantId, DEFAULT_SUPPLIER_NAME, "donativo", JSON.stringify({ source: "default" })],
    );

    const hash = await bcrypt.hash(body.password, 10);
    const userRes = await client.query(
      `INSERT INTO users (tenant_id, email, password_hash, name, role)
       VALUES ($1, $2, $3, $4, 'admin')
       RETURNING id`,
      [tenantId, body.email.toLowerCase(), hash, body.name],
    );
    const userId: string = userRes.rows[0].id;

    await client.query("COMMIT");
    return { tenantId, userId, slug: body.slug };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

async function ensureTenantSettings(
  client: PoolClient,
  tenantId: string,
  currencyCode: string,
  measureSystem: string,
) {
  await client.query(
    `INSERT INTO tenant_settings (tenant_id, currency_code, measure_system)
     VALUES ($1, $2, $3)`,
    [tenantId, currencyCode, measureSystem],
  );
}
