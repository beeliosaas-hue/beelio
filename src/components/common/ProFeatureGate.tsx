import { ReactNode } from 'react';
import { usePlan } from '@/hooks/usePlan';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';

interface ProFeatureGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  requirePro?: boolean;
}

export function ProFeatureGate({ children, fallback, requirePro = true }: ProFeatureGateProps) {
  const { isPro, isStarter, loading } = usePlan();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  if (loading) {
    return <div className="flex items-center justify-center p-8">Carregando...</div>;
  }

  const hasAccess = requirePro ? isPro : (isPro || isStarter);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <>
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg bg-muted/50">
          <Lock className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {requirePro ? 'Recurso exclusivo PRO' : 'Recurso exclusivo Starter/PRO'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
            {requirePro 
              ? 'Faça upgrade para o plano PRO para acessar equipes, aprovações e muito mais.'
              : 'Faça upgrade para o plano Starter ou PRO para acessar este recurso.'}
          </p>
          <Button onClick={() => setShowUpgradeDialog(true)}>
            Fazer Upgrade
          </Button>
        </div>

        <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upgrade de Plano</DialogTitle>
              <DialogDescription>
                Escolha o plano ideal para seu negócio
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                Para acessar este recurso, você precisa fazer upgrade para um plano pago.
              </p>
              <Button
                className="w-full"
                onClick={() => {
                  window.location.href = 'https://beelio-app.com/planos';
                }}
              >
                Ver Planos
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return <>{children}</>;
}