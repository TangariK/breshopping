# Banco de dados (PostgreSQL)

## Visão

O MVP utiliza o schema existente (`tenants`, `categories`, `suppliers`, `products`, `product_pricing`, `product_images`, `sales`, `sale_items`) e **estende** com tabelas/colunas da migração `db/migrations/001_mvp_auth_tenant_settings.sql`.

Imagens de produto usam **`product_images.image_url`** (texto), nunca BYTEA — alinhar com storage externo (Cloudinary, Supabase Storage, etc.) em versões futuras.

## Migração obrigatória (MVP)

Arquivo: `db/migrations/001_mvp_auth_tenant_settings.sql`

Cria:

- `users` — administrador vinculado a `tenant_id`, email único, `password_hash`.
- `tenant_settings` — `currency_code` (default `BRL`), `measure_system` (`metric` / `imperial`).
- Colunas em `products`: `material`, `tags` (jsonb).
- `product_price_history` — histórico de mudanças de custo e vitrine.
- Índice único em `tenants.slug` (se ainda não existir).

### Como aplicar

Com PostgreSQL acessível (local ou Docker):

```bash
psql "$DATABASE_URL" -f db/migrations/001_mvp_auth_tenant_settings.sql
```

Ou, com docker-compose do repositório, após o container `db` subir:

```bash
docker compose exec db psql -U breshopping -d breshopping_db -f /path-dentro-do-container/...
```

> **MCP Postgres:** alterações DDL devem ser tentadas via MCP quando as permissões do usuário permitirem. Se o MCP retornar erro de permissão, aplique o SQL manualmente e **confirme com o time** antes de remover scripts do repositório.

## Status e conservação (convenções)

- **products.status:** `disponivel`, `reservado`, `vendido` (UI usada no inventário).
- **products.product_condition:** `novo_com_etiqueta`, `usado_excelente`, `usado_marcas_uso`.

## Onboarding

Ao registrar um tenant, o sistema (via API) cria:

1. Linha em `tenants`.
2. `tenant_settings`.
3. Categorias iniciais (Camisa, Calça, …).
4. Fornecedor padrão **"Estoque Próprio / Doação Anônima"** (`supplier_type` = `internal`).
