import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useProPlan() {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkProStatus();
  }, []);

  const checkProStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsPro(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('plan_type')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Erro ao verificar plano:', error);
        setIsPro(false);
      } else {
        setIsPro(data?.plan_type === 'pro');
      }
    } catch (error) {
      console.error('Erro ao verificar plano:', error);
      setIsPro(false);
    } finally {
      setLoading(false);
    }
  };

  return { isPro, loading, refreshProStatus: checkProStatus };
}
