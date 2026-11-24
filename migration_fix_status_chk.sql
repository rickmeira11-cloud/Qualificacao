-- Corrige a constraint de status para aceitar "Em nutrição" (e os demais status usados na ferramenta).
-- Rodar no SQL editor do Supabase.

alter table leads drop constraint if exists leads_status_chk;
alter table leads add constraint leads_status_chk
  check (status in ('Rascunho','Em andamento','Em nutrição','Ganha','Perdida','Descartada'));
