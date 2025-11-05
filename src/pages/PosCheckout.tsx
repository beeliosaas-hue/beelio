import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function PosCheckout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get('status') || 'error';
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (status === 'success') {
      loadSubscription();
    } else {
      setLoading(false);
    }
  }, [status]);

  const loadSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/');
        return;
      }

      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      setSubscription(data);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'cancel':
        return <AlertCircle className="h-16 w-16 text-yellow-500" />;
      default:
        return <XCircle className="h-16 w-16 text-red-500" />;
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'success':
        return 'Conta Ativada com Sucesso!';
      case 'cancel':
        return 'Pagamento Cancelado';
      default:
        return 'Erro no Pagamento';
    }
  };

  const getDescription = () => {
    switch (status) {
      case 'success':
        return 'Sua assinatura foi ativada. Vamos começar o onboarding!';
      case 'cancel':
        return 'Você cancelou o processo de pagamento. Volte quando estiver pronto!';
      default:
        return 'Ocorreu um erro ao processar seu pagamento. Tente novamente.';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          <CardTitle className="text-2xl">{getTitle()}</CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'success' && subscription && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm">
                <strong>Plano:</strong> {subscription.plan.toUpperCase()}
              </p>
              <p className="text-sm">
                <strong>Status:</strong> {subscription.status}
              </p>
              {subscription.current_period_end && (
                <p className="text-sm">
                  <strong>Próxima renovação:</strong>{' '}
                  {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            {status === 'success' && (
              <Button
                onClick={() => navigate('/onboarding')}
                className="w-full"
              >
                Começar Onboarding
              </Button>
            )}
            
            {status === 'cancel' && (
              <Button
                onClick={() => window.location.href = 'https://beelio-app.com/planos'}
                className="w-full"
              >
                Ver Planos Novamente
              </Button>
            )}

            {status === 'error' && (
              <Button
                onClick={() => window.location.href = 'https://beelio-app.com/planos'}
                className="w-full"
              >
                Tentar Novamente
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full"
            >
              Ir para Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}