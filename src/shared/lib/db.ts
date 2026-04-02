import { Pool, type PoolConfig } from "pg";

/**
 * Pool singleton de conexão PostgreSQL.
 * Usa DATABASE_URL ou PG_HOST/PG_PORT/PG_USER/PG_PASSWORD/PG_DATABASE.
 */
let pool: Pool | null = null;

function buildConnectionString(): string {
  const direct = process.env.DATABASE_URL;
  if (direct) return direct;

  const host = process.env.PG_HOST ?? "localhost";
  const port = process.env.PG_PORT ?? "5432";
  const user = process.env.PG_USER ?? "postgres";
  const password = process.env.PG_PASSWORD ?? "";
  const database = process.env.PG_DATABASE ?? "postgres";
  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(
    password,
  )}@${host}:${port}/${database}`;
}

export function getPool(): Pool {
  if (!pool) {
    const connectionString = buildConnectionString();
    const config: PoolConfig = { connectionString, max: 10 };
    pool = new Pool(config);
  }
  return pool;
}
