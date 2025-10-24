import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BriefingCard } from "@/components/briefing/BriefingCard";
import { BriefingForm } from "@/components/briefing/BriefingForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Briefing {
  id: string;
  nome_marca: string;
  created_at: string;
  status: 'completed' | 'em_andamento';
  progresso: number;
}

const Briefing = () => {
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [editingBriefing, setEditingBriefing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBriefings();
  }, []);

  const loadBriefings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('briefings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedBriefings = (data || []).map((b: any) => ({
        id: b.id,
        nome_marca: b.nome_marca,
        created_at: b.created_at,
        status: (b.status === 'completed' ? 'completed' : 'em_andamento') as 'completed' | 'em_andamento',
        progresso: b.progresso || 0
      }));
      
      setBriefings(mappedBriefings);
    } catch (error: any) {
      console.error('Erro ao carregar briefings:', error);
      toast.error('Erro ao carregar briefings');
    } finally {
      setLoading(false);
    }
  };

  const handleNewBriefing = () => {
    setEditingBriefing(null);
    setCurrentView('form');
  };

  const handleEditBriefing = (id: string) => {
    setEditingBriefing(id);
    setCurrentView('form');
  };

  const handleViewBriefing = (id: string) => {
    const briefing = briefings.find(b => b.id === id);
    toast.success(`Visualizando briefing: ${briefing?.nome_marca}`);
  };

  const handleDeleteBriefing = async (id: string) => {
    try {
      const { error } = await supabase
        .from('briefings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Briefing excluído com sucesso');
      loadBriefings();
    } catch (error: any) {
      console.error('Erro ao excluir briefing:', error);
      toast.error('Erro ao excluir briefing');
    }
  };

  const handleDownloadBriefing = (id: string) => {
    const briefing = briefings.find(b => b.id === id);
    toast.success(`Download iniciado: ${briefing?.nome_marca}.pdf`);
  };

  const handleSaveBriefing = async (data: any) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Você precisa estar logado');
        return;
      }

      const briefingData = {
        user_id: user.id,
        nome_marca: data.brandName || 'Novo Briefing',
        site: data.website,
        redes_sociais: data.socialMedia ? [data.socialMedia] : [],
        segmento_atuacao: data.segment,
        localizacao: data.location,
        missao: data.mission,
        visao: data.vision,
        valores: data.values,
        personalidade: data.personality ? [data.personality] : [],
        tom_voz: data.toneOfVoice,
        cliente_ideal: data.targetClient,
        faixa_etaria: data.ageRange,
        localizacao_publico: data.targetLocation,
        nivel_socioeconomico: data.socioeconomic,
        interesses: data.interests,
        dores: data.painPoints,
        busca_solucao: data.solutionSeeking,
        diferenciais: data.differentials,
        concorrentes_diretos: data.competitors ? { list: data.competitors } : null,
        admira_concorrentes: data.admiredFeatures,
        nao_repetir: data.avoidFeatures,
        lista_produtos: data.products,
        ticket_medio: data.averageTicket,
        prioridade_atual: data.currentPriority,
        objetivos_marketing: data.objectives || [],
        meta_especifica: data.specificGoal,
        cores_principais: data.brandColors || [],
        logo_url: data.logoUrl,
        materiais_existentes: data.existingMaterials ? [data.existingMaterials] : [],
        referencias_visuais: data.visualReferences || [],
        redes_utilizadas: data.currentSocialMedia ? [data.currentSocialMedia] : [],
        canais_preferidos: data.preferredChannels ? [data.preferredChannels] : [],
        tipo_conteudo: data.contentTypes || [],
        marcas_admiradas: data.admiredBrands,
        resumo_historia: data.brandHistory,
        principais_conquistas: data.achievements,
        desafios_atuais: data.currentChallenges,
        oportunidades: data.opportunities,
        informacoes_adicionais: data.additionalInfo,
        nao_fazer: data.restrictions,
        progresso: calculateProgress(data),
        status: calculateProgress(data) === 100 ? 'completed' : 'em_andamento'
      };

      if (editingBriefing) {
        const { error } = await supabase
          .from('briefings')
          .update(briefingData)
          .eq('id', editingBriefing);

        if (error) throw error;
        toast.success("Briefing atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from('briefings')
          .insert([briefingData]);

        if (error) throw error;
        toast.success("Briefing criado com sucesso!");
      }

      setCurrentView('list');
      setEditingBriefing(null);
      loadBriefings();
    } catch (error: any) {
      console.error('Erro ao salvar briefing:', error);
      toast.error('Erro ao salvar briefing');
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (data: any) => {
    const totalFields = Object.keys(data).length;
    const filledFields = Object.values(data).filter(value => 
      Array.isArray(value) ? value.length > 0 : value !== ""
    ).length;
    return Math.round((filledFields / totalFields) * 100);
  };

  const handleDownloadAll = () => {
    toast.success("Download de todos os briefings iniciado");
  };

  if (currentView === 'form') {
    const currentBriefing = editingBriefing ? briefings.find(b => b.id === editingBriefing) : null;
    
    return (
      <DashboardLayout>
        <BriefingForm
          onSave={handleSaveBriefing}
          onCancel={() => setCurrentView('list')}
          initialData={currentBriefing}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">Briefings de Marca</h1>
            <p className="text-muted-foreground">
              Gerencie as diretrizes e identidade das suas marcas
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleDownloadAll}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Baixar Briefing
            </Button>
            <Button
              onClick={handleNewBriefing}
              className="flex items-center gap-2 bg-honey-gradient hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Novo Briefing
            </Button>
          </div>
        </div>

        {briefings.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-accent rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum briefing criado ainda
            </h3>
            <p className="text-muted-foreground mb-6">
              Crie seu primeiro briefing para começar a organizar a identidade das suas marcas
            </p>
            <Button
              onClick={handleNewBriefing}
              className="bg-honey-gradient hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Briefing
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {briefings.map((briefing) => (
              <BriefingCard
                key={briefing.id}
                briefing={{
                  id: briefing.id,
                  brandName: briefing.nome_marca,
                  createdAt: new Date(briefing.created_at),
                  status: briefing.status === 'completed' ? 'completed' : 'in-progress',
                  progress: briefing.progresso
                }}
                onEdit={handleEditBriefing}
                onView={handleViewBriefing}
                onDelete={handleDeleteBriefing}
                onDownload={handleDownloadBriefing}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Briefing;
