import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useProPlan } from '@/hooks/useProPlan';
import { toast } from '@/hooks/use-toast';

interface ApprovalButtonProps {
  entityType: 'post' | 'briefing' | 'branding' | 'planner';
  entityId: string;
  currentStatus?: 'pendente' | 'aprovado' | 'reprovado' | null;
  onStatusChange?: (status: string) => void;
}

interface TeamMember {
  id: string;
  nome_membro: string;
  email_membro: string;
  funcao: string;
}

export function ApprovalButton({ 
  entityType, 
  entityId, 
  currentStatus,
  onStatusChange 
}: ApprovalButtonProps) {
  const { isPro, loading: loadingPro } = useProPlan();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reviewers, setReviewers] = useState<TeamMember[]>([]);
  const [selectedReviewer, setSelectedReviewer] = useState('');
  const [observation, setObservation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [equipeId, setEquipeId] = useState<string | null>(null);

  useEffect(() => {
    if (isPro) {
      loadTeamData();
    }
  }, [isPro]);

  const loadTeamData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar equipe do usuário
      const { data: equipe } = await supabase
        .from('equipes')
        .select('id')
        .eq('usuario_principal_id', user.id)
        .single();

      if (equipe) {
        setEquipeId(equipe.id);

        // Buscar revisores da equipe
        const { data: members } = await supabase
          .from('membros_equipes')
          .select('*')
          .eq('equipe_id', equipe.id)
          .eq('status', 'active')
          .in('funcao', ['administrador', 'editor']);

        setReviewers(members || []);
      }
    } catch (error) {
      console.error('Erro ao carregar equipe:', error);
    }
  };

  const handleSubmitApproval = async () => {
    if (!selectedReviewer || !equipeId) {
      toast({
        title: 'Erro',
        description: 'Selecione um revisor',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('approvals', {
        body: {
          equipe_id: equipeId,
          entity_type: entityType,
          entity_id: entityId,
          assigned_to: selectedReviewer
        }
      });

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Solicitação de aprovação enviada com sucesso'
      });

      setDialogOpen(false);
      setSelectedReviewer('');
      setObservation('');
      
      if (onStatusChange) {
        onStatusChange('pendente');
      }
    } catch (error) {
      console.error('Erro ao enviar aprovação:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a solicitação',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPro) return null;

  if (!isPro) return null;

  const getStatusBadge = () => {
    if (!currentStatus) return null;

    switch (currentStatus) {
      case 'pendente':
        return (
          <div className="flex items-center gap-2 text-yellow-600 bg-yellow-500/10 px-3 py-1 rounded-full text-sm">
            <Clock className="h-3 w-3" />
            Aguardando aprovação
          </div>
        );
      case 'aprovado':
        return (
          <div className="flex items-center gap-2 text-green-600 bg-green-500/10 px-3 py-1 rounded-full text-sm">
            <CheckCircle className="h-3 w-3" />
            Aprovado
          </div>
        );
      case 'reprovado':
        return (
          <div className="flex items-center gap-2 text-red-600 bg-red-500/10 px-3 py-1 rounded-full text-sm">
            Reprovado
          </div>
        );
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        {currentStatus && getStatusBadge()}
        
        {(!currentStatus || currentStatus === 'reprovado') && (
          <Button
            onClick={() => setDialogOpen(true)}
            variant="outline"
            disabled={reviewers.length === 0}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Enviar para aprovação
          </Button>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar para aprovação</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reviewer">Selecionar Revisor *</Label>
              <Select value={selectedReviewer} onValueChange={setSelectedReviewer}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um revisor" />
                </SelectTrigger>
                <SelectContent>
                  {reviewers.map((reviewer) => (
                    <SelectItem key={reviewer.id} value={reviewer.id}>
                      {reviewer.nome_membro} ({reviewer.funcao})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {reviewers.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Você precisa adicionar membros à equipe primeiro
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="observation">Observação (opcional)</Label>
              <Textarea
                id="observation"
                placeholder="Adicione observações sobre esta solicitação..."
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmitApproval}
              disabled={submitting || !selectedReviewer}
            >
              {submitting ? 'Enviando...' : 'Enviar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
