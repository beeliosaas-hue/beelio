import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSocialSchedule } from './useSocialSchedule';

interface Target {
  provider: string;
  targetId: string;
  accountId: string;
}

interface CreatePostParams {
  caption: string;
  mediaUrl?: string;
  targets: Target[];
  scheduledAt?: string;
  mode: 'schedule' | 'publish_now';
}

export function useCreatePost() {
  const [isLoading, setIsLoading] = useState(false);
  const { schedulePost } = useSocialSchedule();

  const execute = async ({ caption, mediaUrl, targets, scheduledAt, mode }: CreatePostParams) => {
    if (!caption.trim()) {
      toast.error('Digite o conteúdo do post');
      return null;
    }

    if (targets.length === 0) {
      toast.error('Selecione ao menos um destino');
      return null;
    }

    if (!scheduledAt && mode === 'schedule') {
      toast.error('Selecione a data de publicação');
      return null;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Criar o post na tabela posts
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          titulo: caption.substring(0, 50),
          conteudo: caption,
          midia_urls: mediaUrl ? [mediaUrl] : [],
          status: mode === 'publish_now' ? 'publicado' : 'agendado',
          data_agendamento: scheduledAt || new Date().toISOString()
        })
        .select()
        .single();

      if (postError) throw postError;

      // Agendar/publicar via social-schedule
      const result = await schedulePost({
        postId: post.id,
        targets,
        scheduledAt,
        mode
      });

      if (!result) {
        throw new Error('Falha ao agendar post');
      }

      return { post, result };
    } catch (error) {
      console.error('Erro ao criar post:', error);
      
      // Tratamento de erros HTTP específicos
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          toast.error('Acesso não autorizado. Verifique as chaves.');
        } else if (error.message.includes('500')) {
          toast.error('Erro interno. Tente novamente.');
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          toast.error('Falha de conexão. Verifique sua internet.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('Erro ao criar post');
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, execute };
}
