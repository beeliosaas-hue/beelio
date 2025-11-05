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

    // Buscar contas conectadas do usuário
    const { data: accounts, error: accountsError } = await supabaseClient
      .from('social_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('needs_reconnect', false);

    if (accountsError) {
      throw accountsError;
    }

    // Buscar targets já salvos
    const { data: savedTargets, error: targetsError } = await supabaseClient
      .from('social_targets')
      .select('*')
      .eq('user_id', user.id);

    if (targetsError) {
      throw targetsError;
    }

    // Retornar lista de targets organizados por provedor
    const response = {
      accounts: accounts || [],
      targets: savedTargets || [],
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in social-targets:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
