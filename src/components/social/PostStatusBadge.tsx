import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, CheckCircle, Clock, Loader, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostStatusBadgeProps {
  provider: string;
  status: 'pending' | 'scheduled' | 'publishing' | 'published' | 'failed';
  errorMessage?: string;
  externalPostId?: string;
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: 'Pendente',
    variant: 'secondary' as const,
    color: 'text-muted-foreground'
  },
  scheduled: {
    icon: Clock,
    label: 'Agendado',
    variant: 'default' as const,
    color: 'text-blue-600'
  },
  publishing: {
    icon: Loader,
    label: 'Publicando',
    variant: 'secondary' as const,
    color: 'text-yellow-600'
  },
  published: {
    icon: CheckCircle,
    label: 'Publicado',
    variant: 'default' as const,
    color: 'text-green-600'
  },
  failed: {
    icon: XCircle,
    label: 'Falhou',
    variant: 'destructive' as const,
    color: 'text-red-600'
  }
};

const providerNames: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  tiktok: 'TikTok'
};

export function PostStatusBadge({ provider, status, errorMessage, externalPostId }: PostStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const providerName = providerNames[provider] || provider;

  const badge = (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className={cn('h-3 w-3', status === 'publishing' && 'animate-spin')} />
      <span>{providerName}</span>
    </Badge>
  );

  if (status === 'failed' && errorMessage) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-1">
              <p className="font-semibold">Erro ao publicar</p>
              <p className="text-xs">{errorMessage}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (status === 'published' && externalPostId) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">ID: {externalPostId}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}
