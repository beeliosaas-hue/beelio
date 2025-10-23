import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Clock, CheckCircle, AlertCircle, ExternalLink, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  admin_response: string | null;
  responded_at: string | null;
  created_at: string;
}

interface TicketsListProps {
  onCreateNew: () => void;
}

export function TicketsList({ onCreateNew }: TicketsListProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const { toast } = useToast();

  const fetchTickets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar chamados",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const getPriorityBadge = (priority: string) => {
    const config = {
      P1: { label: "P1 - Crítico (SLA: 2h)", variant: "destructive" as const },
      P2: { label: "P2 - Alto (SLA: 8h)", variant: "default" as const },
      P3: { label: "P3 - Normal (SLA: 24h)", variant: "secondary" as const }
    };
    return config[priority as keyof typeof config] || config.P3;
  };

  const getStatusConfig = (status: string) => {
    const config = {
      open: { label: "Aberto", icon: AlertCircle, color: "text-blue-500" },
      in_progress: { label: "Em Andamento", icon: Clock, color: "text-yellow-500" },
      waiting_user: { label: "Aguardando Você", icon: MessageSquare, color: "text-orange-500" },
      resolved: { label: "Resolvido", icon: CheckCircle, color: "text-green-500" },
      closed: { label: "Fechado", icon: CheckCircle, color: "text-gray-500" }
    };
    return config[status as keyof typeof config] || config.open;
  };

  const handleWhatsAppContact = (ticket: Ticket) => {
    const message = `Olá! Gostaria de falar sobre o chamado #${ticket.id.slice(0, 8)}:\n\n"${ticket.title}"\n\nAinda preciso de ajuda adicional com este assunto.`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">Nenhum chamado encontrado</h3>
        <p className="text-muted-foreground mb-6">
          Você ainda não abriu nenhum chamado de suporte
        </p>
        <Button onClick={onCreateNew} className="bg-honey-gradient hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Abrir Primeiro Chamado
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => {
        const priorityBadge = getPriorityBadge(ticket.priority);
        const statusConfig = getStatusConfig(ticket.status);
        const StatusIcon = statusConfig.icon;

        return (
          <Card key={ticket.id} className="hover:shadow-md transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{ticket.title}</h3>
                    <Badge variant={priorityBadge.variant}>{priorityBadge.label}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                    <span>{statusConfig.label}</span>
                    <span className="mx-2">•</span>
                    <span>
                      Aberto em {format(new Date(ticket.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {ticket.description}
              </p>

              {ticket.admin_response && (
                <div className="bg-accent/30 rounded-lg p-4 mb-4 border-l-4 border-primary">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-semibold text-sm">Resposta do Suporte</span>
                    {ticket.responded_at && (
                      <span className="text-xs text-muted-foreground">
                        • {format(new Date(ticket.responded_at), "dd/MM/yyyy 'às' HH:mm")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm">{ticket.admin_response}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedTicket(ticket)}>
                  Ver Detalhes
                </Button>
                
                {ticket.status === 'waiting_user' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleWhatsAppContact(ticket)}
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Falar no WhatsApp
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Ticket Details Modal */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Chamado</DialogTitle>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{selectedTicket.title}</h3>
                <div className="flex gap-2 mb-4">
                  <Badge variant={getPriorityBadge(selectedTicket.priority).variant}>
                    {getPriorityBadge(selectedTicket.priority).label}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {(() => {
                      const StatusIcon = getStatusConfig(selectedTicket.status).icon;
                      return <StatusIcon className="h-3 w-3" />;
                    })()}
                    {getStatusConfig(selectedTicket.status).label}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Descrição</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selectedTicket.description}
                </p>
              </div>

              {selectedTicket.admin_response && (
                <>
                  <Separator />
                  <div className="bg-accent/30 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Resposta do Suporte
                    </h4>
                    <p className="text-sm whitespace-pre-wrap">
                      {selectedTicket.admin_response}
                    </p>
                    {selectedTicket.responded_at && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Respondido em {format(new Date(selectedTicket.responded_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    )}
                  </div>
                </>
              )}

              <Separator />

              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Chamado #{selectedTicket.id.slice(0, 8)}</span>
                <span>
                  Aberto em {format(new Date(selectedTicket.created_at), "dd/MM/yyyy 'às' HH:mm")}
                </span>
              </div>

              {selectedTicket.status === 'waiting_user' && (
                <Button
                  className="w-full"
                  onClick={() => handleWhatsAppContact(selectedTicket)}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Continuar Atendimento no WhatsApp
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
