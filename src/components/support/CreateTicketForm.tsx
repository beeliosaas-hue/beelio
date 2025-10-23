import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const ticketSchema = z.object({
  title: z.string()
    .trim()
    .min(10, "O título deve ter pelo menos 10 caracteres")
    .max(200, "O título deve ter no máximo 200 caracteres"),
  description: z.string()
    .trim()
    .min(20, "A descrição deve ter pelo menos 20 caracteres")
    .max(2000, "A descrição deve ter no máximo 2000 caracteres"),
  priority: z.enum(["P1", "P2", "P3"])
});

interface CreateTicketFormProps {
  onSuccess: () => void;
}

export function CreateTicketForm({ onSuccess }: CreateTicketFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("P3");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validação
    try {
      ticketSchema.parse({ title, description, priority });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }
    }

    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para abrir um chamado",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim(),
          priority,
          status: 'open'
        });

      if (error) throw error;

      toast({
        title: "Chamado criado com sucesso!",
        description: "Nossa equipe irá responder conforme o SLA do seu plano."
      });

      // Reset form
      setTitle("");
      setDescription("");
      setPriority("P3");
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro ao criar chamado",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getSLAText = (p: string) => {
    const sla = {
      P1: "até 2 horas",
      P2: "até 8 horas",
      P3: "até 24 horas"
    };
    return sla[p as keyof typeof sla];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-500/50">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription>
          <strong>Antes de abrir um chamado</strong><br />
          Verifique se sua dúvida já foi respondida em nossa base de conhecimento. Isso pode economizar tempo para ambos!
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="title">
          Título do Chamado <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Descreva brevemente sua dúvida ou problema"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {title.length}/200 caracteres
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">
          Prioridade <span className="text-destructive">*</span>
        </Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className={errors.priority ? "border-destructive" : ""}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="P3">
              <div className="flex flex-col items-start">
                <span>P3 - Normal (SLA: 24h)</span>
                <span className="text-xs text-muted-foreground">Dúvidas gerais</span>
              </div>
            </SelectItem>
            <SelectItem value="P2">
              <div className="flex flex-col items-start">
                <span>P2 - Alto (SLA: 8h)</span>
                <span className="text-xs text-muted-foreground">Problemas que afetam o uso</span>
              </div>
            </SelectItem>
            <SelectItem value="P1">
              <div className="flex flex-col items-start">
                <span>P1 - Crítico (SLA: 2h)</span>
                <span className="text-xs text-muted-foreground">Sistema fora do ar</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.priority && (
          <p className="text-sm text-destructive">{errors.priority}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Resposta em {getSLAText(priority)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Descrição Detalhada <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Descreva sua dúvida ou problema com o máximo de detalhes possível. Inclua passos para reproduzir o problema, mensagens de erro, etc."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
          rows={8}
          className={errors.description ? "border-destructive" : ""}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {description.length}/2000 caracteres
        </p>
      </div>

      <div className="flex items-center gap-2 p-4 bg-accent/30 rounded-lg border border-border">
        <Clock className="h-5 w-5 text-primary" />
        <p className="text-sm">
          <strong>Resposta em até {getSLAText(priority)}</strong>
        </p>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-honey-gradient hover:bg-primary/90"
      >
        {submitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Enviando Chamado...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Enviar Chamado
          </>
        )}
      </Button>
    </form>
  );
}
