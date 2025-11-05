import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PlanInfo {
  plan: 'free' | 'starter' | 'pro';
  status: string;
  isPro: boolean;
  isStarter: boolean;
  isFree: boolean;
  loading: boolean;
}

export function usePlan(): PlanInfo {
  const [planInfo, setPlanInfo] = useState<PlanInfo>({
    plan: 'free',
    status: 'inactive',
    isPro: false,
    isStarter: false,
    isFree: true,
    loading: true,
  });

  useEffect(() => {
    loadPlan();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('plan-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
        },
        () => {
          loadPlan();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        () => {
          loadPlan();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadPlan = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setPlanInfo({
          plan: 'free',
          status: 'inactive',
          isPro: false,
          isStarter: false,
          isFree: true,
          loading: false,
        });
        return;
      }

      // First check subscriptions table
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan, status')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .single();

      if (subscription) {
        setPlanInfo({
          plan: subscription.plan as 'free' | 'starter' | 'pro',
          status: subscription.status,
          isPro: subscription.plan === 'pro',
          isStarter: subscription.plan === 'starter',
          isFree: subscription.plan === 'free',
          loading: false,
        });
        return;
      }

      // Fallback to profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan_type')
        .eq('user_id', user.id)
        .single();

      const plan = profile?.plan_type || 'free';
      setPlanInfo({
        plan: plan as 'free' | 'starter' | 'pro',
        status: 'active',
        isPro: plan === 'pro',
        isStarter: plan === 'starter',
        isFree: plan === 'free',
        loading: false,
      });
    } catch (error) {
      console.error('Error loading plan:', error);
      setPlanInfo({
        plan: 'free',
        status: 'error',
        isPro: false,
        isStarter: false,
        isFree: true,
        loading: false,
      });
    }
  };

  return planInfo;
}