import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { postId, userId, targets, scheduledAt, mode } = await req.json();

    // Validar que o postId pertence ao usuário
    const { data: post, error: postError } = await supabaseClient
      .from('posts')
      .select('id, titulo, conteudo, midia_urls')
      .eq('id', postId)
      .eq('user_id', user.id)
      .single();

    if (postError || !post) {
      return new Response(JSON.stringify({ error: 'Post não encontrado ou sem permissão' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validar targets
    if (!targets || targets.length === 0) {
      return new Response(JSON.stringify({ error: 'Nenhum destino selecionado' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verificar se alguma conta precisa reconectar
    const providers = [...new Set(targets.map((t: any) => t.provider))];
    const { data: accounts } = await supabaseClient
      .from('social_accounts')
      .select('provider, needs_reconnect')
      .eq('user_id', user.id)
      .in('provider', providers);

    const needsReconnect = accounts?.filter(a => a.needs_reconnect);
    if (needsReconnect && needsReconnect.length > 0) {
      return new Response(JSON.stringify({ 
        error: 'needs_reconnect',
        providers: needsReconnect.map(a => a.provider)
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Determinar status baseado no mode
    const status = mode === 'publish_now' ? 'publishing' : 'scheduled';
    const scheduledAtTime = scheduledAt || new Date().toISOString();

    // Criar registros em social_posts para cada target
    const socialPostsData = targets.map((target: any) => ({
      post_id: postId,
      user_id: user.id,
      provider: target.provider,
      account_id: target.accountId,
      target_id: target.targetId,
      status,
      scheduled_at: scheduledAtTime,
      content_text: post.conteudo,
      media_url: post.midia_urls?.[0] || null
    }));

    const { data: socialPosts, error: socialPostsError } = await supabaseClient
      .from('social_posts')
      .insert(socialPostsData)
      .select();

    if (socialPostsError) {
      console.error('Error creating social_posts:', socialPostsError);
      throw socialPostsError;
    }

    // Notificar n8n (webhook)
    const n8nUrl = Deno.env.get('N8N_SOCIAL_PUBLISH_WEBHOOK_URL');
    if (n8nUrl && socialPosts) {
      try {
        const webhookPayload = {
          postId,
          userId: user.id,
          socialPosts: socialPosts.map(sp => ({
            id: sp.id,
            provider: sp.provider,
            accountId: sp.account_id,
            targetId: sp.target_id
          }))
        };

        console.log('Sending to n8n:', webhookPayload);

        await fetch(n8nUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload)
        });
      } catch (n8nError) {
        console.error('Error notifying n8n:', n8nError);
        
        // Atualizar social_posts para failed
        await supabaseClient
          .from('social_posts')
          .update({ 
            status: 'failed',
            error_message: 'Falha ao comunicar com n8n: ' + n8nError.message
          })
          .in('id', socialPosts.map(sp => sp.id));
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      socialPosts: socialPosts?.map(sp => ({ id: sp.id, status: sp.status }))
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in social-schedule:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
