import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, FileText, TrendingUp, Users, Plus, Calendar as CalendarIcon, Edit2, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Facebook, Linkedin, Youtube, Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: string;
  name: string;
  objective: string;
  channels: string[];
  duration: number;
  posts: number;
  reach: number;
  engagement: number;
  status: "active" | "draft" | "completed";
  createdAt: Date;
}

const Planner = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [campaignName, setCampaignName] = useState("");
  const [selectedObjective, setSelectedObjective] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [campaignDuration, setCampaignDuration] = useState("");
  const { toast } = useToast();

  const objectives = [
    { id: "awareness", label: "Aumentar Consciência da Marca", icon: "📈" },
    { id: "engagement", label: "Melhorar Engajamento", icon: "👥" },
    { id: "leads", label: "Gerar Leads", icon: "🎯" },
    { id: "sales", label: "Aumentar Vendas", icon: "💰" }
  ];

  const socialChannels = [
    { id: "instagram", label: "Instagram", icon: Instagram, users: "1.2B usuários", color: "text-pink-500" },
    { id: "linkedin", label: "LinkedIn", icon: Linkedin, users: "900M usuários", color: "text-blue-700" },
    { id: "tiktok", label: "TikTok", icon: Music, users: "1B usuários", color: "text-slate-900" },
    { id: "facebook", label: "Facebook", icon: Facebook, users: "2.9B usuários", color: "text-blue-600" },
    { id: "youtube", label: "YouTube", icon: Youtube, users: "2.7B usuários", color: "text-red-600" }
  ];

  useEffect(() => {
    const stored = localStorage.getItem("beelio_campaigns");
    if (stored) {
      setCampaigns(JSON.parse(stored));
    }
  }, []);

  const saveCampaigns = (updatedCampaigns: Campaign[]) => {
    localStorage.setItem("beelio_campaigns", JSON.stringify(updatedCampaigns));
    setCampaigns(updatedCampaigns);
  };

  const handleSaveCampaign = () => {
    if (!campaignName || !selectedObjective || selectedChannels.length === 0 || !campaignDuration) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos da campanha.",
        variant: "destructive"
      });
      return;
    }

    const newCampaign: Campaign = {
      id: editingCampaign?.id || Date.now().toString(),
      name: campaignName,
      objective: selectedObjective,
      channels: selectedChannels,
      duration: parseInt(campaignDuration),
      posts: Math.ceil(parseInt(campaignDuration) * 1.5),
      reach: Math.floor(Math.random() * 100000) + 10000,
      engagement: Math.random() * 10,
      status: "active",
      createdAt: editingCampaign?.createdAt || new Date()
    };

    let updatedCampaigns;
    if (editingCampaign) {
      updatedCampaigns = campaigns.map(c => c.id === editingCampaign.id ? newCampaign : c);
      toast({
        title: "Campanha atualizada!",
        description: "Sua campanha foi atualizada com sucesso."
      });
    } else {
      updatedCampaigns = [...campaigns, newCampaign];
      toast({
        title: "Campanha criada!",
        description: "Sua campanha foi salva com sucesso."
      });
    }

    saveCampaigns(updatedCampaigns);
    resetForm();
    setIsModalOpen(false);
  };

  const handleDeleteCampaign = (id: string) => {
    const updatedCampaigns = campaigns.filter(c => c.id !== id);
    saveCampaigns(updatedCampaigns);
    toast({
      title: "Campanha excluída",
      description: "A campanha foi removida com sucesso."
    });
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setCampaignName(campaign.name);
    setSelectedObjective(campaign.objective);
    setSelectedChannels(campaign.channels);
    setCampaignDuration(campaign.duration.toString());
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setCampaignName("");
    setSelectedObjective("");
    setSelectedChannels([]);
    setCampaignDuration("");
    setEditingCampaign(null);
  };

  const toggleChannel = (channelId: string) => {
    if (selectedChannels.includes(channelId)) {
      setSelectedChannels(selectedChannels.filter(c => c !== channelId));
    } else {
      setSelectedChannels([...selectedChannels, channelId]);
    }
  };

  const totalPosts = campaigns.reduce((acc, c) => acc + c.posts, 0);
  const totalReach = campaigns.reduce((acc, c) => acc + c.reach, 0);
  const avgEngagement = campaigns.length > 0 
    ? campaigns.reduce((acc, c) => acc + c.engagement, 0) / campaigns.length 
    : 0;

  const getChannelIcon = (channelId: string) => {
    const channel = socialChannels.find(c => c.id === channelId);
    if (!channel) return null;
    const Icon = channel.icon;
    return <Icon className={`h-4 w-4 ${channel.color}`} />;
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Planner IA - Beelio | Crie Campanhas Inteligentes de Marketing</title>
        <meta name="description" content="Planner IA do Beelio: crie, gerencie e monitore campanhas de marketing completas com inteligência artificial. Métricas em tempo real e otimização automática." />
        <meta property="og:title" content="Planner IA - Beelio | Campanhas Inteligentes" />
        <meta property="og:description" content="Crie campanhas de marketing completas com IA. Planeje, execute e monitore resultados em uma única plataforma." />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <span className="text-2xl">✨</span> Planner IA
            </h1>
            <p className="text-muted-foreground">
              Crie campanhas inteligentes com a ajuda da IA
            </p>
          </div>
          <Dialog open={isModalOpen} onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-honey-gradient hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nova Campanha
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCampaign ? "Editar Campanha" : "Nova Campanha"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Configure sua campanha com a ajuda da IA
                </p>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Nome da Campanha */}
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Nome da Campanha</Label>
                  <Input
                    id="campaign-name"
                    placeholder="Ex: Lançamento Produto Q1"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                  />
                </div>

                {/* Objetivo da Campanha */}
                <div className="space-y-3">
                  <Label>Objetivo da Campanha</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {objectives.map((obj) => (
                      <button
                        key={obj.id}
                        onClick={() => setSelectedObjective(obj.id)}
                        className={`p-4 rounded-lg border-2 transition-smooth text-left ${
                          selectedObjective === obj.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{obj.icon}</span>
                          <span className="font-medium text-sm">{obj.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plataformas */}
                <div className="space-y-3">
                  <Label>Plataformas de Publicação</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {socialChannels.map((channel) => {
                      const Icon = channel.icon;
                      return (
                        <button
                          key={channel.id}
                          onClick={() => toggleChannel(channel.id)}
                          className={`p-4 rounded-lg border-2 transition-smooth text-left ${
                            selectedChannels.includes(channel.id)
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`h-5 w-5 ${channel.color}`} />
                            <div>
                              <p className="font-medium text-sm">{channel.label}</p>
                              <p className="text-xs text-muted-foreground">{channel.users}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Duração */}
                <div className="space-y-2">
                  <Label htmlFor="duration">Duração da Campanha (dias)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="365"
                    placeholder="Ex: 30"
                    value={campaignDuration}
                    onChange={(e) => setCampaignDuration(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveCampaign} className="bg-honey-gradient hover:bg-primary/90">
                    {editingCampaign ? "Atualizar" : "Salvar"} Campanha
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Campanhas Ativas</p>
                  <p className="text-3xl font-bold">{campaigns.filter(c => c.status === "active").length}</p>
                </div>
                <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Play className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total de Posts</p>
                  <p className="text-3xl font-bold">{totalPosts}</p>
                </div>
                <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Alcance Total</p>
                  <p className="text-3xl font-bold">{(totalReach / 1000).toFixed(1)}K</p>
                </div>
                <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Engajamento Médio</p>
                  <p className="text-3xl font-bold">{avgEngagement.toFixed(1)}%</p>
                </div>
                <div className="h-12 w-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Campanhas */}
        <Card>
          <CardHeader>
            <CardTitle>Suas Campanhas</CardTitle>
            <p className="text-sm text-muted-foreground">
              Gerencie e monitore suas campanhas de marketing
            </p>
          </CardHeader>
          <CardContent>
            {campaigns.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Nenhuma campanha criada</h3>
                <p className="text-muted-foreground mb-4">
                  Crie sua primeira campanha inteligente com IA
                </p>
                <Button onClick={() => setIsModalOpen(true)} className="bg-honey-gradient hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Campanha
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="border border-border rounded-lg p-6 hover:shadow-soft transition-smooth"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{campaign.name}</h3>
                          <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                            {campaign.status === "active" ? "Ativa" : campaign.status === "draft" ? "Rascunho" : "Concluída"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {objectives.find(o => o.id === campaign.objective)?.label}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditCampaign(campaign)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteCampaign(campaign.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{campaign.duration} dias</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{campaign.posts} posts</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{(campaign.reach / 1000).toFixed(1)}K alcance</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span>{campaign.engagement.toFixed(1)}% engajamento</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {campaign.channels.map(channelId => (
                        <Badge key={channelId} variant="outline" className="flex items-center gap-1">
                          {getChannelIcon(channelId)}
                          {socialChannels.find(c => c.id === channelId)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Planner;
