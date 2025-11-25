-- Criar tabela social_posts para registrar publicações por rede/alvo
CREATE TABLE IF NOT EXISTS public.social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  provider TEXT NOT NULL,
  account_id TEXT,
  target_id TEXT,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'publishing', 'published', 'failed')),
  
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  
  external_post_id TEXT,
  error_message TEXT,
  
  media_url TEXT,
  content_text TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Trigger para atualizar updated_at
CREATE TRIGGER set_social_posts_updated_at
  BEFORE UPDATE ON public.social_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- RLS policies
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own social posts"
  ON public.social_posts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own social posts"
  ON public.social_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own social posts"
  ON public.social_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own social posts"
  ON public.social_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Criar índices para performance
CREATE INDEX idx_social_posts_user_id ON public.social_posts(user_id);
CREATE INDEX idx_social_posts_post_id ON public.social_posts(post_id);
CREATE INDEX idx_social_posts_status ON public.social_posts(status);
CREATE INDEX idx_social_posts_scheduled_at ON public.social_posts(scheduled_at);