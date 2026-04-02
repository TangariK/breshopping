# Breshopping

Repositório público do **Breshopping**: painel web multi-tenant para gestão de brechó (peças únicas) — cadastro do negócio, inventário, catalogação rápida e acompanhamento de valores.

Projeto por **Kauã Tangari**.

## Stack

- **Next.js** 16 (App Router) + **React** 19 + **TypeScript**
- **Tailwind CSS** v4
- **PostgreSQL** (driver `pg`)
- Autenticação **JWT** em cookie httpOnly (`jose` + `bcryptjs`)
- Validação com **Zod**

## Início rápido

```bash
cp .env.example .env.local
# Preencha DATABASE_URL e JWT_SECRET (mín. 16 caracteres em produção)

npm install
npm run dev
```

Aplique a migração SQL antes de usar cadastro/login:

```bash
psql "$DATABASE_URL" -f db/migrations/001_mvp_auth_tenant_settings.sql
```

Detalhes do schema: [docs/database/README.md](docs/database/README.md).

## Docker

```bash
docker compose up --build
```

Guia: [docs/docker/README.md](docs/docker/README.md).

## Documentação

- Índice: [docs/README.md](docs/README.md)
- Arquitetura (Atomic Design + features + SOLID): [docs/architecture/README.md](docs/architecture/README.md)
- Versão documental **0.0.1** (MVP): [docs/versions/0.0.1/README.md](docs/versions/0.0.1/README.md)
- Regras do repositório (humanos e IA): [PROJECT_RULES.md](PROJECT_RULES.md)

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor após build |
| `npm run lint` | ESLint |

## Licença

Ver arquivo [LICENSE](LICENSE) na raiz (se aplicável).
