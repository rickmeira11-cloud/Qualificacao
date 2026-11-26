// Edge Function: envia uma ficha (lead) qualificada para o RD Station CRM como negociação.
// Guarda o token do RD como secret (RD_API_TOKEN) — nunca no navegador.
//
// Deploy (Supabase CLI):
//   supabase functions deploy rd-sync
//   supabase secrets set RD_API_TOKEN=xxxxxxxx
//
// Ou pelo Dashboard: Edge Functions > Create a new function > "rd-sync" > colar este
// código > Deploy. Depois, em Edge Functions > Secrets, adicionar RD_API_TOKEN.
//
// Chamado pelo app via: sb.functions.invoke('rd-sync', { body: { leadId } })

import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const RD_API_TOKEN = Deno.env.get('RD_API_TOKEN');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    if (!RD_API_TOKEN) throw new Error('RD_API_TOKEN não configurado (defina em Edge Functions > Secrets).');
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) throw new Error('Configuração do Supabase ausente no Edge Function.');

    var body = await req.json();
    var leadId = body && body.leadId;
    if (!leadId) throw new Error('leadId é obrigatório.');

    var sbAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    var leadRes = await sbAdmin.from('leads').select('*').eq('id', leadId).single();
    if (leadRes.error || !leadRes.data) throw new Error('Ficha não encontrada: ' + (leadRes.error ? leadRes.error.message : leadId));
    var lead = leadRes.data;

    var contato = {
      name: lead.contato || lead.empresa || 'Contato sem nome',
      emails: lead.contato_email ? [{ email: lead.contato_email }] : [],
      phones: lead.contato_telefone ? [{ phone: lead.contato_telefone }] : [],
    };

    var dealPayload = {
      deal: {
        name: lead.empresa || ('Lead ' + lead.id),
        rating: lead.classificacao === 'A' ? 5 : lead.classificacao === 'B' ? 3 : 1,
        amount_total: lead.total || 0,
        organization: lead.empresa || undefined,
        deal_custom_fields: [],
      },
      contacts: [contato],
    };

    // Se já enviado antes, atualiza a negociação existente em vez de duplicar.
    var isUpdate = !!lead.rd_deal_id;
    var url = isUpdate
      ? 'https://crm.rdstation.com/api/v1/deals/' + lead.rd_deal_id + '?token=' + RD_API_TOKEN
      : 'https://crm.rdstation.com/api/v1/deals?token=' + RD_API_TOKEN;

    var rdRes = await fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isUpdate ? { deal: dealPayload.deal } : dealPayload),
    });
    var rdJson = await rdRes.json().catch(function(){ return null; });

    if (!rdRes.ok) {
      throw new Error('RD Station retornou erro (' + rdRes.status + '): ' + JSON.stringify(rdJson));
    }

    var dealId = isUpdate ? lead.rd_deal_id : (rdJson && rdJson.id);
    var upd = await sbAdmin.from('leads').update({
      rd_deal_id: dealId || null,
      rd_enviado_em: new Date().toISOString(),
    }).eq('id', leadId);
    if (upd.error) throw new Error('Enviado ao RD, mas falhou salvar referência local: ' + upd.error.message);

    return new Response(JSON.stringify({ ok: true, dealId: dealId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
