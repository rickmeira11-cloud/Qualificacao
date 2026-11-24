-- Migração: canal de origem, contato (e-mail/telefone), status "Em nutrição",
-- materiais enviados (apresentação/proposta). Rodar no SQL editor do Supabase.

alter table leads add column if not exists canal text;
alter table leads add column if not exists contato_email text;
alter table leads add column if not exists contato_telefone text;
alter table leads add column if not exists apresentacao_enviada_em timestamptz;
alter table leads add column if not exists proposta_enviada_em timestamptz;

-- Se existir CHECK constraint de status, ela precisa incluir 'Em nutrição'.
-- Ajuste o nome da constraint conforme o que aparecer em information_schema.table_constraints
-- (rode a consulta abaixo primeiro para descobrir o nome):
--   select conname, pg_get_constraintdef(oid) from pg_constraint where conrelid = 'leads'::regclass and contype = 'c';
--
-- Depois de identificar a constraint de status, troque <nome_da_constraint> abaixo e rode:
-- alter table leads drop constraint <nome_da_constraint>;
-- alter table leads add constraint <nome_da_constraint>
--   check (status in ('Rascunho','Em andamento','Em nutrição','Ganha','Perdida','Descartada'));
