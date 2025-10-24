-- Atualizar o usuário atual para Plano PRO (para testes)
-- Nota: Este script vai atualizar o primeiro usuário encontrado
-- Em produção, você deve especificar o user_id correto

DO $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Pegar o primeiro usuário (para testes)
  SELECT user_id INTO current_user_id FROM profiles LIMIT 1;
  
  IF current_user_id IS NOT NULL THEN
    -- Atualizar para plano PRO
    UPDATE profiles 
    SET plan_type = 'pro', 
        updated_at = now()
    WHERE user_id = current_user_id;
    
    RAISE NOTICE 'Usuário % atualizado para plano PRO', current_user_id;
  ELSE
    RAISE NOTICE 'Nenhum usuário encontrado. Faça login primeiro.';
  END IF;
END $$;