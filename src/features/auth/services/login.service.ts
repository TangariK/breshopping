import bcrypt from "bcryptjs";
import { getPool } from "@/shared/lib/db";

/**
 * Autenticação por email/senha contra a tabela `users`.
 */

export async function verifyCredentials(email: string, password: string) {
  const pool = getPool();
  const r = await pool.query(
    `SELECT u.id, u.password_hash, u.tenant_id, t.slug, u.email
     FROM users u
     INNER JOIN tenants t ON t.id = u.tenant_id
     WHERE u.email = $1`,
    [email.toLowerCase()],
  );
  if (r.rows.length === 0) return null;
  const row = r.rows[0];
  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) return null;
  return {
    userId: row.id as string,
    tenantId: row.tenant_id as string,
    tenantSlug: row.slug as string,
    email: row.email as string,
  };
}
