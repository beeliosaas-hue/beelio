import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ApprovalRequest {
  equipe_id: string;
  entity_type: 'post' | 'briefing' | 'branding' | 'planner';
  entity_id: string;
  assigned_to?: string;
}

interface ApprovalAction {
  action: 'approve' | 'reject';
  comment?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verificar se o usuário é PRO
    const { data: isPro } = await supabaseClient.rpc('is_user_pro', {
      target_user_id: user.id,
    });

    if (!isPro) {
      return new Response(
        JSON.stringify({ error: 'Recurso disponível apenas para plano PRO' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const approvalId = pathParts[pathParts.length - 1];

    // GET - Listar aprovações
    if (req.method === 'GET') {
      const equipeId = url.searchParams.get('equipe_id');
      const status = url.searchParams.get('status');

      if (!equipeId) {
        return new Response(JSON.stringify({ error: 'equipe_id é obrigatório' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let query = supabaseClient
        .from('aprovacoes')
        .select('*')
        .eq('equipe_id', equipeId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST - Criar solicitação de aprovação
    if (req.method === 'POST') {
      const body: ApprovalRequest = await req.json();

      const { data, error } = await supabaseClient
        .from('aprovacoes')
        .insert([
          {
            equipe_id: body.equipe_id,
            entity_type: body.entity_type,
            entity_id: body.entity_id,
            user_id: user.id,
            requested_by: user.id,
            assigned_to: body.assigned_to || null,
            status: 'pendente',
            tipo_aprovacao: body.entity_type,
            item_id: body.entity_id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Notificar via webhook (se configurado)
      const n8nUrl = Deno.env.get('N8N_URL');
      if (n8nUrl && body.assigned_to) {
        try {
          await fetch(`${n8nUrl}/approval_event`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'created',
              approval_id: data.id,
              entity_type: body.entity_type,
              entity_id: body.entity_id,
              assigned_to: body.assigned_to,
            }),
          });
        } catch (webhookError) {
          console.error('Erro ao notificar webhook:', webhookError);
        }
      }

      return new Response(JSON.stringify(data), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PUT - Aprovar ou reprovar
    if (req.method === 'PUT' && approvalId) {
      const body: ApprovalAction = await req.json();

      const newStatus = body.action === 'approve' ? 'aprovado' : 'reprovado';

      const { data, error } = await supabaseClient
        .from('aprovacoes')
        .update({
          status: newStatus,
          decided_by: user.id,
          aprovado_por: user.id,
          decided_at: new Date().toISOString(),
          data: new Date().toISOString(),
          comentario: body.comment || null,
        })
        .eq('id', approvalId)
        .select()
        .single();

      if (error) throw error;

      // Notificar via webhook (se configurado)
      const n8nUrl = Deno.env.get('N8N_URL');
      if (n8nUrl) {
        try {
          await fetch(`${n8nUrl}/approval_event`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: body.action,
              approval_id: approvalId,
              entity_type: data.entity_type,
              entity_id: data.entity_id,
              decided_by: user.id,
              comment: body.comment,
            }),
          });
        } catch (webhookError) {
          console.error('Erro ao notificar webhook:', webhookError);
        }
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Método não suportado' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
