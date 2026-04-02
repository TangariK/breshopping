# Docker

## Arquivos

- **`Dockerfile`** — build multi-stage com `output: "standalone"` do Next.js; imagem final executa `node server.js`.
- **`docker-compose.yml`** — serviço `db` (PostgreSQL 16) e serviço `app` (build local do Dockerfile).
- **`.dockerignore`** — reduz contexto de build (exclui `node_modules`, `.next`, `.env`).

## Variáveis

O `docker-compose` define:

- `DATABASE_URL` apontando para o host `db`.
- `JWT_SECRET` via ambiente do host (`JWT_SECRET` no `.env` local) ou fallback `dev-change-me-in-production`.
- `NEXT_PUBLIC_APP_URL` — URL pública usada em links quando necessário.

Consulte `.env.example` na raiz para todas as chaves usadas fora do Compose.

## Uso rápido

```bash
docker compose up --build
```

Depois:

1. Aplicar migrações SQL no banco (ver [database/README.md](../database/README.md)).
2. Acessar `http://localhost:3000`.

## Produção

Para produção, defina `JWT_SECRET` forte, use secrets do orquestrador (Kubernetes, ECS, etc.) e aponte `DATABASE_URL` para um Postgres gerenciado. Revise políticas de cookie `secure` e domínio da aplicação.
