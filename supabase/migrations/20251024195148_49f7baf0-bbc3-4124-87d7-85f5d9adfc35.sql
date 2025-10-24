-- Garantir que TODOS os usuários atuais sejam PRO (para testes)
-- E criar uma função para facilitar upgrade futuro

-- Atualizar todos os profiles existentes para PRO
UPDATE profiles 
SET plan_type = 'pro', 
    updated_at = now()
WHERE plan_type != 'pro';

-- Criar função helper para upgrade de plano
CREATE OR REPLACE FUNCTION public.upgrade_user_to_pro(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles 
  SET plan_type = 'pro', 
      updated_at = now()
  WHERE user_id = target_user_id;
  
  RAISE NOTICE 'Usuário % atualizado para plano PRO', target_user_id;
END;
$$;

-- Criar função para obter informações do plano
CREATE OR REPLACE FUNCTION public.get_user_plan_info(target_user_id uuid)
RETURNS TABLE (
  user_id uuid,
  email text,
  plan_type text,
  is_pro boolean,
  has_unlimited_credits boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.user_id,
    p.email,
    p.plan_type,
    (p.plan_type = 'pro') as is_pro,
    (p.plan_type = 'pro') as has_unlimited_credits
  FROM profiles p
  WHERE p.user_id = target_user_id;
END;
$$;