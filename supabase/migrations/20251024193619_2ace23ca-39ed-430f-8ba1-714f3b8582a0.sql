-- =============================================
-- BEELIO - ESTRUTURA COMPLETA DE BANCO DE DADOS
-- =============================================

-- 1. CRIAR ENUMS
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.plano_tipo AS ENUM ('free', 'starter', 'pro');
CREATE TYPE public.funcao_membro AS ENUM ('administrador', 'editor', 'visualizador');
CREATE TYPE public.avaliacao_tipo AS ENUM ('positiva', 'neutra', 'negativa');

-- =============================================
-- 2. TABELA: ONBOARDING (contexto inicial)
-- =============================================
CREATE TABLE public.onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_marca TEXT,
  segmento TEXT,
  publico_alvo TEXT,
  objetivos TEXT,
  voz_da_marca TEXT,
  identidade_visual JSONB DEFAULT '{}'::jsonb,
  expectativas TEXT,
  data_preenchimento TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completado BOOLEAN DEFAULT false,
  UNIQUE(user_id)
);

ALTER TABLE public.onboarding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own onboarding"
  ON public.onboarding FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding"
  ON public.onboarding FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding"
  ON public.onboarding FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- 3. DIANA - CONTEXTOS E HISTÓRICO
-- =============================================
CREATE TABLE public.diana_contextos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contexto_atual JSONB DEFAULT '{}'::jsonb,
  historico_conversas JSONB DEFAULT '[]'::jsonb,
  ultima_interacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
  tokens_usados INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.diana_contextos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own context"
  ON public.diana_contextos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own context"
  ON public.diana_contextos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own context"
  ON public.diana_contextos FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- 4. DIANA - FEEDBACK
-- =============================================
CREATE TABLE public.diana_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversa_id UUID REFERENCES public.diana_conversations(id) ON DELETE CASCADE,
  mensagem TEXT NOT NULL,
  resposta_diana TEXT,
  avaliacao avaliacao_tipo,
  data_feedback TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.diana_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own feedback"
  ON public.diana_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own feedback"
  ON public.diana_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 5. FERIADOS E DATAS SAZONAIS
-- =============================================
CREATE TABLE public.feriados_nacionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  data DATE NOT NULL,
  tipo TEXT,
  regiao TEXT DEFAULT 'Brasil',
  ano INTEGER NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(nome, data, regiao)
);

ALTER TABLE public.feriados_nacionais ENABLE ROW LEVEL SECURITY;

-- Todos podem visualizar feriados
CREATE POLICY "Anyone can view holidays"
  ON public.feriados_nacionais FOR SELECT
  USING (true);

-- Criar índice para busca por data
CREATE INDEX idx_feriados_data ON public.feriados_nacionais(data);
CREATE INDEX idx_feriados_ano ON public.feriados_nacionais(ano);

-- =============================================
-- 6. COLABORAÇÃO EM EQUIPE (TABELA PRINCIPAL PRIMEIRO)
-- =============================================
CREATE TABLE public.equipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_principal_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_equipe TEXT NOT NULL,
  descricao TEXT,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.equipes ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 7. MEMBROS DE EQUIPES (DEPOIS DA TABELA EQUIPES)
-- =============================================
CREATE TABLE public.membros_equipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipe_id UUID NOT NULL REFERENCES public.equipes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_membro TEXT NOT NULL,
  email_membro TEXT NOT NULL,
  funcao funcao_membro DEFAULT 'visualizador',
  ativo BOOLEAN DEFAULT true,
  convite_aceito BOOLEAN DEFAULT false,
  data_convite TIMESTAMP WITH TIME ZONE DEFAULT now(),
  data_aceitacao TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(equipe_id, email_membro)
);

ALTER TABLE public.membros_equipes ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 8. POLICIES PARA EQUIPES (AGORA QUE MEMBROS_EQUIPES EXISTE)
-- =============================================

CREATE POLICY "Users can view teams they own or are members of"
  ON public.equipes FOR SELECT
  USING (
    auth.uid() = usuario_principal_id OR
    EXISTS (
      SELECT 1 FROM public.membros_equipes
      WHERE equipe_id = equipes.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own teams"
  ON public.equipes FOR INSERT
  WITH CHECK (auth.uid() = usuario_principal_id);

CREATE POLICY "Team owners can update their teams"
  ON public.equipes FOR UPDATE
  USING (auth.uid() = usuario_principal_id);

CREATE POLICY "Team owners can delete their teams"
  ON public.equipes FOR DELETE
  USING (auth.uid() = usuario_principal_id);

-- =============================================
-- 9. POLICIES PARA MEMBROS DE EQUIPES
-- =============================================

CREATE POLICY "Team members can view their team"
  ON public.membros_equipes FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.equipes
      WHERE id = membros_equipes.equipe_id
      AND usuario_principal_id = auth.uid()
    )
  );

CREATE POLICY "Team owners can manage members"
  ON public.membros_equipes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.equipes
      WHERE id = equipe_id AND usuario_principal_id = auth.uid()
    )
  );

CREATE POLICY "Team owners can update members"
  ON public.membros_equipes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.equipes
      WHERE id = equipe_id AND usuario_principal_id = auth.uid()
    )
  );

CREATE POLICY "Team owners can delete members"
  ON public.membros_equipes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.equipes
      WHERE id = equipe_id AND usuario_principal_id = auth.uid()
    )
  );

-- =============================================
-- 10. USER ROLES (segurança)
-- =============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Função de segurança para verificar roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- =============================================
-- 11. VIEWS PARA DASHBOARDS
-- =============================================

-- View: Relatórios completos com informações do usuário
CREATE OR REPLACE VIEW public.view_relatorios_completos AS
SELECT 
  r.id,
  r.user_id,
  p.display_name as nome_usuario,
  p.email as email_usuario,
  r.tipo_relatorio,
  r.periodo_inicio,
  r.periodo_fim,
  r.dados,
  r.created_at,
  r.formato
FROM public.relatorios r
LEFT JOIN public.profiles p ON r.user_id = p.user_id;

-- View: Tendências ativas (últimos 30 dias)
CREATE OR REPLACE VIEW public.view_tendencias_ativas AS
SELECT 
  id,
  titulo,
  descricao,
  categoria,
  tipo,
  data_evento,
  relevancia,
  segmento,
  fonte,
  created_at
FROM public.tendencias
WHERE 
  (data_evento IS NULL OR data_evento >= CURRENT_DATE - INTERVAL '30 days')
  OR (created_at >= CURRENT_DATE - INTERVAL '30 days')
ORDER BY relevancia DESC, created_at DESC;

-- View: Posts planejados por usuário
CREATE OR REPLACE VIEW public.view_posts_usuario AS
SELECT 
  p.id,
  p.user_id,
  pr.display_name as nome_usuario,
  p.titulo,
  p.conteudo,
  p.status,
  p.tipo,
  p.data_agendamento,
  p.redes_sociais,
  p.created_at,
  p.updated_at
FROM public.posts p
LEFT JOIN public.profiles pr ON p.user_id = pr.user_id
ORDER BY p.data_agendamento DESC NULLS LAST;

-- =============================================
-- 12. TRIGGERS PARA UPDATED_AT
-- =============================================

CREATE TRIGGER update_diana_contextos_updated_at
  BEFORE UPDATE ON public.diana_contextos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipes_updated_at
  BEFORE UPDATE ON public.equipes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 13. ÍNDICES PARA PERFORMANCE
-- =============================================

CREATE INDEX idx_diana_contextos_user_id ON public.diana_contextos(user_id);
CREATE INDEX idx_diana_feedback_user_id ON public.diana_feedback(user_id);
CREATE INDEX idx_diana_feedback_conversa_id ON public.diana_feedback(conversa_id);
CREATE INDEX idx_onboarding_user_id ON public.onboarding(user_id);
CREATE INDEX idx_equipes_usuario_principal ON public.equipes(usuario_principal_id);
CREATE INDEX idx_membros_equipes_user_id ON public.membros_equipes(user_id);
CREATE INDEX idx_membros_equipes_equipe_id ON public.membros_equipes(equipe_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);

-- =============================================
-- 14. FUNÇÃO: Criar perfil automaticamente
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Criar perfil
  INSERT INTO public.profiles (user_id, email, display_name, plan_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    'free'
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Criar role padrão
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Criar contexto Diana
  INSERT INTO public.diana_contextos (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Trigger para criar dados ao registrar usuário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 15. POPULAR FERIADOS NACIONAIS 2025
-- =============================================

INSERT INTO public.feriados_nacionais (nome, data, tipo, regiao, ano, descricao) VALUES
('Confraternização Universal', '2025-01-01', 'Nacional', 'Brasil', 2025, 'Ano Novo'),
('Carnaval', '2025-03-04', 'Nacional', 'Brasil', 2025, 'Terça-feira de Carnaval'),
('Páscoa', '2025-04-20', 'Nacional', 'Brasil', 2025, 'Domingo de Páscoa'),
('Tiradentes', '2025-04-21', 'Nacional', 'Brasil', 2025, 'Dia de Tiradentes'),
('Dia do Trabalho', '2025-05-01', 'Nacional', 'Brasil', 2025, 'Dia Mundial do Trabalho'),
('Corpus Christi', '2025-06-19', 'Nacional', 'Brasil', 2025, 'Corpus Christi'),
('Independência do Brasil', '2025-09-07', 'Nacional', 'Brasil', 2025, 'Dia da Independência'),
('Nossa Senhora Aparecida', '2025-10-12', 'Nacional', 'Brasil', 2025, 'Padroeira do Brasil'),
('Finados', '2025-11-02', 'Nacional', 'Brasil', 2025, 'Dia de Finados'),
('Proclamação da República', '2025-11-15', 'Nacional', 'Brasil', 2025, 'Dia da República'),
('Consciência Negra', '2025-11-20', 'Nacional', 'Brasil', 2025, 'Dia da Consciência Negra'),
('Natal', '2025-12-25', 'Nacional', 'Brasil', 2025, 'Natal')
ON CONFLICT (nome, data, regiao) DO NOTHING;