import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BriefingCard } from "@/components/briefing/BriefingCard";
import { BriefingForm } from "@/components/briefing/BriefingForm";
import { toast } from "sonner";

interface Briefing {
  id: string;
  brandName: string;
  createdAt: Date;
  status: 'completed' | 'in-progress';
  progress: number;
}

const Briefing = () => {
  const [briefings, setBriefings] = useState<Briefing[]>([
    {
      id: '1',
      brandName: 'Café Aroma',
      createdAt: new Date('2024-01-14'),
      status: 'completed',
      progress: 100
    },
    {
      id: '2',
      brandName: 'Tech Solutions',
      createdAt: new Date('2024-01-19'),
      status: 'in-progress',
      progress: 65
    },
    {
      id: '3',
      brandName: 'Boutique Luna',
      createdAt: new Date('2024-01-21'),
      status: 'in-progress',
      progress: 30
    }
  ]);

  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [editingBriefing, setEditingBriefing] = useState<string | null>(null);

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
    toast.success(`Visualizando briefing: ${briefing?.brandName}`);
  };

  const handleDeleteBriefing = (id: string) => {
    const briefing = briefings.find(b => b.id === id);
    setBriefings(prev => prev.filter(b => b.id !== id));
    toast.success(`Briefing "${briefing?.brandName}" excluído com sucesso`);
  };

  const handleDownloadBriefing = (id: string) => {
    const briefing = briefings.find(b => b.id === id);
    toast.success(`Download iniciado: ${briefing?.brandName}.pdf`);
  };

  const handleSaveBriefing = (data: any) => {
    if (editingBriefing) {
      // Update existing briefing
      setBriefings(prev => prev.map(b => 
        b.id === editingBriefing 
          ? { ...b, brandName: data.brandName, progress: calculateProgress(data) }
          : b
      ));
      toast.success("Briefing atualizado com sucesso!");
    } else {
      // Create new briefing
      const newBriefing: Briefing = {
        id: Date.now().toString(),
        brandName: data.brandName || 'Novo Briefing',
        createdAt: new Date(),
        status: calculateProgress(data) === 100 ? 'completed' : 'in-progress',
        progress: calculateProgress(data)
      };
      setBriefings(prev => [...prev, newBriefing]);
      toast.success("Briefing criado com sucesso!");
    }
    setCurrentView('list');
    setEditingBriefing(null);
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
        {/* Header */}
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

        {/* Briefings Grid */}
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
                briefing={briefing}
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