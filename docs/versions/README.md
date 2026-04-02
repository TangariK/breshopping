# Versionamento da documentação

Este diretório guarda **snapshots documentais** do projeto: cada pasta `x.y.z/` descreve o estado do código, telas, APIs e componentes **naquela versão documental**.

## Semântica (documentação e releases internas)

Alinhado às regras do repositório (`PROJECT_RULES.md`):

| Mudança | Exemplo próximo número | Quando usar |
|---------|-------------------------|-------------|
| Ajustes pequenos ou correções | `0.0.1` → `0.0.11` (ou incremento patch conforme acordado no time) | typos, correções de bug pontuais na doc/código |
| Nova tela, feature média ou conjunto coeso de endpoints | `0.0.2`, `0.0.3`, … | entrega que muda o comportamento visível |
| Reestruturação grande do sistema | `0.1.0` | muitas features ou arquitetura nova |
| Produto estável / marco maior | `1.0.0` | releases definitivas após várias reconstruções |

> O `package.json` pode acompanhar a versão documental; sincronize ao fechar uma release.

## O que vai em cada pasta `x.y.z/`

O mínimo esperado (arquivos **`.md`**):

1. **README.md** — resumo da versão e como navegar os outros arquivos.
2. **SCREENS.md** — lista de telas/rotas de UI.
3. **ENDPOINTS.md** — rotas HTTP, métodos, payloads de alto nível.
4. **COMPONENTS.md** — componentes reutilizáveis (atoms/molecules/organisms + UI de feature compartilhável).
5. **STRUCTURE.md** — árvore de pastas relevantes e responsabilidades dos módulos.
6. **CHANGELOG-FROM-PREVIOUS.md** — delta em relação à versão documental imediatamente anterior (na `0.0.1`, baseline: repositório vazio / pré-MVP).
7. **IMPLEMENTATION.md** — relato objetivo do que foi implementado nesta versão.
8. **STATE-SNAPSHOT.md** — “como estava o código” (lista de módulos, endpoints, telas) para comparação futura.

Antes de **criar uma nova pasta de versão**, leia este README e copie a estrutura da versão anterior como modelo.

## Relação com o código

A documentação **não substitui** o código comentado: módulos devem ter comentários de topo explicando propósito. A doc de versão serve para **onboarding**, **auditoria** e **comparação** entre releases.
