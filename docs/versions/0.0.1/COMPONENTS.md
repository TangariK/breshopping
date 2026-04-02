# Componentes reutilizáveis (0.0.1)

## Atoms (`src/components/atoms/`)

- **Button** — variantes `primary` | `secondary` | `ghost` | `danger`.
- **Input** — input estilizado padrão.
- **Badge** — tons `success` | `warning` | `neutral` | `muted`.

## Molecules (`src/components/molecules/`)

- **MoneyField** — máscara BRL e valor numérico; helper text opcional.
- **LogoutButton** — encerra sessão via API.

## Organisms (`src/components/organisms/`)

- **TenantShell** — layout do painel com nav lateral e logout.

## UI de features (`src/features/*/ui/`)

- **RegisterWizard** — cadastro 2 passos + slug.
- **LoginForm** — login + `next` query.
- **ImageDropzone** — drag-and-drop com preview (object URL) e data URLs para envio.
- **InventoryView** — tabela, filtros, empty state.
- **ProductForm** — seções do formulário de item + modal fornecedor.
- **ProductDetailView** — detalhe + histórico + print básico.

## Utilitários (`src/shared/lib/`)

- **cn** — `clsx` + `tailwind-merge`.
- **db** — pool Postgres.
- **session / get-session** — JWT.
- **slug** — slugify e validação.
- **money** — BRL parse/format/mask.
- **api-auth** — gate de tenant em handlers.
