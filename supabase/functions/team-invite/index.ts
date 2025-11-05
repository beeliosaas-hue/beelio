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

    // Check if user has PRO plan
    const { data: isPro } = await supabase.rpc('user_has_pro_plan', { target_user_id: user.id });
    if (!isPro) {
      return new Response(JSON.stringify({ error: 'PRO plan required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { email, role } = await req.json();

    // Get user's workspace
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

    // Generate unique token
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    // Create invite token
    await supabase.from('invite_tokens').insert({
      workspace_id: profile.workspace_id,
      email,
      token,
      expires_at: expiresAt.toISOString(),
    });

    // Create team member record
    await supabase.from('membros_equipes').insert({
      workspace_id: profile.workspace_id,
      email_membro: email,
      nome_membro: email.split('@')[0],
      funcao: role || 'visualizador',
      status: 'invited',
    });

    const inviteLink = `https://beelio-ia.com/aceitar-invite?token=${token}`;

    // Call n8n webhook to send email
    try {
      await fetch(Deno.env.get('N8N_WEBHOOK_URL') || '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'team_invite',
          email,
          inviteLink,
        }),
      });
    } catch (e) {
      console.error('Failed to trigger n8n webhook:', e);
    }

    return new Response(JSON.stringify({ inviteLink, token }), {
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