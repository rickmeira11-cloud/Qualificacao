-- Migração: motivo estruturado de perda/descarte do lead.
-- Rodar no SQL editor do Supabase.

alter table leads add column if not exists motivo_perda text;
