-- Adiciona o status "Aguardando retorno cliente" à constraint de status.
-- Já aplicado pelo usuário com este nome; arquivo mantido para referência/replicação em outros ambientes.

alter table leads drop constraint if exists leads_status_chk;
alter table leads add constraint leads_status_chk
  check (status in ('Rascunho','Em andamento','Aguardando retorno cliente','Em nutrição','Ganha','Perdida','Descartada'));
