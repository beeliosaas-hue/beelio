import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Target {
  provider: string;
  target_id: string;
  target_name: string;
  target_type: string;
}

interface SocialAccount {
  provider: string;
  account_name: string;
  needs_reconnect: boolean;
}

export default function NovoPost() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingTargets, setLoadingTargets] = useState(true);
  const [contentText, setContentText] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [scheduledTime, setScheduledTime] = useState('12:00');
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);

  useEffect(() => {
    loadTargets();
  }, []);

  const loadTargets = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `https://ygmharbfawtkwwcflzui.supabase.co/functions/v1/social-targets`,
        {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`
          }
        }
      );

      if (!response.ok) throw new Error('Erro ao carregar destinos');

      const data = await response.json();
      setAccounts(data.accounts || []);
      setTargets(data.targets || []);
    } catch (error) {
      console.error('Erro ao carregar destinos:', error);
      toast.error('Erro ao carregar destinos das redes sociais');
    } finally {
      setLoadingTargets(false);
    }
  };

  const handleSchedule = async (mode: 'schedule' | 'publish_now' = 'schedule') => {
    if (!contentText.trim()) {
      toast.error('Digite o conteúdo do post');
      return;
    }

    if (selectedTargets.length === 0) {
      toast.error('Selecione ao menos um destino');
      return;
    }

    if (!scheduledDate && mode === 'schedule') {
      toast.error('Selecione a data de publicação');
      return;
    }

    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user!.id,
          titulo: contentText.substring(0, 50),
          conteudo: contentText,
          midia_urls: mediaUrls,
          status: 'agendado'
        })
        .select()
        .single();

      if (postError) throw postError;

      const [hours, minutes] = scheduledTime.split(':');
      const scheduledAt = scheduledDate ? new Date(scheduledDate) : new Date();
      scheduledAt.setHours(parseInt(hours), parseInt(minutes));

      const targetsData = selectedTargets.map(targetId => {
        const target = targets.find(t => t.target_id === targetId);
        return {
          provider: target!.provider,
          targetId: target!.target_id,
          accountId: target!.target_id
        };
      });

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
            postId: post.id,
            userId: user!.id,
            targets: targetsData,
            scheduledAt: scheduledAt.toISOString(),
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
              onClick: () => navigate('/integracoes')
            }
          });
          return;
        }
        throw new Error(result.error || 'Erro ao agendar post');
      }

      const successMsg = mode === 'publish_now' 
        ? `Post publicado em ${result.socialPosts?.length || 0} rede(s)!`
        : `Post agendado para ${result.socialPosts?.length || 0} rede(s)!`;
      
      toast.success(successMsg, {
        description: 'Você será redirecionado para o calendário',
        duration: 2000
      });

      setTimeout(() => navigate('/calendario'), 2000);
    } catch (error) {
      console.error('Erro ao agendar:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao processar post');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishNow = async () => {
    const now = new Date();
    setScheduledDate(now);
    setScheduledTime(format(now, 'HH:mm'));
    await handleSchedule('publish_now');
  };

  const toggleTarget = (targetId: string) => {
    setSelectedTargets(prev =>
      prev.includes(targetId)
        ? prev.filter(id => id !== targetId)
        : [...prev, targetId]
    );
  };

  const groupedTargets = targets.reduce((acc, target) => {
    if (!acc[target.provider]) {
      acc[target.provider] = [];
    }
    acc[target.provider].push(target);
    return acc;
  }, {} as Record<string, Target[]>);

  const hasNeedsReconnect = selectedTargets.some(targetId => {
    const target = targets.find(t => t.target_id === targetId);
    const account = accounts.find(a => a.provider === target?.provider);
    return account?.needs_reconnect;
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Novo Post</h1>
          <p className="text-muted-foreground">
            Crie e agende publicações para suas redes sociais
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Conteúdo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="content">Texto do Post</Label>
                <Textarea
                  id="content"
                  placeholder="Escreva o conteúdo do seu post..."
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  rows={6}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="media">Mídia (URLs separadas por vírgula)</Label>
                <Input
                  id="media"
                  placeholder="https://exemplo.com/imagem.jpg, ..."
                  value={mediaUrls.join(', ')}
                  onChange={(e) => setMediaUrls(e.target.value.split(',').map(u => u.trim()))}
                  className="mt-2"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Data de Publicação</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start mt-2">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduledDate ? format(scheduledDate, 'dd/MM/yyyy') : 'Selecionar data'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={scheduledDate}
                        onSelect={setScheduledDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              {hasNeedsReconnect && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Algumas contas selecionadas precisam ser reconectadas. Vá até Integrações para atualizar.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSchedule('schedule')} 
                  disabled={loading || hasNeedsReconnect}
                  className="flex-1"
                >
                  {loading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
                  {loading ? 'Agendando...' : 'Agendar Post'}
                </Button>
                <Button 
                  onClick={handlePublishNow} 
                  disabled={loading || hasNeedsReconnect}
                  variant="outline"
                  className="flex-1"
                >
                  {loading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
                  Publicar Agora
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Destinos</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingTargets ? (
                <p className="text-sm text-muted-foreground">Carregando...</p>
              ) : targets.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    Nenhum destino encontrado. Conecte suas contas em <a href="/integracoes" className="underline">Integrações</a>.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupedTargets).map(([provider, providerTargets]) => (
                    <div key={provider}>
                      <h4 className="font-semibold mb-2 capitalize">{provider}</h4>
                      <div className="space-y-2">
                        {providerTargets.map(target => (
                          <div key={target.target_id} className="flex items-center gap-2">
                            <Checkbox
                              id={target.target_id}
                              checked={selectedTargets.includes(target.target_id)}
                              onCheckedChange={() => toggleTarget(target.target_id)}
                            />
                            <label
                              htmlFor={target.target_id}
                              className="text-sm cursor-pointer flex-1"
                            >
                              {target.target_name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
