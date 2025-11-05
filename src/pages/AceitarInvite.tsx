import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Users } from 'lucide-react';

export default function AceitarInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [needsAccount, setNeedsAccount] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Token de convite inválido');
      navigate('/');
    } else {
      checkExistingUser();
    }
  }, [token]);

  const checkExistingUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setNeedsAccount(!user);
  };

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (needsAccount && password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('accept-invite', {
        body: {
          token,
          name: needsAccount ? name : undefined,
          password: needsAccount ? password : undefined,
        },
      });

      if (error) throw error;

      toast.success('Convite aceito com sucesso!');
      
      if (needsAccount) {
        // Log in the new user
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password,
        });
        
        if (signInError) throw signInError;
      }

      navigate('/');
    } catch (error: any) {
      console.error('Error accepting invite:', error);
      toast.error(error.message || 'Erro ao aceitar convite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Users className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Aceitar Convite</CardTitle>
          <CardDescription>
            {needsAccount 
              ? 'Complete seu cadastro para entrar na equipe'
              : 'Confirme para entrar na equipe'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAccept} className="space-y-4">
            {needsAccount && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crie uma senha"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua senha"
                    required
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Aceitando...' : 'Aceitar Convite'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}