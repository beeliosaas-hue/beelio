import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TeamMemberRequest {
  equipe_id: string;
  nome_membro: string;
  email_membro: string;
  funcao: 'visualizador' | 'editor' | 'administrador';
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
    const memberId = pathParts[pathParts.length - 1];

    // GET - Listar membros
    if (req.method === 'GET') {
      const equipeId = url.searchParams.get('equipe_id');

      if (!equipeId) {
        return new Response(JSON.stringify({ error: 'equipe_id é obrigatório' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data, error } = await supabaseClient
        .from('membros_equipes')
        .select('*')
        .eq('equipe_id', equipeId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST - Criar membro
    if (req.method === 'POST') {
      const body: TeamMemberRequest = await req.json();

      // Verificar se o usuário é dono da equipe
      const { data: equipe, error: equipeError } = await supabaseClient
        .from('equipes')
        .select('usuario_principal_id')
        .eq('id', body.equipe_id)
        .single();

      if (equipeError || equipe.usuario_principal_id !== user.id) {
        return new Response(
          JSON.stringify({ error: 'Sem permissão para adicionar membros nesta equipe' }),
          {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const { data, error } = await supabaseClient
        .from('membros_equipes')
        .insert([
          {
            equipe_id: body.equipe_id,
            nome_membro: body.nome_membro,
            email_membro: body.email_membro,
            funcao: body.funcao,
            status: 'invited',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Notificar via webhook (se configurado)
      const n8nUrl = Deno.env.get('N8N_URL');
      if (n8nUrl) {
        try {
          await fetch(`${n8nUrl}/team_member_invite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              workspace_id: body.equipe_id,
              invite_email: body.email_membro,
              name: body.nome_membro,
              role: body.funcao,
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

    // PUT - Atualizar membro
    if (req.method === 'PUT' && memberId) {
      const body = await req.json();

      const { data, error } = await supabaseClient
        .from('membros_equipes')
        .update(body)
        .eq('id', memberId)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE - Remover membro
    if (req.method === 'DELETE' && memberId) {
      const { error } = await supabaseClient
        .from('membros_equipes')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
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
