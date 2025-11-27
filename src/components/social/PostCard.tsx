import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PostStatusBadge } from './PostStatusBadge';
import { Button } from '@/components/ui/button';
import { Calendar, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SocialPost {
  id: string;
  provider: string;
  status: 'pending' | 'scheduled' | 'publishing' | 'published' | 'failed';
  error_message?: string;
  external_post_id?: string;
  scheduled_at?: string;
  published_at?: string;
  content_text?: string;
  media_url?: string;
}

interface PostCardProps {
  post: {
    id: string;
    titulo: string;
    conteudo?: string;
    midia_urls?: string[];
    data_agendamento?: string;
    created_at: string;
  };
  socialPosts?: SocialPost[];
  onReprocess?: (postId: string) => void;
}

export function PostCard({ post, socialPosts = [], onReprocess }: PostCardProps) {
  const hasFailedPosts = socialPosts.some(sp => sp.status === 'failed');
  const scheduledDate = post.data_agendamento || post.created_at;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-1">{post.titulo}</h3>
            {scheduledDate && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {format(new Date(scheduledDate), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
            )}
          </div>
          {hasFailedPosts && onReprocess && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReprocess(post.id)}
              className="ml-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Reprocessar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {post.conteudo && (
          <p className="text-sm text-muted-foreground line-clamp-3">{post.conteudo}</p>
        )}

        {post.midia_urls && post.midia_urls.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {post.midia_urls.slice(0, 2).map((url, idx) => (
              <div key={idx} className="relative aspect-video rounded-md overflow-hidden bg-muted">
                <img
                  src={url}
                  alt={`Mídia ${idx + 1}`}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {socialPosts.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Status por rede:</p>
            <div className="flex flex-wrap gap-2">
              {socialPosts.map((sp) => (
                <PostStatusBadge
                  key={sp.id}
                  provider={sp.provider}
                  status={sp.status}
                  errorMessage={sp.error_message}
                  externalPostId={sp.external_post_id}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
