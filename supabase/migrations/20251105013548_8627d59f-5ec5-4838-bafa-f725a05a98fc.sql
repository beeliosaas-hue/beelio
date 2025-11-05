-- Create workspaces table
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'Meu Workspace',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workspace"
  ON public.workspaces FOR SELECT
  USING (auth.uid() = owner);

CREATE POLICY "Users can update their own workspace"
  ON public.workspaces FOR UPDATE
  USING (auth.uid() = owner);

CREATE POLICY "Users can create their own workspace"
  ON public.workspaces FOR INSERT
  WITH CHECK (auth.uid() = owner);

-- Add workspace_id to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES public.workspaces(id);

-- Create invite_tokens table
CREATE TABLE IF NOT EXISTS public.invite_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.invite_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace owners can manage invite tokens"
  ON public.invite_tokens FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.workspaces w
    WHERE w.id = invite_tokens.workspace_id AND w.owner = auth.uid()
  ));

-- Update subscriptions table
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES public.workspaces(id);
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_check;
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_plan_check CHECK (plan IN ('free', 'starter', 'pro'));

-- Update membros_equipes (team_members) to link to workspace
ALTER TABLE public.membros_equipes ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES public.workspaces(id);

-- Update aprovacoes (approvals) to link to workspace
ALTER TABLE public.aprovacoes ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES public.workspaces(id);
ALTER TABLE public.aprovacoes ADD COLUMN IF NOT EXISTS item_type TEXT;
ALTER TABLE public.aprovacoes ADD COLUMN IF NOT EXISTS due_date DATE;
ALTER TABLE public.aprovacoes ADD COLUMN IF NOT EXISTS comments JSONB DEFAULT '[]'::jsonb;

-- Function to auto-create workspace on user creation
CREATE OR REPLACE FUNCTION public.auto_create_workspace()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_workspace_id UUID;
BEGIN
  -- Create workspace for new user
  INSERT INTO public.workspaces (owner, name)
  VALUES (NEW.user_id, 'Meu Workspace')
  RETURNING id INTO new_workspace_id;
  
  -- Update profile with workspace_id
  UPDATE public.profiles
  SET workspace_id = new_workspace_id
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-create workspace
DROP TRIGGER IF EXISTS on_profile_created_create_workspace ON public.profiles;
CREATE TRIGGER on_profile_created_create_workspace
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_workspace();

-- Function to check if user has pro plan
CREATE OR REPLACE FUNCTION public.user_has_pro_plan(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions s
    WHERE s.user_id = target_user_id 
      AND s.plan = 'pro'
      AND s.status IN ('active', 'trialing')
  ) OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = target_user_id 
      AND p.plan_type = 'pro'
  );
$$;