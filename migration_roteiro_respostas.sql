-- Migração: campo para guardar as respostas anotadas nos cards
-- "Script do SDR" e "Roteiro de apoio" durante a ligação.
-- Rodar no SQL editor do Supabase.

alter table leads add column if not exists roteiro_respostas jsonb default '{}'::jsonb;
