# Regras do projeto Breshopping

Documento público de governança para humanos e para assistentes (ex.: Cursor). Todo colaborador ou agente de IA deve **ler e seguir** estes itens antes de implementações relevantes.

## 1. Documentação obrigatória antes de codar

- Ler **`docs/architecture/README.md`** (estrutura, Atomic Design, feature-based, limites de camadas).
- Ler **`docs/README.md`** para localizar documentação de **banco**, **Docker** e **versionamento**.
- Antes de **criar nova versão documental**, ler **`docs/versions/README.md`** (formato e semântica).
- Antes de **commit**, ler **`docs/commit/COMMIT_STANDARD.md`**.

> Todo documento gerado pelo time ou por agentes no repositório deve ser **Markdown (`.md`)**, salvo exceção técnica explícita (ex.: configs).

## 2. Versionamento documental

- A pasta **`docs/versions/x.y.z/`** registra telas, endpoints, componentes reutilizáveis, estrutura, changelog da versão anterior, implementação e snapshot de estado.
- **Pequenas correções:** incremento “patch” documental (ex.: `0.0.1` → `0.0.11` ou próximo patch acordado).
- **Nova tela ou feature média:** incremento minor (ex.: `0.0.2`).
- **Mudança grande no sistema:** `0.1.0`.
- **Marcos estáveis / produto maior:** `1.0.0`.

Atualize o **`package.json`** quando fechar uma versão documental/release interna, mantendo coerência com `docs/versions/`.

## 3. Banco de dados

- Preferir **alterações via MCP Postgres** quando as permissões permitirem.
- Se não for possível executar pelo MCP, manter o SQL em **`db/migrations/`**, aplicar manualmente e **confirmar com o responsável** que a migration rodou antes de remover ou arquivar scripts temporários.

## 4. Reutilização e escopo

- Antes de criar **componentes** ou **endpoints** novos, verificar o que já existe (`src/components/`, `src/features/*/ui`, `src/app/api/`).
- **Evitar refatorar** funções inteiras, reindentar ou reformatar arquivos sem necessidade — commits devem permanecer legíveis.
- **Novidades significativas** devem aparecer na documentação da versão correspondente.

## 5. Qualidade e commits

- Após implementação **grande** ou **várias alterações seguidas**, rodar:
  - `npm run build`
  - `npm run lint`
- **Antes de qualquer commit**, também rodar **build** e **lint** quando houver mudança de comportamento ou estrutura ampla.

## 6. Código e comentários

- Código deve ser **claro**; comentários de topo em **serviços, rotas e módulos** devem explicar **para que servem** e **como se encaixam** na arquitetura.
- Cada **módulo** (feature ou pasta coesa) deve ser entendível por um novo desenvolvedor apenas lendo o código + `docs/`.

## 7. Segurança e ambiente

- **Nunca** commitar `.env` ou `.env.local` (ver `.gitignore`).
- Produção exige **`JWT_SECRET`** forte e `secure` em cookies conforme ambiente.

---

Estas regras são complementadas pelo arquivo **`.cursor/rules/breshopping.mdc`** para assistentes no Cursor.
