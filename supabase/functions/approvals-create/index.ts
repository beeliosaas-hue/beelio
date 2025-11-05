import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check PRO plan
    const { data: isPro } = await supabase.rpc('user_has_pro_plan', { target_user_id: user.id });
    if (!isPro) {
      return new Response(JSON.stringify({ error: 'PRO plan required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { item_type, item_id, assigned_to, due_date } = await req.json();

    // Get workspace
    const { data: profile } = await supabase
      .from('profiles')
      .select('workspace_id')
      .eq('user_id', user.id)
      .single();

    if (!profile?.workspace_id) {
      return new Response(JSON.stringify({ error: 'Workspace not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create approval
    const { data: approval, error } = await supabase.from('aprovacoes').insert({
      workspace_id: profile.workspace_id,
      user_id: user.id,
      item_type,
      item_id,
      requested_by: user.id,
      assigned_to,
      due_date,
      status: 'pendente',
      tipo_aprovacao: item_type,
    }).select().single();

    if (error) {
      throw error;
    }

    // Call n8n webhook
    try {
      await fetch(Deno.env.get('N8N_WEBHOOK_URL') || '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'approval_created',
          approval,
        }),
      });
    } catch (e) {
      console.error('Failed to trigger n8n webhook:', e);
    }

    return new Response(JSON.stringify(approval), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});