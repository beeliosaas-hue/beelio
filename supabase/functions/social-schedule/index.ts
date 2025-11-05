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

    const { content_text, media_urls, scheduled_at, timezone, targets, workspace_id } = await req.json();

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

    // Criar scheduled_post
    const { data: scheduledPost, error: postError } = await supabaseClient
      .from('scheduled_posts')
      .insert({
        user_id: user.id,
        workspace_id,
        content_text,
        media_urls,
        scheduled_at,
        timezone,
        status: 'scheduled'
      })
      .select()
      .single();

    if (postError) {
      throw postError;
    }

    // Criar publish_jobs para cada target
    const jobs = targets.map((target: any) => ({
      scheduled_post_id: scheduledPost.id,
      provider: target.provider,
      target_id: target.target_id,
      status: 'queued'
    }));

    const { error: jobsError } = await supabaseClient
      .from('publish_jobs')
      .insert(jobs);

    if (jobsError) {
      throw jobsError;
    }

    // Notificar n8n (webhook)
    const n8nUrl = Deno.env.get('N8N_WEBHOOK_URL');
    if (n8nUrl) {
      await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'post_scheduled',
          post_id: scheduledPost.id,
          user_id: user.id,
          scheduled_at,
          targets: targets.map((t: any) => ({ provider: t.provider, target_id: t.target_id }))
        })
      });
    }

    return new Response(JSON.stringify({ 
      success: true,
      post_id: scheduledPost.id 
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
