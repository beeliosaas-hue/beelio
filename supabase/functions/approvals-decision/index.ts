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

    const { approval_id, decision, comment } = await req.json();

    // Get current approval
    const { data: currentApproval } = await supabase
      .from('aprovacoes')
      .select('comments')
      .eq('id', approval_id)
      .single();

    const comments = currentApproval?.comments || [];
    comments.push({
      author: user.id,
      timestamp: new Date().toISOString(),
      text: comment || '',
      decision,
    });

    // Map decision to status
    const statusMap: Record<string, string> = {
      'approved': 'aprovado',
      'changes_requested': 'pendente',
      'rejected': 'reprovado',
    };

    // Update approval
    const { data: approval, error } = await supabase.from('aprovacoes').update({
      status: statusMap[decision] || 'pendente',
      decided_by: user.id,
      decided_at: new Date().toISOString(),
      comments,
    }).eq('id', approval_id).select().single();

    if (error) {
      throw error;
    }

    // Call n8n webhook
    try {
      await fetch(Deno.env.get('N8N_WEBHOOK_URL') || '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'approval_decision',
          approval,
          decision,
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