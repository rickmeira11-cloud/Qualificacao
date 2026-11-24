# Instrução: Avaliação fina do app de Qualificação de Leads

Você vai auditar o arquivo `index.html` (app completo de qualificação de leads da Systêxtil: login Supabase, formulário de score, histórico com filtros, navegação home). Leia o arquivo inteiro antes de responder. Produza uma lista ponto a ponto, sem rodeios, cobrindo:

1. **Bugs funcionais** — qualquer fluxo que quebre ou se comporte diferente do esperado (login, salvar, editar, filtros de histórico, navegação home/dirty-check, cálculo de score, troca de senha).
2. **Inconsistências de dados** — campos no HTML sem coluna correspondente no Supabase (ou vice-versa), defaults divergentes, campos que não são salvos/carregados.
3. **Segurança** — RLS da tabela `leads`, exposição de chave anon, validação de input, XSS (uso de innerHTML vs escapeHtml), autenticação.
4. **UX/usabilidade** — telas sem feedback de erro/loading, campos sem validação, responsividade mobile, acessibilidade básica (labels, foco).
5. **Qualidade de código** — duplicação, funções longas, nomes inconsistentes, dead code, listeners duplicados ou faltantes.
6. **Performance** — queries sem paginação real (limit fixo), re-renderizações desnecessárias, carregamento de histórico completo.
7. **Lacunas de produto** — funcionalidades que um time de vendas multiusuário normalmente precisa e não existem ainda (ex.: permissões por vendedor, exportação, busca por período, dashboard agregado, exclusão de ficha, auditoria de alterações).

Formato da resposta: lista numerada, cada item com severidade (crítico / importante / nice-to-have), onde está no código (linha ou função) e sugestão objetiva de correção em 1 frase. Nada de introdução, nada de conclusão — só a lista.
