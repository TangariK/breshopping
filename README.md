# Breshopping

Multi-tenant SaaS for thrift-store management — business onboarding, inventory of unique items, fast cataloging, and price tracking.

Built by **[Kauã Tangari](https://github.com/TangariK)**.

## Problem

Thrift stores deal with **unique pieces**, not SKUs. Generic inventory tools force workarounds. Breshopping gives each shop its own tenant space with catalog, inventory filters, and price history built for that model.

## Stack

- **Next.js** 16 (App Router) + **React** 19 + **TypeScript**
- **Tailwind CSS** v4
- **PostgreSQL** (driver `pg`)
- Auth: **JWT** in httpOnly cookie (`jose` + `bcryptjs`)
- Validation: **Zod**
- Deploy: **Docker** / `docker compose`

## Technical decisions

| Choice | Why |
|--------|-----|
| Multi-tenant via URL slug (`/[tenantSlug]/…`) | Clear isolation per shop without a separate app per customer |
| JWT in httpOnly cookie | Avoids XSS exposure of tokens in `localStorage` |
| SQL migrations + documented schema | Explicit control over tenant settings, tags, and price history |
| Atomic Design + feature folders | Keeps UI and domain logic navigable as the MVP grows |

What I'd improve next: live demo deploy, richer inventory UX, and tighter test coverage around auth/tenant boundaries.

## Quick start

```bash
cp .env.example .env.local
# Set DATABASE_URL and JWT_SECRET (min. 16 chars in production)

npm install
npm run dev
```

Apply the SQL migration before signup/login:

```bash
psql "$DATABASE_URL" -f db/migrations/001_mvp_auth_tenant_settings.sql
```

Schema details: [docs/database/README.md](docs/database/README.md).

## Docker

```bash
docker compose up --build
```

Guide: [docs/docker/README.md](docs/docker/README.md).

## Docs

- Index: [docs/README.md](docs/README.md)
- Architecture: [docs/architecture/README.md](docs/architecture/README.md)
- MVP **0.0.1**: [docs/versions/0.0.1/README.md](docs/versions/0.0.1/README.md)
- Project rules: [PROJECT_RULES.md](PROJECT_RULES.md)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development |
| `npm run build` | Production build |
| `npm run start` | Serve after build |
| `npm run lint` | ESLint |

## License

[MIT](LICENSE)
