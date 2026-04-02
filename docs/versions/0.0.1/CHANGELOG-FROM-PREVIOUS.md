# Changelog desde a versão documental anterior

## Baseline

Não havia versão documental anterior: o repositório continha apenas um README mínimo e **não** havia aplicação Next.js nem estrutura de pastas descrita em [STRUCTURE.md](./STRUCTURE.md).

## Introduzido na 0.0.1

- Projeto Next.js 16 (App Router) com TypeScript e Tailwind v4.
- Docker (`Dockerfile`, `docker-compose.yml`) e documentação associada.
- Fluxo multi-tenant por slug na URL com JWT httpOnly.
- Migração SQL para `users`, `tenant_settings`, `product_price_history` e colunas extras em `products`.
- Telas: landing, login, registro, dashboard, inventário, novo item, detalhe.
- APIs listadas em [ENDPOINTS.md](./ENDPOINTS.md).
- Pasta `docs/` com arquitetura, banco, docker, padrão de commit e versionamento.

Nada foi **removido** de uma baseline de código aplicável: trata-se da primeira entrega documentada.
