/**
 * Migração MVP: autenticação multi-tenant, configurações do brechó e histórico de preços.
 * Executar como superusuário ou dono do schema (ex.: psql -f ...).
 * Requer extensão uuid-ossp (já usada pelas tabelas existentes).
 */

-- Usuários vinculados ao tenant (admin do brechó).
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email varchar(255) NOT NULL UNIQUE,
  password_hash text NOT NULL,
  name varchar(255) NOT NULL,
  role varchar(50) NOT NULL DEFAULT 'admin',
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);

-- Moeda e unidade de medida preferida do brechó.
CREATE TABLE IF NOT EXISTS tenant_settings (
  tenant_id uuid PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
  currency_code varchar(3) NOT NULL DEFAULT 'BRL',
  measure_system varchar(20) NOT NULL DEFAULT 'metric',
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Atributos extras de catalogação.
ALTER TABLE products ADD COLUMN IF NOT EXISTS material varchar(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags jsonb DEFAULT '[]'::jsonb;

-- Histórico de alterações de preço (vitrine / custo).
CREATE TABLE IF NOT EXISTS product_price_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  previous_acquisition numeric(12, 2),
  new_acquisition numeric(12, 2),
  previous_display_price numeric(12, 2),
  new_display_price numeric(12, 2),
  changed_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_price_history_product_id ON product_price_history(product_id);

CREATE UNIQUE INDEX IF NOT EXISTS tenants_slug_unique ON tenants (slug);
