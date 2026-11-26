-- Guarda a referência da negociação criada no RD Station CRM, pra não duplicar no reenvio.
-- Rodar no SQL editor do Supabase.

alter table leads add column if not exists rd_deal_id text;
alter table leads add column if not exists rd_enviado_em timestamptz;
