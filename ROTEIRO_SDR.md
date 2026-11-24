# Instrução: incorporar o processo de SDR/prospecção na ferramenta de Qualificação de Leads

Base: roteiro de prospecção da Systêxtil (SDR → Executivo de vendas, canais Site/WhatsApp receptivo/WhatsApp ativo/Ligação/E-mail). Analisar `index.html` e o schema Supabase (`leads`) e implementar os ajustes abaixo, sem quebrar nada existente (dados, RLS, auditoria, export CSV).

## 1. Campo "Canal de origem"
- Novo select `f-canal` em Card 1, com: Site, WhatsApp receptivo, WhatsApp ativo, Ligação ativa, E-mail, Indicação, Outro.
- Coluna `canal` no Supabase (texto, default null). Incluir no `fieldToColumn`, no `record` de save, no `applyFormData`, no `clearForm`, no CSV export e no resumo do `copyBtn`.
- Adicionar filtro por canal no Histórico e quebra "Por canal" no Painel (mesmo padrão de "Por status"/"Por classificação").

## 2. Separar SDR x Executivo de vendas
- Hoje só existe `vendedor` (quem está logado). Avaliar se cabe um campo opcional `f-executivo` (nome de quem recebe o lead após qualificação do SDR), preenchido manualmente, sem trocar o dono/RLS da ficha (owner continua sendo quem criou).
- Se a operação real tiver só uma pessoa fazendo os dois papéis, pular este item e registrar a decisão no commit.

## 3. Contato: e-mail e telefone
- Adicionar `f-contato-email` e `f-contato-telefone` ao lado do campo `f-contato` existente (Card 1), colunas `contato_email` e `contato_telefone`.
- Entram no `fieldToColumn`, CSV export e resumo do `copyBtn`.

## 4. SLA de primeiro contato (regra do "5 minutos")
- Novo campo `f-recebido-em` (datetime, pode ser timestamp automático no insert) e `f-primeiro-contato-em` (preenchido manualmente pelo SDR ao ligar).
- Calcular e exibir (não salvar calculado) o tempo decorrido entre os dois, com destaque visual se > 5 minutos.
- Avaliar se isso é demanda real agora ou fica como item futuro — se for complexo demais para o escopo atual, documentar como pendência em vez de implementar pela metade.

## 5. Status "Em nutrição"
- Adicionar opção "Em nutrição" ao `f-status` (select) e ao enum/constraint do banco, para o cenário "lead desqualificado, mas mantido em funil de conteúdo" — hoje isso cai em "Descartada", que não é o mesmo conceito do roteiro.
- Atualizar filtro de histórico, painel (barras por status) e CSV para refletir o novo valor.

## 6. Materiais enviados
- Checkbox/data simples: `f-apresentacao-enviada` (bool) e `f-proposta-enviada` (bool), com data automática de quando marcados.
- Colunas `apresentacao_enviada_em`, `proposta_enviada_em` (timestamp, null = não enviado).

## 7. Roteiro de apoio: atualizar conteúdo
- O card "Roteiro de apoio" hoje tem só o script de ligação do executivo. Adicionar (como novos `<details class="ref">`, sem remover os atuais):
  - Abertura por canal (WhatsApp receptivo, WhatsApp ativo, Ligação, E-mail) com os textos-base do roteiro, resumidos.
  - Checklist de qualificação do SDR: setor, segmento, ERP atual, nº de usuários simultâneos, demanda/desafio específico.
  - Pitch de autoridade: "mais de 30 anos de mercado" + cases (Lunelli, LIVE!, Karsten, Capricórnio).
  - Textos de encerramento por cenário (qualificado → encaminhar ao executivo; desqualificado → funil de nutrição), adaptados para o tom já usado na ficha.

## Regras gerais
- Qualquer alteração de schema (`ALTER TABLE`) deve ser entregue como SQL para o usuário rodar manualmente — não há conector Supabase ativo nesta sessão.
- Rodar o check de sintaxe Node do projeto antes de qualquer deploy.
- Rodar `node --test tests/classify.test.mjs` depois de qualquer mudança que toque `classify`/`computeAndRender`.
- Fazer commit granular por item (não um commit gigante misturando os 6 pontos), já que o repo usa PRs por feature.
- Ao final, listar o que foi implementado, o que foi adiado e por quê.
