import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from 'https://esm.sh/stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!signature || !webhookSecret) {
    return new Response('Missing signature or secret', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_email || session.customer_details?.email;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (!email) break;

        // Find or create user
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_id, workspace_id')
          .eq('email', email)
          .single();

        if (profile) {
          // Update subscription
          await supabase.from('subscriptions').upsert({
            user_id: profile.user_id,
            workspace_id: profile.workspace_id,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan: 'starter',
            status: 'active',
          });
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('user_id, workspace_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (existingSub) {
          const plan = subscription.items.data[0]?.price.id.includes('pro') ? 'pro' : 'starter';
          
          await supabase.from('subscriptions').update({
            plan,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          }).eq('stripe_customer_id', customerId);

          // Update profile plan_type
          await supabase.from('profiles').update({
            plan_type: plan,
          }).eq('user_id', existingSub.user_id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (existingSub) {
          await supabase.from('subscriptions').update({
            status: 'canceled',
            plan: 'free',
            updated_at: new Date().toISOString(),
          }).eq('stripe_customer_id', customerId);

          await supabase.from('profiles').update({
            plan_type: 'free',
          }).eq('user_id', existingSub.user_id);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        await supabase.from('subscriptions').update({
          status: 'incomplete',
          updated_at: new Date().toISOString(),
        }).eq('stripe_customer_id', customerId);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 400 }
    );
  }
});