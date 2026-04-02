# Endpoints HTTP (0.0.1)

Base: `/api` (sem prefixo de versão).

## Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Cria tenant, settings, categorias, fornecedor padrão, usuário admin; define cookie JWT |
| POST | `/api/auth/login` | Valida credenciais; define cookie JWT |
| POST | `/api/auth/logout` | Remove cookie |
| GET | `/api/auth/me` | Retorna usuário da sessão ou 401 |

## Tenant (autenticado: slug na URL deve bater com JWT)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/tenants/:tenantSlug/summary` | Totais para dashboard |
| GET | `/api/tenants/:tenantSlug/categories` | Categorias do tenant |
| GET | `/api/tenants/:tenantSlug/suppliers` | Fornecedores |
| POST | `/api/tenants/:tenantSlug/suppliers` | Criação rápida (`{ name }`) |
| GET | `/api/tenants/:tenantSlug/products` | Lista; query: `categoryId`, `status`, `q` |
| POST | `/api/tenants/:tenantSlug/products` | Cria item + preço + imagens |
| GET | `/api/tenants/:tenantSlug/products/:productId` | Detalhe + imagens + histórico |
| PATCH | `/api/tenants/:tenantSlug/products/:productId` | Atualização parcial; preços geram histórico se ambos enviados |
| POST | `/api/tenants/:tenantSlug/products/:productId/sold` | Marca `status = vendido` |
