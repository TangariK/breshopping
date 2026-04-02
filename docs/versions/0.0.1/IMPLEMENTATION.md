# Implementação 0.0.1 — resumo executivo

## Objetivo

Entregar o **MVP** de um painel para brechó multi-tenant: cadastro organização + admin, inventário com filtros, catalogação rápida com preview de imagens, detalhe com histórico de preços e ações principais.

## Backend

- Pool Postgres em `src/shared/lib/db.ts`.
- Registro transacional: `tenants` + `tenant_settings` + categorias seed + fornecedor interno + `users`.
- Sessão JWT assinada (`jose`), cookie `breshopping_session`.
- CRUD parcial de produtos; histórico de preço em `product_price_history` quando custo+vitrine atualizados juntos.
- APIs sob `/api/tenants/[tenantSlug]/…` validam slug da sessão.

## Frontend

- Proteção em `middleware.ts` para rotas `/:tenantSlug/*` (exceto `/api` tratado nos handlers).
- UI organizada em Atomic Design + pastas `features/*/ui`.
- Máscara BRL e texto de margem estimada no formulário de venda.
- Seleção de fornecedor com filtro textual e modal de criação rápida.
- Data URLs para imagens no MVP (documentado como provisório).

## Infra / repo

- `output: "standalone"` para imagem Docker enxuta.
- `.env.example` com variáveis de banco e `JWT_SECRET`.
- `.gitignore` com entradas explícitas para `.env`, `.env.local`, `node_modules/`, `.next/`, `dist/`.

## Pendências conhecidas (fora do escopo 0.0.1)

- Upload real para storage (Cloudinary / Supabase Storage).
- Vendas (`sales` / `sale_items`) integradas ao fluxo “marcar vendido”.
- Subdomínio real (DNS) — MVP usa path `/:slug`.
