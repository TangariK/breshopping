# Padrão de commits

Leia este documento **antes de cada commit**, principalmente após implementações grandes ou várias alterações seguidas.

## Formato

Use mensagens em **português claro**, **modo imperativo** e **primeira linha até ~72 caracteres**:

```
<tipo>(<escopo opcional>): <resumo curto>

Corpo opcional em uma ou mais frases completas, explicando:
- o problema ou objetivo;
- a solução adotada;
- impactos em API, banco ou Docker, se houver.

Refs: #issue (se existir)
```

## Tipos sugeridos

| Tipo | Uso |
|------|-----|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Apenas documentação |
| `chore` | Tarefas de manutenção (deps, configs) |
| `refactor` | Refatoração sem mudança de comportamento |
| `test` | Testes |

## Boas práticas

- Um commit deve representar uma **unidade lógica** de mudança.
- **Não** misturar alterações massivas de formatação com mudanças funcionais no mesmo commit.
- **Não** refatorar funções inteiras ou reindentar arquivos sem necessidade — polui histórico e dificulta review.
- Após mudanças grandes, rode **`npm run build`** e **`npm run lint`** antes de commitar (ver `PROJECT_RULES.md`).

## Exemplo

```
feat(auth): cadastro em duas etapas com slug e fornecedor padrão

Implementa POST /api/auth/register com transação criando tenant,
tenant_settings, categorias iniciais e supplier interno.

docs: registra endpoints na versão 0.0.1.
```
