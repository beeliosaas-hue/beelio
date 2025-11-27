import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SocialPost {
  id: string;
  post_id: string;
  user_id: string;
  provider: string;
  account_id: string | null;
  target_id: string | null;
  status: string;
  scheduled_at: string | null;
  published_at: string | null;
  external_post_id: string | null;
  error_message: string | null;
  content_text: string | null;
  media_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useSocialPosts(postId?: string) {
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      let query = supabase
        .from('social_posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (postId) {
        query = query.eq('post_id', postId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setSocialPosts(data || []);
    } catch (err) {
      console.error('Erro ao buscar social_posts:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [postId]);

  const refresh = () => {
    fetchPosts();
  };

  return {
    socialPosts,
    isLoading,
    error,
    refresh
  };
}
