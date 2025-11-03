import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Trash2, Users, Mail, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TeamMember {
  id: string;
  nome_membro: string;
  email_membro: string;
  funcao: string;
  ativo: boolean;
  convite_aceito: boolean;
  created_at: string;
}

interface Team {
  id: string;
  nome_equipe: string;
  usuario_principal_id: string;
}

export function TeamManagement() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingMember, setAddingMember] = useState(false);
  
  const [newMember, setNewMember] = useState({
    nome: '',
    email: '',
    funcao: 'visualizador'
  });

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Carregar ou criar equipe
      let { data: teamData, error: teamError } = await supabase
        .from('equipes')
        .select('*')
        .eq('usuario_principal_id', user.id)
        .single();

      if (teamError && teamError.code === 'PGRST116') {
        // Criar equipe se não existir
        const { data: newTeam, error: createError } = await supabase
          .from('equipes')
          .insert({
            usuario_principal_id: user.id,
            nome_equipe: 'Minha Equipe'
          })
          .select()
          .single();

        if (createError) throw createError;
        teamData = newTeam;
      } else if (teamError) {
        throw teamError;
      }

      setTeam(teamData);

      // Carregar membros
      if (teamData) {
        const { data: membersData, error: membersError } = await supabase
          .from('membros_equipes')
          .select('*')
          .eq('equipe_id', teamData.id)
          .order('created_at', { ascending: false });

        if (membersError) throw membersError;
        setMembers(membersData || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados da equipe:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados da equipe',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!team) return;
    
    if (!newMember.nome || !newMember.email) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos',
        variant: 'destructive'
      });
      return;
    }

    setAddingMember(true);
    try {
      const { error } = await supabase
        .from('membros_equipes')
        .insert([{
          equipe_id: team.id,
          nome_membro: newMember.nome,
          email_membro: newMember.email,
          funcao: newMember.funcao as 'visualizador' | 'editor' | 'administrador'
        }]);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Membro adicionado com sucesso',
      });

      setNewMember({ nome: '', email: '', funcao: 'visualizador' });
      loadTeamData();
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o membro',
        variant: 'destructive'
      });
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('membros_equipes')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Membro removido com sucesso',
      });

      loadTeamData();
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o membro',
        variant: 'destructive'
      });
    }
  };

  const getFuncaoLabel = (funcao: string) => {
    const labels: Record<string, string> = {
      administrador: 'Administrador',
      editor: 'Editor',
      visualizador: 'Visualizador'
    };
    return labels[funcao] || funcao;
  };

  const getFuncaoColor = (funcao: string) => {
    switch (funcao) {
      case 'administrador':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'editor':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'visualizador':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Carregando equipe...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Adicionar Membro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Adicionar Membro
          </CardTitle>
          <CardDescription>
            Convide membros para colaborar na sua equipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  placeholder="Nome do membro"
                  value={newMember.nome}
                  onChange={(e) => setNewMember({ ...newMember, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="funcao">Função</Label>
                <Select
                  value={newMember.funcao}
                  onValueChange={(value) => setNewMember({ ...newMember, funcao: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visualizador">Visualizador</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="administrador">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={handleAddMember}
              disabled={addingMember}
              className="w-full md:w-auto"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {addingMember ? 'Adicionando...' : 'Adicionar Membro'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Membros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Membros da Equipe ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum membro na equipe ainda. Adicione o primeiro!
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{member.nome_membro}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {member.email_membro}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getFuncaoColor(member.funcao)}>
                      {getFuncaoLabel(member.funcao)}
                    </Badge>
                    {member.convite_aceito ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                        Pendente
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}