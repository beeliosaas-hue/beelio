import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreditInfo {
  available: number;
  total: number;
  planType: 'free' | 'starter' | 'pro';
  resetTime?: Date;
  isUnlimited: boolean;
}

export function useCredits() {
  const [credits, setCredits] = useState<CreditInfo>({
    available: 0,
    total: 0,
    planType: 'free',
    isUnlimited: false
  });
  const [loading, setLoading] = useState(true);

  const loadCredits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar plano do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan_type')
        .eq('user_id', user.id)
        .single();

      const planType = (profile?.plan_type || 'free') as 'free' | 'starter' | 'pro';

      // Plano Pro = créditos ilimitados
      if (planType === 'pro') {
        setCredits({
          available: Infinity,
          total: Infinity,
          planType,
          isUnlimited: true
        });
        setLoading(false);
        return;
      }

      // Calcular período de reset
      const now = new Date();
      let resetTime: Date;
      let totalCredits: number;

      if (planType === 'free') {
        // Free: 3 créditos por semana (reset toda segunda às 00h)
        totalCredits = 3;
        const dayOfWeek = now.getDay();
        const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7;
        resetTime = new Date(now);
        resetTime.setDate(now.getDate() + daysUntilMonday);
        resetTime.setHours(0, 0, 0, 0);
      } else {
        // Starter: 5 créditos por dia (reset todo dia às 00h)
        totalCredits = 5;
        resetTime = new Date(now);
        resetTime.setDate(now.getDate() + 1);
        resetTime.setHours(0, 0, 0, 0);
      }

      // Buscar conversas do período atual
      const periodStart = new Date(resetTime);
      if (planType === 'free') {
        periodStart.setDate(periodStart.getDate() - 7);
      } else {
        periodStart.setDate(periodStart.getDate() - 1);
      }

      const { data: conversations } = await supabase
        .from('diana_conversations')
        .select('creditos_usados')
        .eq('user_id', user.id)
        .gte('created_at', periodStart.toISOString());

      const usedCredits = conversations?.reduce(
        (sum, conv) => sum + (conv.creditos_usados || 1),
        0
      ) || 0;

      const availableCredits = Math.max(0, totalCredits - usedCredits);

      setCredits({
        available: availableCredits,
        total: totalCredits,
        planType,
        resetTime,
        isUnlimited: false
      });

    } catch (error) {
      console.error('Erro ao carregar créditos:', error);
      toast.error('Erro ao verificar créditos disponíveis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCredits();
  }, []);

  const useCredit = async (): Promise<boolean> => {
    if (credits.isUnlimited) return true;
    
    if (credits.available <= 0) {
      const planName = credits.planType === 'free' ? 'Starter' : 'Pro';
      toast.error(
        `Você esgotou seus créditos! ${credits.planType === 'free' ? 'Aguarde até segunda-feira ou' : 'Aguarde até amanhã ou'} faça upgrade para o plano ${planName}.`,
        { duration: 5000 }
      );
      return false;
    }

    await loadCredits();
    return true;
  };

  const getResetTimeString = (): string => {
    if (credits.isUnlimited) return 'Créditos ilimitados';
    if (!credits.resetTime) return '';

    const now = new Date();
    const diff = credits.resetTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (credits.planType === 'free') {
      const days = Math.floor(hours / 24);
      return `Renova em ${days}d ${hours % 24}h`;
    }
    return `Renova em ${hours}h ${minutes}m`;
  };

  return {
    credits,
    loading,
    useCredit,
    refreshCredits: loadCredits,
    getResetTimeString
  };
}
