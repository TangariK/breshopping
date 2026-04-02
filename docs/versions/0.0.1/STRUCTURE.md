# Estrutura de pastas (0.0.1)

```
├── db/migrations/          # SQL versionado (MVP: auth + settings + histórico)
├── docs/                   # Documentação (arquitetura, docker, versões, commit)
├── public/                 # Assets estáticos (vazio no scaffold)
├── src/
│   ├── app/                # App Router Next.js (pages + api)
│   │   ├── api/
│   │   ├── [tenantSlug]/
│   │   ├── login/
│   │   └── register/
│   ├── components/         # Atomic Design (atoms, molecules, organisms)
│   ├── features/         # Domínio por feature (auth, catalog, tenant)
│   ├── middleware.ts
│   └── shared/lib/        # Código compartilhado (db, auth, utils)
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── PROJECT_RULES.md
└── package.json           # version 0.0.1
```

## Módulos e comentários

Cada arquivo de serviço ou rota relevante contém comentário de topo (JSDoc) descrevendo papel e limites. Novos módulos devem seguir o mesmo padrão.

## Dependências principais

`next`, `react`, `pg`, `bcryptjs`, `jose`, `zod`, `clsx`, `tailwind-merge`, `tailwindcss`.
