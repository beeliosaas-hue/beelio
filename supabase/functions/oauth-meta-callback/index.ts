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
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      const projectUrl = Deno.env.get('PROJECT_URL');
      return Response.redirect(`${projectUrl}/integracoes?error=${error}`, 302);
    }

    if (!code || !state) {
      throw new Error('Code ou state ausentes');
    }

    // Decodificar state
    const { userId, provider } = JSON.parse(atob(state));

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const clientId = Deno.env.get('FACEBOOK_CLIENT_ID');
    const clientSecret = Deno.env.get('FACEBOOK_CLIENT_SECRET');
    const projectUrl = Deno.env.get('PROJECT_URL');
    const redirectUri = `${projectUrl}/functions/v1/oauth-meta-callback`;

    // Trocar code por access_token
    const tokenUrl = new URL('https://graph.facebook.com/v19.0/oauth/access_token');
    tokenUrl.searchParams.set('client_id', clientId!);
    tokenUrl.searchParams.set('client_secret', clientSecret!);
    tokenUrl.searchParams.set('redirect_uri', redirectUri);
    tokenUrl.searchParams.set('code', code);

    const tokenResponse = await fetch(tokenUrl.toString());
    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error('Falha ao obter access_token: ' + JSON.stringify(tokenData));
    }

    const shortLivedToken = tokenData.access_token;

    // Trocar por long-lived token
    const longTokenUrl = new URL('https://graph.facebook.com/v19.0/oauth/access_token');
    longTokenUrl.searchParams.set('grant_type', 'fb_exchange_token');
    longTokenUrl.searchParams.set('client_id', clientId!);
    longTokenUrl.searchParams.set('client_secret', clientSecret!);
    longTokenUrl.searchParams.set('fb_exchange_token', shortLivedToken);

    const longTokenResponse = await fetch(longTokenUrl.toString());
    const longTokenData = await longTokenResponse.json();

    const accessToken = longTokenData.access_token || shortLivedToken;
    const expiresIn = longTokenData.expires_in || 5184000; // 60 dias padrão

    // Buscar páginas do Facebook
    const pagesUrl = `https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`;
    const pagesResponse = await fetch(pagesUrl);
    const pagesData = await pagesResponse.json();

    console.log('Pages data:', pagesData);

    if (pagesData.data && pagesData.data.length > 0) {
      for (const page of pagesData.data) {
        // Salvar conta do Facebook
        await supabaseClient
          .from('social_accounts')
          .upsert({
            user_id: userId,
            provider: 'facebook',
            account_id: page.id,
            account_name: page.name,
            access_token: page.access_token, // Token da página
            expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
            scopes: ['pages_manage_posts', 'pages_show_list'],
            needs_reconnect: false
          }, { onConflict: 'user_id,provider,account_id' });

        // Salvar target do Facebook
        await supabaseClient
          .from('social_targets')
          .upsert({
            user_id: userId,
            provider: 'facebook',
            account_id: page.id,
            target_id: page.id,
            target_type: 'facebook_page',
            target_name: page.name,
            extra: { category: page.category }
          }, { onConflict: 'user_id,provider,target_id' });

        // Buscar Instagram Business Account vinculado à página
        if (provider === 'instagram') {
          const igUrl = `https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`;
          const igResponse = await fetch(igUrl);
          const igData = await igResponse.json();

          console.log('Instagram data for page:', igData);

          if (igData.instagram_business_account) {
            const igId = igData.instagram_business_account.id;

            // Buscar detalhes da conta IG
            const igDetailsUrl = `https://graph.facebook.com/v19.0/${igId}?fields=username,profile_picture_url&access_token=${page.access_token}`;
            const igDetailsResponse = await fetch(igDetailsUrl);
            const igDetails = await igDetailsResponse.json();

            // Salvar conta do Instagram
            await supabaseClient
              .from('social_accounts')
              .upsert({
                user_id: userId,
                provider: 'instagram',
                account_id: igId,
                account_name: igDetails.username || 'Instagram Business',
                avatar_url: igDetails.profile_picture_url,
                access_token: page.access_token, // Usa token da página
                expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
                scopes: ['instagram_basic', 'instagram_content_publish'],
                needs_reconnect: false
              }, { onConflict: 'user_id,provider,account_id' });

            // Salvar target do Instagram
            await supabaseClient
              .from('social_targets')
              .upsert({
                user_id: userId,
                provider: 'instagram',
                account_id: igId,
                target_id: igId,
                target_type: 'instagram_business',
                target_name: igDetails.username || 'Instagram Business',
                extra: { page_id: page.id }
              }, { onConflict: 'user_id,provider,target_id' });
          }
        }
      }
    }

    // Redirecionar de volta para o app
    return Response.redirect(`${projectUrl}/integracoes?connected=meta`, 302);
  } catch (error) {
    console.error('Error in oauth-meta-callback:', error);
    const projectUrl = Deno.env.get('PROJECT_URL');
    return Response.redirect(`${projectUrl}/integracoes?error=${encodeURIComponent(error.message)}`, 302);
  }
});
