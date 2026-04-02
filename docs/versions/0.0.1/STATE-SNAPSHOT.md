# Snapshot de estado do código (0.0.1)

Use este arquivo como referência para **diffs conceituais** com versões futuras (componentes, rotas, endpoints, layout).

## Rotas de UI

- `/`, `/login`, `/register`
- `/[tenantSlug]/dashboard`
- `/[tenantSlug]/inventory`
- `/[tenantSlug]/products/new`
- `/[tenantSlug]/products/[productId]`

## Rotas de API

Ver [ENDPOINTS.md](./ENDPOINTS.md) — 4 auth + 8 tenant/produto/fornecedor/categoria/summary.

## Componentes compartilhados

- `Button`, `Input`, `Badge`
- `MoneyField`, `LogoutButton`
- `TenantShell`

## Features

- `features/auth`: schema register, services register/login, `RegisterWizard`, `LoginForm`
- `features/catalog`: schemas produto, services produto/categoria/fornecedor, UI inventário/form/detalhe/imagens
- `features/tenant`: `getTenantBySlug`, `getDashboardSummary`

## Arquivos de infra

- `Dockerfile`, `docker-compose.yml`, `db/migrations/001_mvp_auth_tenant_settings.sql`
- `next.config.ts` (standalone), `middleware.ts`, `.env.example`, `PROJECT_RULES.md`, `.cursor/rules/breshopping.mdc`

## Versão package

`package.json` → `"version": "0.0.1"`.
