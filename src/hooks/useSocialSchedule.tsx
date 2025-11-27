import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Target {
  provider: string;
  targetId: string;
  accountId: string;
}

interface SchedulePostParams {
  postId: string;
  targets: Target[];
  scheduledAt?: string;
  mode: 'schedule' | 'publish_now';
}

interface SocialPostStatus {
  id: string;
  provider: string;
  status: string;
  error_message?: string;
  external_post_id?: string;
}

export function useSocialSchedule() {
  const [loading, setLoading] = useState(false);
  const [socialPosts, setSocialPosts] = useState<SocialPostStatus[]>([]);

  const schedulePost = async ({ postId, targets, scheduledAt, mode }: SchedulePostParams) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `https://ygmharbfawtkwwcflzui.supabase.co/functions/v1/social-schedule`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({
            postId,
            userId: user.id,
            targets,
            scheduledAt: scheduledAt || new Date().toISOString(),
            mode
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (result.error === 'needs_reconnect') {
          toast.error(`Reconecte suas contas: ${result.providers.join(', ')}`, {
            action: {
              label: 'Ir para Integrações',
              onClick: () => window.location.href = '/integracoes'
            }
          });
          return null;
        }
        throw new Error(result.error || 'Erro ao processar post');
      }

      const created = result.socialPosts || [];
      setSocialPosts(created);

      const successMessage = mode === 'publish_now' 
        ? `Post publicado em ${created.length} rede${created.length > 1 ? 's' : ''}!`
        : `Post agendado para ${created.length} rede${created.length > 1 ? 's' : ''}!`;

      toast.success(successMessage);
      return result;
    } catch (error) {
      console.error('Erro ao agendar:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao processar post');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchSocialPosts = async (postId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('social_posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (postId) {
        query = query.eq('post_id', postId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSocialPosts(data || []);
      return data;
    } catch (error) {
      console.error('Erro ao buscar social_posts:', error);
      return null;
    }
  };

  return {
    loading,
    socialPosts,
    schedulePost,
    fetchSocialPosts
  };
}
