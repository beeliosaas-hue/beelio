-- Criar função helper para verificar se usuário é PRO
CREATE OR REPLACE FUNCTION public.is_user_pro(target_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = target_user_id 
      AND plan_type = 'pro'
  );
$$;

-- Ajustar tabela equipes para adicionar workspace_id se necessário
ALTER TABLE public.equipes 
  ADD COLUMN IF NOT EXISTS ativo boolean DEFAULT true;

-- Ajustar tabela membros_equipes para melhor controle
ALTER TABLE public.membros_equipes
  ADD COLUMN IF NOT EXISTS status text CHECK (status IN ('active', 'invited', 'suspended')) DEFAULT 'invited';

-- Atualizar membros existentes para 'active' se convite_aceito
UPDATE public.membros_equipes 
SET status = 'active' 
WHERE convite_aceito = true AND status IS NULL;

-- Ajustar tabela aprovacoes para incluir campos necessários
ALTER TABLE public.aprovacoes
  ADD COLUMN IF NOT EXISTS requested_by uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS decided_by uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS decided_at timestamptz,
  ADD COLUMN IF NOT EXISTS entity_type text CHECK (entity_type IN ('post', 'briefing', 'branding', 'planner')),
  ADD COLUMN IF NOT EXISTS entity_id uuid;

-- Migrar dados existentes
UPDATE public.aprovacoes 
SET 
  requested_by = user_id,
  entity_type = tipo_aprovacao,
  entity_id = item_id
WHERE requested_by IS NULL;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_aprovacoes_status ON public.aprovacoes(status);
CREATE INDEX IF NOT EXISTS idx_aprovacoes_equipe ON public.aprovacoes(equipe_id);
CREATE INDEX IF NOT EXISTS idx_aprovacoes_assigned ON public.aprovacoes(assigned_to);
CREATE INDEX IF NOT EXISTS idx_membros_equipes_user ON public.membros_equipes(user_id);
CREATE INDEX IF NOT EXISTS idx_membros_equipes_status ON public.membros_equipes(status);

-- Atualizar políticas RLS para aprovações com verificação Pro
DROP POLICY IF EXISTS "Users can view approvals from their teams" ON public.aprovacoes;
CREATE POLICY "Pro users can view team approvals"
ON public.aprovacoes FOR SELECT
USING (
  public.is_user_pro(auth.uid()) AND (
    auth.uid() = user_id 
    OR auth.uid() = requested_by 
    OR auth.uid() = assigned_to
    OR EXISTS (
      SELECT 1 FROM membros_equipes me
      WHERE me.equipe_id = aprovacoes.equipe_id 
        AND me.user_id = auth.uid()
        AND me.status = 'active'
    )
  )
);

DROP POLICY IF EXISTS "Users can create approvals" ON public.aprovacoes;
CREATE POLICY "Pro users can create approvals"
ON public.aprovacoes FOR INSERT
WITH CHECK (
  public.is_user_pro(auth.uid()) AND auth.uid() = requested_by
);

DROP POLICY IF EXISTS "Team members can update approvals" ON public.aprovacoes;
CREATE POLICY "Pro reviewers can update approvals"
ON public.aprovacoes FOR UPDATE
USING (
  public.is_user_pro(auth.uid()) AND (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM membros_equipes me
      WHERE me.equipe_id = aprovacoes.equipe_id 
        AND me.user_id = auth.uid()
        AND me.funcao IN ('administrador', 'editor')
        AND me.status = 'active'
    )
  )
);

-- Atualizar políticas de membros_equipes para verificar Pro
DROP POLICY IF EXISTS "Team owners can manage members" ON public.membros_equipes;
CREATE POLICY "Pro team owners can manage members"
ON public.membros_equipes FOR ALL
USING (
  public.is_user_pro(auth.uid()) AND
  EXISTS (
    SELECT 1 FROM equipes e
    WHERE e.id = membros_equipes.equipe_id 
      AND e.usuario_principal_id = auth.uid()
  )
);