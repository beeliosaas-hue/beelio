import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-n8n-secret',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validar secret do n8n
    const n8nSecret = req.headers.get('x-n8n-secret');
    const expectedSecret = Deno.env.get('N8N_SOCIAL_SECRET');
    
    if (!n8nSecret || n8nSecret !== expectedSecret) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { socialPostId, status, externalPostId, publishedAt, errorMessage } = await req.json();

    if (!socialPostId) {
      return new Response(JSON.stringify({ error: 'socialPostId é obrigatório' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Atualizar o registro em social_posts
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (externalPostId) {
      updateData.external_post_id = externalPostId;
    }

    if (publishedAt) {
      updateData.published_at = publishedAt;
    }

    if (errorMessage) {
      updateData.error_message = errorMessage;
    }

    const { data, error } = await supabaseClient
      .from('social_posts')
      .update(updateData)
      .eq('id', socialPostId)
      .select()
      .single();

    if (error) {
      console.error('Error updating social_posts:', error);
      throw error;
    }

    console.log('Updated social_posts:', data);

    return new Response(JSON.stringify({ 
      success: true,
      data 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in social-status-update:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
