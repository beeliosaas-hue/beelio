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

    const { provider } = await req.json();

    // Marcar conta como needs_reconnect e limpar tokens
    const { error: updateError } = await supabaseClient
      .from('social_accounts')
      .update({
        needs_reconnect: true,
        access_token: null,
        refresh_token: null
      })
      .eq('user_id', user.id)
      .eq('provider', provider);

    if (updateError) {
      throw updateError;
    }

    // Remover targets associados
    const { error: targetsError } = await supabaseClient
      .from('social_targets')
      .delete()
      .eq('user_id', user.id)
      .eq('provider', provider);

    if (targetsError) {
      throw targetsError;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in social-disconnect:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
