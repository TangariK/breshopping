# Arquitetura do repositório

## Visão geral

O **Breshopping** é um painel multi-tenant para gestão de brechó (itens únicos): cadastro de organização + administrador, inventário, catalogação rápida e detalhe com histórico de preços.

Stack principal: **Next.js** (App Router), **PostgreSQL**, autenticação por **JWT em cookie httpOnly**, estilos com **Tailwind CSS v4**.

## Atomic Design (UI)

Componentes visuais reutilizáveis ficam em `src/components/`:

- **atoms/** — elementos mínimos (botão, input, badge) sem lógica de negócio.
- **molecules/** — combinação de atoms (ex.: campo monetário com label).
- **organisms/** — blocos maiores (ex.: shell do painel com navegação).

Regra: preferir compor átomos/moléculas existentes antes de criar novos componentes equivalentes.

## Feature-Based Design (domínio)

Lógica e UI ligada a um fluxo de negócio ficam em `src/features/`:

- **auth/** — cadastro em duas etapas, login (UI + modelos Zod + serviços).
- **catalog/** — produtos, fornecedores, categorias (schemas, serviços, telas de inventário/formulário/detalhe).
- **tenant/** — consultas de tenant e resumo do dashboard.

Cada feature pode conter:

- `model/` — validação (Zod) e tipos.
- `services/` — orquestração e acesso ao banco (via `getPool()`).
- `ui/` — componentes específicos da feature (ex.: `ImageDropzone`).

## Camada compartilhada

`src/shared/lib/` concentra utilitários sem acoplamento de feature: conexão DB, sessão JWT, slug, dinheiro (BRL), helpers de API.

## Rotas Next.js

- **Páginas** em `src/app/`: landing, login, register, e `src/app/[tenantSlug]/...` para o painel.
- **API** em `src/app/api/`: `auth/*` e `tenants/[tenantSlug]/*`.
- **middleware.ts** protege rotas do painel (primeiro segmento da URL = slug do tenant, deve bater com o JWT).

## SOLID e código limpo (orientações)

- **Single responsibility**: rotas finas; regras em `services/` ou helpers dedicados.
- **Open/closed**: novos fluxos preferem novos handlers/serviços em vez de alterar monolitos.
- **Dependências**: features dependem de `shared`; `shared` não importa `features`.
- **Interfaces claras**: payloads de API validados com Zod; retornos de serviço previsíveis.

## Onde não colocar código

- Lógica de negócio pesada diretamente em componentes de página — usar serviços.
- Duplicar componentes que já existem em `atoms/` / `molecules/` sem motivo.
