import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useProPlan } from '@/hooks/useProPlan';

export function PlanUpgrade() {
  const [upgrading, setUpgrading] = useState(false);
  const { isPro, refreshProStatus } = useProPlan();

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Erro',
          description: 'Você precisa estar logado',
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ 
          plan_type: 'pro',
          updated_at: new Date().toISOString() 
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Sucesso! 🎉',
        description: 'Seu plano foi atualizado para PRO',
      });

      // Atualizar status
      await refreshProStatus();
      
      // Recarregar página para aplicar mudanças
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Erro ao fazer upgrade:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o plano',
        variant: 'destructive'
      });
    } finally {
      setUpgrading(false);
    }
  };

  const proFeatures = [
    'Colaboração em equipe ilimitada',
    'Sistema de aprovações completo',
    'Criador de ADS avançado',
    'Planner IA com insights estratégicos',
    'Chat com Diana ilimitado',
    'Posts ilimitados por mês',
    'Integração direta com redes sociais',
    'Relatórios estratégicos avançados',
    'Biblioteca de conteúdo ilimitada',
    'Suporte prioritário 24/7'
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Plano Atual */}
      <Card className={isPro ? 'border-primary' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {isPro ? (
                <>
                  <Crown className="h-5 w-5 text-primary" />
                  Plano PRO
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  Plano Free
                </>
              )}
            </CardTitle>
            <Badge variant={isPro ? 'default' : 'secondary'}>
              {isPro ? 'Ativo' : 'Atual'}
            </Badge>
          </div>
          <CardDescription>
            {isPro 
              ? 'Você tem acesso completo a todos os recursos da plataforma'
              : 'Acesso limitado aos recursos básicos'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPro ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                ✅ Todos os recursos PRO desbloqueados
              </p>
              <p className="text-2xl font-bold text-primary">R$ 147/mês</p>
              <p className="text-xs text-muted-foreground">
                ou R$ 127/mês no plano anual
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Recursos limitados • 3 créditos semanais
              </p>
              <p className="text-2xl font-bold">R$ 0/mês</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upgrade para PRO */}
      {!isPro && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Upgrade para PRO
            </CardTitle>
            <CardDescription>
              Desbloqueie todo o potencial do Beelio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-3xl font-bold text-primary">R$ 147</p>
              <p className="text-sm text-muted-foreground">por mês</p>
            </div>

            <ul className="space-y-2">
              {proFeatures.slice(0, 5).map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
              <li className="text-sm text-muted-foreground">
                + {proFeatures.length - 5} recursos adicionais
              </li>
            </ul>

            <Button 
              onClick={handleUpgrade} 
              disabled={upgrading}
              className="w-full"
              size="lg"
            >
              {upgrading ? 'Processando...' : 'Ativar Plano PRO Agora'}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              💳 Em produção: pagamento via Stripe
            </p>
          </CardContent>
        </Card>
      )}

      {/* Detalhes do PRO */}
      {isPro && (
        <Card>
          <CardHeader>
            <CardTitle>Recursos Incluídos</CardTitle>
            <CardDescription>
              Tudo que você tem acesso no plano PRO
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
