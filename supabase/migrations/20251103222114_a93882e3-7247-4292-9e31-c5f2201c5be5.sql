-- Criar tabela de aprovações
CREATE TABLE public.aprovacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipe_id UUID REFERENCES public.equipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  tipo_aprovacao TEXT NOT NULL CHECK (tipo_aprovacao IN ('post', 'briefing', 'branding', 'campanha')),
  item_id UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pendente', 'aprovado', 'reprovado')) DEFAULT 'pendente',
  aprovado_por UUID,
  comentario TEXT,
  data TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.aprovacoes ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para aprovações
CREATE POLICY "Users can view approvals from their teams"
ON public.aprovacoes
FOR SELECT
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.membros_equipes
    WHERE membros_equipes.equipe_id = aprovacoes.equipe_id
    AND membros_equipes.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create approvals"
ON public.aprovacoes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Team members can update approvals"
ON public.aprovacoes
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.membros_equipes
    WHERE membros_equipes.equipe_id = aprovacoes.equipe_id
    AND membros_equipes.user_id = auth.uid()
    AND membros_equipes.funcao IN ('editor', 'administrador')
  )
);

-- Trigger para updated_at
CREATE TRIGGER update_aprovacoes_updated_at
BEFORE UPDATE ON public.aprovacoes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();