import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Download, Edit3, Save, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface BrandingData {
  id?: string;
  nome_marca: string;
  logo_versoes?: any;
  paleta_cores?: string[];
  tipografias?: any;
  elementos_visuais?: string[];
  objetivos_curto_prazo?: string;
  objetivos_medio_prazo?: string;
  objetivos_longo_prazo?: string;
}

export default function Branding() {
  const [brandings, setBrandings] = useState<BrandingData[]>([]);
  const [currentBranding, setCurrentBranding] = useState<BrandingData>({
    nome_marca: '',
    paleta_cores: ['#FFB800', '#1A1A1A', '#FFFFFF'],
    elementos_visuais: [],
    objetivos_curto_prazo: '',
    objetivos_medio_prazo: '',
    objetivos_longo_prazo: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBrandings();
  }, []);

  const loadBrandings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('brandings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setBrandings(data);
        setCurrentBranding(data[0]);
      }
    } catch (error: any) {
      console.error('Erro ao carregar brandings:', error);
      toast.error('Erro ao carregar brandings');
    } finally {
      setLoading(false);
    }
  };

  const saveBranding = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Você precisa estar logado');
        return;
      }

      const brandingData = {
        ...currentBranding,
        user_id: user.id
      };

      if (currentBranding.id) {
        const { error } = await supabase
          .from('brandings')
          .update(brandingData)
          .eq('id', currentBranding.id);

        if (error) throw error;
        toast.success('Branding atualizado com sucesso!');
      } else {
        const { data, error } = await supabase
          .from('brandings')
          .insert([brandingData])
          .select()
          .single();

        if (error) throw error;
        setCurrentBranding({ ...currentBranding, id: data.id });
        toast.success('Branding criado com sucesso!');
      }

      setIsEditing(false);
      loadBrandings();
    } catch (error: any) {
      console.error('Erro ao salvar branding:', error);
      toast.error('Erro ao salvar branding');
    } finally {
      setLoading(false);
    }
  };

  const deleteBranding = async (id: string) => {
    try {
      const { error } = await supabase
        .from('brandings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Branding excluído com sucesso!');
      loadBrandings();
    } catch (error: any) {
      console.error('Erro ao excluir branding:', error);
      toast.error('Erro ao excluir branding');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Branding</h1>
            <p className="text-muted-foreground mt-2">
              Defina a identidade visual e estratégica da sua marca
            </p>
          </div>
          <Button onClick={() => {
            setCurrentBranding({
              nome_marca: '',
              paleta_cores: ['#FFB800'],
              elementos_visuais: []
            });
            setIsEditing(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Branding
          </Button>
        </div>

        {brandings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Seus Brandings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {brandings.map((branding) => (
                  <div
                    key={branding.id}
                    className={`p-4 border rounded-lg cursor-pointer ${
                      currentBranding.id === branding.id ? 'border-primary' : 'border-border'
                    }`}
                    onClick={() => setCurrentBranding(branding)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{branding.nome_marca}</h3>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                          }}
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (branding.id) deleteBranding(branding.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {(currentBranding.nome_marca || isEditing) && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{isEditing ? 'Editando Branding' : currentBranding.nome_marca}</CardTitle>
                  <CardDescription>Configure a identidade da sua marca</CardDescription>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={saveBranding} disabled={loading}>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Nome da Marca</Label>
                  <Input
                    value={currentBranding.nome_marca}
                    onChange={(e) => setCurrentBranding({ ...currentBranding, nome_marca: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Digite o nome da sua marca"
                  />
                </div>

                <div>
                  <Label>Objetivos de Curto Prazo</Label>
                  <Textarea
                    value={currentBranding.objetivos_curto_prazo || ''}
                    onChange={(e) => setCurrentBranding({ ...currentBranding, objetivos_curto_prazo: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Objetivos para os próximos 3 meses"
                  />
                </div>

                <div>
                  <Label>Objetivos de Médio Prazo</Label>
                  <Textarea
                    value={currentBranding.objetivos_medio_prazo || ''}
                    onChange={(e) => setCurrentBranding({ ...currentBranding, objetivos_medio_prazo: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Objetivos para os próximos 6-12 meses"
                  />
                </div>

                <div>
                  <Label>Objetivos de Longo Prazo</Label>
                  <Textarea
                    value={currentBranding.objetivos_longo_prazo || ''}
                    onChange={(e) => setCurrentBranding({ ...currentBranding, objetivos_longo_prazo: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Objetivos para os próximos 1-3 anos"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
