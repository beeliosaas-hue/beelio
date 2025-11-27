import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PostStatusBadge } from './PostStatusBadge';
import { useSocialSchedule } from '@/hooks/useSocialSchedule';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SocialPostsListProps {
  postId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function SocialPostsList({ postId, autoRefresh = false, refreshInterval = 5000 }: SocialPostsListProps) {
  const { socialPosts, fetchSocialPosts, loading } = useSocialSchedule();

  useEffect(() => {
    fetchSocialPosts(postId);

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchSocialPosts(postId);
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [postId, autoRefresh, refreshInterval]);

  if (loading && socialPosts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Status de Publicação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (socialPosts.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Este post ainda não foi agendado para nenhuma rede social.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Status de Publicação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {socialPosts.map((sp) => (
            <PostStatusBadge
              key={sp.id}
              provider={sp.provider}
              status={sp.status as any}
              errorMessage={sp.error_message}
              externalPostId={sp.external_post_id}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
