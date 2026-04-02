# Telas (0.0.1)

| Rota | Descrição |
|------|-----------|
| `/` | Landing pública com CTA para cadastro e login |
| `/login` | Login email/senha; redireciona para `?next=` ou dashboard |
| `/register` | Wizard em 2 passos: usuário → negócio (slug com sugestão) |
| `/[tenantSlug]/dashboard` | Resumo: total de itens e valor em estoque (disponíveis) |
| `/[tenantSlug]/inventory` | Tabela com miniatura, filtros em pílula, busca, empty state |
| `/[tenantSlug]/products/new` | Formulário de catalogação (imagens preview local, preços mascarados, fornecedor + modal) |
| `/[tenantSlug]/products/[productId]` | Detalhe com curadoria, histórico de preço, ações (preço, vendido, imprimir) |

Todas as rotas sob `[tenantSlug]` exigem sessão JWT cujo `tenantSlug` coincide com o segmento da URL.
