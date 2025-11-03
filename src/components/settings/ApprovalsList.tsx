import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Clock, FileText, Image, Package, Megaphone } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Approval {
  id: string;
  tipo_aprovacao: string;
  item_id: string;
  status: string;
  user_id: string;
  comentario?: string;
  aprovado_por?: string;
  data: string;
  created_at: string;
}

export function ApprovalsList() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [rejectComment, setRejectComment] = useState('');

  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = async () => {
    try {
      const { data, error } = await supabase
        .from('aprovacoes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApprovals(data || []);
    } catch (error) {
      console.error('Erro ao carregar aprovações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as aprovações',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (approval: Approval) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('aprovacoes')
        .update({
          status: 'aprovado',
          aprovado_por: user?.id,
          data: new Date().toISOString()
        })
        .eq('id', approval.id);

      if (error) throw error;

      toast({
        title: 'Aprovado',
        description: 'Item aprovado com sucesso',
      });

      loadApprovals();
    } catch (error) {
      console.error('Erro ao aprovar:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível aprovar o item',
        variant: 'destructive'
      });
    }
  };

  const handleReject = async () => {
    if (!selectedApproval) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('aprovacoes')
        .update({
          status: 'reprovado',
          aprovado_por: user?.id,
          comentario: rejectComment,
          data: new Date().toISOString()
        })
        .eq('id', selectedApproval.id);

      if (error) throw error;

      toast({
        title: 'Reprovado',
        description: 'Item reprovado com sucesso',
      });

      setRejectDialogOpen(false);
      setRejectComment('');
      setSelectedApproval(null);
      loadApprovals();
    } catch (error) {
      console.error('Erro ao reprovar:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível reprovar o item',
        variant: 'destructive'
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return <FileText className="h-4 w-4" />;
      case 'briefing': return <FileText className="h-4 w-4" />;
      case 'branding': return <Image className="h-4 w-4" />;
      case 'campanha': return <Megaphone className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
          <Clock className="h-3 w-3 mr-1" />
          Pendente
        </Badge>;
      case 'aprovado':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
          <CheckCircle className="h-3 w-3 mr-1" />
          Aprovado
        </Badge>;
      case 'reprovado':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
          <XCircle className="h-3 w-3 mr-1" />
          Reprovado
        </Badge>;
      default:
        return null;
    }
  };

  const filterApprovals = (status: string) => {
    return approvals.filter(a => a.status === status);
  };

  const renderApprovalCard = (approval: Approval) => (
    <Card key={approval.id} className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-primary/10 rounded-lg">
              {getTypeIcon(approval.tipo_aprovacao)}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold capitalize">{approval.tipo_aprovacao}</h4>
              <p className="text-sm text-muted-foreground">
                ID: {approval.item_id.slice(0, 8)}...
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(approval.created_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              {approval.comentario && (
                <p className="text-sm mt-2 p-2 bg-muted rounded">
                  <strong>Comentário:</strong> {approval.comentario}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(approval.status)}
            {approval.status === 'pendente' && (
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 hover:bg-green-500/10"
                  onClick={() => handleApprove(approval)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Aprovar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:bg-red-500/10"
                  onClick={() => {
                    setSelectedApproval(approval);
                    setRejectDialogOpen(true);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reprovar
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Carregando aprovações...</p>
      </div>
    );
  }

  return (
    <>
      <Tabs defaultValue="pendente" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pendente">
            Pendentes ({filterApprovals('pendente').length})
          </TabsTrigger>
          <TabsTrigger value="aprovado">
            Aprovados ({filterApprovals('aprovado').length})
          </TabsTrigger>
          <TabsTrigger value="reprovado">
            Reprovados ({filterApprovals('reprovado').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pendente" className="mt-6">
          {filterApprovals('pendente').length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhuma aprovação pendente
              </CardContent>
            </Card>
          ) : (
            filterApprovals('pendente').map(renderApprovalCard)
          )}
        </TabsContent>

        <TabsContent value="aprovado" className="mt-6">
          {filterApprovals('aprovado').length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhum item aprovado
              </CardContent>
            </Card>
          ) : (
            filterApprovals('aprovado').map(renderApprovalCard)
          )}
        </TabsContent>

        <TabsContent value="reprovado" className="mt-6">
          {filterApprovals('reprovado').length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhum item reprovado
              </CardContent>
            </Card>
          ) : (
            filterApprovals('reprovado').map(renderApprovalCard)
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprovar Item</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Motivo da reprovação (opcional)
            </label>
            <Textarea
              placeholder="Descreva o motivo da reprovação..."
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
            >
              Reprovar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}