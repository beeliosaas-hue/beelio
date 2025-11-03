import { useState } from 'react';

interface CreditInfo {
  available: number;
  total: number;
  planType: 'free' | 'starter' | 'pro';
  resetTime?: Date;
  isUnlimited: boolean;
}

export function useCredits() {
  // Sempre retorna créditos ilimitados (Plano PRO)
  const [credits] = useState<CreditInfo>({
    available: Infinity,
    total: Infinity,
    planType: 'pro',
    isUnlimited: true
  });
  const [loading] = useState(false);

  const loadCredits = async () => {
    // Sem necessidade de carregar, sempre PRO
  };

  const useCredit = async (): Promise<boolean> => {
    // Sempre retorna true - acesso ilimitado
    return true;
  };

  const getResetTimeString = (): string => {
    return 'Créditos ilimitados';
  };

  return {
    credits,
    loading,
    useCredit,
    refreshCredits: loadCredits,
    getResetTimeString
  };
}
