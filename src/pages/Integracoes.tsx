import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Linkedin, Facebook, Instagram, Youtube } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SocialAccount {
  id: string;
  provider: string;
  account_name: string;
  avatar_url: string;
  needs_reconnect: boolean;
}

const providerConfig = {
  linkedin: {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'bg-blue-600',
    scopes: 'w_organization_social, r_organization_social',
    description: 'Publique em páginas e perfis corporativos'
  },
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-500',
    scopes: 'pages_show_list, pages_manage_posts, pages_read_engagement',
    description: 'Publique em páginas do Facebook'
  },
  instagram: {
    name: 'Instagram',
    icon: Instagram,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    scopes: 'instagram_basic, instagram_content_publish',
    description: 'Publique em contas business do Instagram'
  },
  youtube: {
    name: 'YouTube',
    icon: Youtube,
    color: 'bg-red-600',
    scopes: 'youtube.upload',
    description: 'Publique vídeos no YouTube'
  },
  tiktok: {
    name: 'TikTok',
    icon: () => <div className="text-2xl">🎵</div>,
    color: 'bg-black',
    scopes: 'Em breve',
    description: 'Em breve - Integração TikTok Business'
  }
};

export default function Integracoes() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
    
    // Verificar se voltou do OAuth
    const params = new URLSearchParams(window.location.search);
    if (params.get('connected') === 'meta') {
      toast.success('Conta conectada com sucesso!');
      window.history.replaceState({}, '', '/integracoes');
      loadAccounts();
    } else if (params.get('error')) {
      toast.error('Erro ao conectar conta: ' + params.get('error'));
      window.history.replaceState({}, '', '/integracoes');
    }
  }, []);

  const loadAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .select('*');

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
      toast.error('Erro ao carregar contas conectadas');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (provider: string) => {
    if (provider === 'tiktok') {
      toast.info('Integração TikTok em breve!');
      return;
    }

    try {
      // Para Facebook e Instagram, usar oauth-meta-start
      if (provider === 'facebook' || provider === 'instagram') {
        const { data: { session } } = await supabase.auth.getSession();
        const response = await fetch(
          `https://ygmharbfawtkwwcflzui.supabase.co/functions/v1/oauth-meta-start`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session?.access_token}`
            },
            body: JSON.stringify({ provider })
          }
        );

        if (!response.ok) throw new Error('Erro ao iniciar OAuth');

        const { authUrl } = await response.json();
        window.location.href = authUrl;
      } else {
        // Para outros providers (LinkedIn, YouTube, etc.)
        const redirectUrl = `${window.location.origin}/integracoes`;
        window.location.href = `https://ygmharbfawtkwwcflzui.supabase.co/functions/v1/oauth/${provider}/callback?redirect_uri=${encodeURIComponent(redirectUrl)}`;
      }
    } catch (error) {
      console.error('Erro ao conectar:', error);
      toast.error('Erro ao iniciar conexão');
    }
  };

  const handleDisconnect = async (provider: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `https://ygmharbfawtkwwcflzui.supabase.co/functions/v1/social-disconnect`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({ provider })
        }
      );

      if (!response.ok) throw new Error('Erro ao desconectar');

      toast.success('Conta desconectada');
      loadAccounts();
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      toast.error('Erro ao desconectar conta');
    }
  };

  const getAccountForProvider = (provider: string) => {
    return accounts.find(a => a.provider === provider);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Integrações com Redes Sociais</h1>
          <p className="text-muted-foreground">
            Conecte suas contas para publicar conteúdo diretamente das suas redes sociais
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(providerConfig).map(([provider, config]) => {
            const account = getAccountForProvider(provider);
            const Icon = config.icon as any;
            const isConnected = !!account;
            const needsReconnect = account?.needs_reconnect;

            return (
              <Card key={provider} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${config.color} text-white`}>
                        {provider === 'tiktok' ? <Icon /> : <Icon className="h-6 w-6" />}
                      </div>
                      <div>
                        <CardTitle>{config.name}</CardTitle>
                        {isConnected && (
                          <Badge variant={needsReconnect ? 'destructive' : 'default'} className="mt-1">
                            {needsReconnect ? 'Expirado' : 'Conectado'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-2">
                    {config.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {needsReconnect && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        Sua conexão expirou. Reconecte para continuar publicando.
                      </AlertDescription>
                    </Alert>
                  )}

                  {isConnected && account && !needsReconnect && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {account.avatar_url && (
                        <img 
                          src={account.avatar_url} 
                          alt={account.account_name}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span>{account.account_name}</span>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    <strong>Permissões:</strong> {config.scopes}
                  </div>

                  <div className="flex gap-2">
                    {!isConnected || needsReconnect ? (
                      <Button 
                        onClick={() => handleConnect(provider)}
                        className="w-full"
                        disabled={provider === 'tiktok'}
                      >
                        {needsReconnect ? 'Reconectar' : 'Conectar'}
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" className="flex-1" disabled>
                          Gerenciar
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="flex-1"
                          onClick={() => handleDisconnect(provider)}
                        >
                          Desconectar
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Alert>
          <AlertDescription>
            <strong>Nota de segurança:</strong> Seus tokens de acesso são armazenados de forma segura no Supabase e nunca são expostos no front-end. Todas as operações de autenticação são realizadas no servidor.
          </AlertDescription>
        </Alert>
      </div>
    </DashboardLayout>
  );
}
