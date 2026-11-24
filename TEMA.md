# Instrução: aplicar tema visual Systêxtil ao app de Qualificação de Leads

Reestilizar `index.html` para seguir o padrão visual do app "Gerador de Propostas" da Systêxtil (referência: screenshot anexado), sem alterar nenhuma lógica JS existente — só CSS e pequenos ajustes de markup.

## Paleta (extrair do print, ajustar por amostragem se preciso)
- Roxo principal (marca/CTA): `#6E2E8E` aprox.
- Roxo hover/escuro: `#5A2574` aprox.
- Fundo da página: `#F4F5F7` (cinza muito claro)
- Cards: branco `#FFFFFF`, borda `#E5E3EA`
- Texto principal: `#1F1B24`
- Texto secundário: `#6B6670`
- Alerta/pendências: fundo rosa claro `#FCEAF0`, texto/borda vermelho `#C0315B`
- Acento secundário (botão "Gerar PPTX" etc.): teal `#2FB6B0` (opcional, usar com moderação)

## Elementos a aplicar
1. **Topo fixo**: logo/wordmark "Systêxtil" à esquerda + nome do app e subtítulo ao lado, estilo do print (título bold + subtítulo cinza pequeno abaixo). Trocar a cor de destaque do `--accent` atual pelo roxo acima.
2. **Badges numerados das seções** (`<span class="n">`): fundo roxo claro, número roxo escuro — igual ao círculo "1", "2" do print.
3. **Botão primário** (salvar/ação principal): roxo sólido, texto branco, cantos arredondados ~8px, sem sombra pesada.
4. **Cards**: manter fundo branco, borda 1px cinza clara, cantos ~10-12px, espaçamento interno generoso como no print.
5. **Caixa de alerta/validação** (equivalente ao "Para gerar os documentos" do print): usar para mensagens de erro/validação do formulário de lead — fundo rosa claro, borda e texto vermelho, lista com bullets.
6. **Navegação entre abas** (Ficha atual / Histórico): estilo "pill" ativa em roxo claro com texto roxo escuro, igual ao botão "Nova proposta" ativo do print.
7. **Modo escuro**: adaptar a mesma paleta para dark (roxo mais claro/saturado sobre fundo escuro), mantendo contraste AA.

## Regras
- Não mexer em nenhuma função JS, IDs, listeners ou lógica de Supabase — só `<style>` e, se necessário, classes/wrappers de markup.
- Validar visualmente (screenshot ou descrição) antes de dar como concluído.
- Rodar o check de sintaxe Node já usado no projeto antes de deployar.
- Após aplicar, fazer deploy (Vercel) e commit/push (GitHub) seguindo o fluxo já estabelecido no projeto.
