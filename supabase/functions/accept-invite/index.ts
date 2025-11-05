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
    const { token, name, password } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify token
    const { data: inviteToken, error: tokenError } = await supabase
      .from('invite_tokens')
      .select('*, workspaces!inner(id, owner)')
      .eq('token', token)
      .eq('used', false)
      .single();

    if (tokenError || !inviteToken) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if token expired
    if (new Date(inviteToken.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: 'Token expired' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user exists
    let userId;
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', inviteToken.email)
      .single();

    if (existingProfile) {
      userId = existingProfile.user_id;
      
      // Update workspace
      await supabase.from('profiles').update({
        workspace_id: inviteToken.workspace_id,
      }).eq('user_id', userId);
    } else if (password) {
      // Create new user
      const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
        email: inviteToken.email,
        password,
        email_confirm: true,
        user_metadata: { display_name: name || inviteToken.email.split('@')[0] },
      });

      if (signUpError || !authData.user) {
        return new Response(JSON.stringify({ error: 'Failed to create user' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      userId = authData.user.id;

      // Update profile with workspace
      await supabase.from('profiles').update({
        workspace_id: inviteToken.workspace_id,
        display_name: name,
      }).eq('user_id', userId);
    } else {
      return new Response(JSON.stringify({ error: 'Password required for new users' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Mark token as used
    await supabase.from('invite_tokens').update({
      used: true,
    }).eq('token', token);

    // Update team member status
    await supabase.from('membros_equipes').update({
      status: 'active',
      user_id: userId,
      data_aceitacao: new Date().toISOString(),
    }).eq('email_membro', inviteToken.email).eq('workspace_id', inviteToken.workspace_id);

    return new Response(JSON.stringify({ success: true, userId }), {
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