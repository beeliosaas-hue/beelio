-- Criar tabelas para sincronização automática do Beelio

-- Tabela de profiles de usuários
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'starter', 'pro')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de briefings de marca
CREATE TABLE public.briefings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome_marca TEXT NOT NULL,
  site TEXT,
  redes_sociais TEXT[],
  segmento_atuacao TEXT,
  localizacao TEXT,
  missao TEXT,
  visao TEXT,
  valores TEXT,
  personalidade TEXT[],
  tom_voz TEXT,
  cliente_ideal TEXT,
  faixa_etaria TEXT,
  localizacao_publico TEXT,
  nivel_socioeconomico TEXT,
  interesses TEXT,
  dores TEXT,
  busca_solucao TEXT,
  diferenciais TEXT,
  concorrentes_diretos JSONB,
  admira_concorrentes TEXT,
  nao_repetir TEXT,
  lista_produtos TEXT,
  ticket_medio DECIMAL,
  prioridade_atual TEXT,
  objetivos_marketing TEXT[],
  meta_especifica TEXT,
  cores_principais TEXT[],
  logo_url TEXT,
  materiais_existentes TEXT[],
  referencias_visuais TEXT[],
  redes_utilizadas TEXT[],
  canais_preferidos TEXT[],
  tipo_conteudo TEXT[],
  marcas_admiradas TEXT,
  resumo_historia TEXT,
  principais_conquistas TEXT,
  desafios_atuais TEXT,
  oportunidades TEXT,
  informacoes_adicionais TEXT,
  nao_fazer TEXT,
  status TEXT DEFAULT 'em_andamento' CHECK (status IN ('em_andamento', 'concluido')),
  progresso INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de branding da marca
CREATE TABLE public.brandings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome_marca TEXT NOT NULL,
  logo_versoes JSONB,
  paleta_cores TEXT[],
  tipografias JSONB,
  elementos_visuais TEXT[],
  guia_estilo_url TEXT,
  pontos_contato JSONB,
  comunicacao_canais JSONB,
  experiencia_usuario JSONB,
  branding_sensorial JSONB,
  site_otimizado JSONB,
  perfis_sociais JSONB,
  conteudo_estrategico JSONB,
  estrategia_trafego JSONB,
  metricas_kpis JSONB,
  objetivos_curto_prazo TEXT,
  objetivos_medio_prazo TEXT,
  objetivos_longo_prazo TEXT,
  mapeamento_concorrencia JSONB,
  calendario_editorial JSONB,
  estrategia_lancamentos JSONB,
  feedback_clientes JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de posts do calendário
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  titulo TEXT NOT NULL,
  conteudo TEXT,
  redes_sociais TEXT[],
  data_agendamento TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'agendado', 'publicado', 'aprovacao')),
  tipo TEXT DEFAULT 'post' CHECK (tipo IN ('post', 'story', 'reel', 'carrossel')),
  midia_urls TEXT[],
  hashtags TEXT[],
  aprovacao_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de biblioteca de conteúdo
CREATE TABLE public.biblioteca (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome_arquivo TEXT NOT NULL,
  tipo_arquivo TEXT NOT NULL,
  url_arquivo TEXT NOT NULL,
  tags TEXT[],
  descricao TEXT,
  pasta TEXT DEFAULT 'geral',
  tamanho_arquivo BIGINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de interações com Diana (Chat IA)
CREATE TABLE public.diana_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  conversa_id UUID NOT NULL DEFAULT gen_random_uuid(),
  mensagem TEXT NOT NULL,
  resposta TEXT,
  tipo_interacao TEXT DEFAULT 'chat' CHECK (tipo_interacao IN ('chat', 'geracao_post', 'calendario', 'briefing')),
  creditos_usados INTEGER DEFAULT 1,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de tendências e datas comemorativas
CREATE TABLE public.tendencias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_evento DATE,
  categoria TEXT,
  segmento TEXT[],
  relevancia INTEGER DEFAULT 1 CHECK (relevancia BETWEEN 1 AND 5),
  fonte TEXT,
  tipo TEXT DEFAULT 'data_comemorativa' CHECK (tipo IN ('data_comemorativa', 'tendencia_tiktok', 'tendencia_instagram', 'feriado')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de relatórios e estatísticas
CREATE TABLE public.relatorios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tipo_relatorio TEXT NOT NULL,
  periodo_inicio DATE,
  periodo_fim DATE,
  dados JSONB NOT NULL,
  formato TEXT DEFAULT 'json' CHECK (formato IN ('json', 'pdf', 'csv')),
  url_arquivo TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de configurações da conta
CREATE TABLE public.configuracoes_conta (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  configuracoes JSONB NOT NULL DEFAULT '{}',
  tema TEXT DEFAULT 'light' CHECK (tema IN ('light', 'dark')),
  notificacoes JSONB DEFAULT '{"email": true, "push": true}',
  privacidade JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brandings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biblioteca ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diana_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tendencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relatorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes_conta ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para briefings
CREATE POLICY "Users can view their own briefings" ON public.briefings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own briefings" ON public.briefings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own briefings" ON public.briefings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own briefings" ON public.briefings FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para brandings
CREATE POLICY "Users can view their own brandings" ON public.brandings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own brandings" ON public.brandings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own brandings" ON public.brandings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own brandings" ON public.brandings FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para posts
CREATE POLICY "Users can view their own posts" ON public.posts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para biblioteca
CREATE POLICY "Users can view their own library" ON public.biblioteca FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own library items" ON public.biblioteca FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own library items" ON public.biblioteca FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own library items" ON public.biblioteca FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para Diana conversations
CREATE POLICY "Users can view their own conversations" ON public.diana_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own conversations" ON public.diana_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para tendências (public read)
CREATE POLICY "Anyone can view trends" ON public.tendencias FOR SELECT USING (true);

-- Políticas RLS para relatórios
CREATE POLICY "Users can view their own reports" ON public.relatorios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own reports" ON public.relatorios FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reports" ON public.relatorios FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reports" ON public.relatorios FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para configurações da conta
CREATE POLICY "Users can view their own settings" ON public.configuracoes_conta FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own settings" ON public.configuracoes_conta FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.configuracoes_conta FOR UPDATE USING (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_briefings_updated_at BEFORE UPDATE ON public.briefings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_brandings_updated_at BEFORE UPDATE ON public.brandings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_biblioteca_updated_at BEFORE UPDATE ON public.biblioteca FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_configuracoes_conta_updated_at BEFORE UPDATE ON public.configuracoes_conta FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();