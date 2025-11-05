-- Criar tabelas para integração com redes sociais

-- Tabela de contas sociais conectadas
CREATE TABLE IF NOT EXISTS public.social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('facebook', 'instagram', 'linkedin', 'tiktok', 'youtube')),
  account_id TEXT NOT NULL,
  account_name TEXT,
  avatar_url TEXT,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  scopes TEXT[],
  needs_reconnect BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, provider, account_id)
);

ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own social accounts"
  ON public.social_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own social accounts"
  ON public.social_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own social accounts"
  ON public.social_accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own social accounts"
  ON public.social_accounts FOR DELETE
  USING (auth.uid() = user_id);

-- Tabela de destinos/páginas/canais das contas
CREATE TABLE IF NOT EXISTS public.social_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('facebook', 'instagram', 'linkedin', 'tiktok', 'youtube')),
  account_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  target_type TEXT,
  target_name TEXT,
  extra JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, provider, target_id)
);

ALTER TABLE public.social_targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own social targets"
  ON public.social_targets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own social targets"
  ON public.social_targets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own social targets"
  ON public.social_targets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own social targets"
  ON public.social_targets FOR DELETE
  USING (auth.uid() = user_id);

-- Tabela de posts agendados
CREATE TABLE IF NOT EXISTS public.scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  content_text TEXT,
  media_urls TEXT[],
  scheduled_at TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  status TEXT CHECK (status IN ('draft', 'scheduled', 'published', 'error')) DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own scheduled posts"
  ON public.scheduled_posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scheduled posts"
  ON public.scheduled_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled posts"
  ON public.scheduled_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled posts"
  ON public.scheduled_posts FOR DELETE
  USING (auth.uid() = user_id);

-- Tabela de jobs de publicação
CREATE TABLE IF NOT EXISTS public.publish_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_post_id UUID NOT NULL REFERENCES public.scheduled_posts(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('facebook', 'instagram', 'linkedin', 'tiktok', 'youtube')),
  target_id TEXT NOT NULL,
  status TEXT CHECK (status IN ('queued', 'publishing', 'published', 'error')) DEFAULT 'queued',
  attempt INTEGER DEFAULT 0,
  retry_after TIMESTAMPTZ,
  error_message TEXT,
  external_post_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.publish_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view jobs for their posts"
  ON public.publish_jobs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.scheduled_posts
      WHERE scheduled_posts.id = publish_jobs.scheduled_post_id
        AND scheduled_posts.user_id = auth.uid()
    )
  );