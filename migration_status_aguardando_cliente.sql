-- Adiciona o status "Aguardando cliente" à constraint de status.
-- Rodar no SQL editor do Supabase.

alter table leads drop constraint if exists leads_status_chk;
alter table leads add constraint leads_status_chk
  check (status in ('Rascunho','Em andamento','Aguardando cliente','Em nutrição','Ganha','Perdida','Descartada'));
