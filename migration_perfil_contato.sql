-- Perfil do contato (persona): usado para adaptar dicas do script conforme quem está do outro lado.
-- Rodar no SQL editor do Supabase.

alter table leads add column if not exists perfil_contato text;
