import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, Target, Calendar, Zap, CheckCircle, Instagram, Facebook, Linkedin, Youtube, Music, Edit2, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const Planner = () => {
  const [step, setStep] = useState(1);
  const [objective, setObjective] = useState("");
  const [channels, setChannels] = useState<string[]>([]);
  const [duration, setDuration] = useState("");

  const objectives = [
    { id: "awareness", label: "Brand Awareness", description: "Aumentar conhecimento da marca", icon: "🎯" },
    { id: "leads", label: "Geração de Leads", description: "Capturar contatos qualificados", icon: "📊" },
    { id: "sales", label: "Vendas Diretas", description: "Converter em vendas imediatas", icon: "💰" },
    { id: "engagement", label: "Engajamento", description: "Interação e relacionamento", icon: "❤️" }
  ];

  const socialChannels = [
    { id: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-500" },
    { id: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-600" },
    { id: "tiktok", label: "TikTok", icon: Music, color: "text-slate-900" },
    { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
    { id: "youtube", label: "YouTube", icon: Youtube, color: "text-red-600" }
  ];


  const toggleChannel = (channelId: string) => {
    if (channels.includes(channelId)) {
      setChannels(channels.filter(c => c !== channelId));
    } else {
      setChannels([...channels, channelId]);
    }
  };

  const mockPlan = [
    { day: 1, type: "Lançamento", content: "Post de abertura da campanha", platform: "Instagram" },
    { day: 3, type: "Educativo", content: "Carrossel explicativo", platform: "LinkedIn" },
    { day: 5, type: "Social Proof", content: "Depoimento de cliente", platform: "Facebook" },
    { day: 7, type: "CTA", content: "Call-to-action direto", platform: "Instagram" },
    { day: 10, type: "Behind the Scenes", content: "Bastidores da empresa", platform: "Instagram" },
    { day: 12, type: "Tendência", content: "Aproveitando trend atual", platform: "TikTok" },
    { day: 14, type: "Fechamento", content: "Post de encerramento", platform: "LinkedIn" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Planner IA</h1>
          <p className="text-muted-foreground">
            Crie campanhas completas com inteligência artificial
          </p>
        </div>

        {/* Steps Progress */}
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= stepNumber
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > stepNumber ? <CheckCircle className="h-5 w-5" /> : stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`w-20 h-1 ml-4 ${
                        step > stepNumber ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h3 className="font-semibold">
                {step === 1 && "Objetivo da Campanha"}
                {step === 2 && "Canais e Duração"}
                {step === 3 && "Plano Gerado"}
              </h3>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Objetivo */}
        {step === 1 && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Qual é o objetivo da sua campanha?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {objectives.map((obj) => (
                  <button
                    key={obj.id}
                    onClick={() => setObjective(obj.id)}
                    className={`p-4 rounded-lg border-2 transition-smooth text-left ${
                      objective === obj.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{obj.icon}</span>
                      <div>
                        <h3 className="font-semibold">{obj.label}</h3>
                        <p className="text-sm text-muted-foreground">{obj.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {objective && (
                <div className="flex justify-end pt-4">
                  <Button onClick={() => setStep(2)} className="bg-honey-gradient hover:bg-primary/90">
                    Próximo Passo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Canais e Duração */}
        {step === 2 && (
          <div className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Selecione os canais principais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {socialChannels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => toggleChannel(channel.id)}
                      className={`p-4 rounded-lg border-2 transition-smooth ${
                        channels.includes(channel.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <channel.icon className={`h-8 w-8 mx-auto mb-2 ${channel.color}`} />
                      <p className="font-medium text-sm">{channel.label}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Duração da campanha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label htmlFor="duration" className="text-sm font-medium">
                    Quantos dias durará sua campanha?
                  </label>
                  <input
                    id="duration"
                    type="number"
                    min="1"
                    max="365"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Ex: 7, 14, 30..."
                    className="w-full px-4 py-3 rounded-lg border-2 border-border focus:border-primary focus:outline-none transition-smooth"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recomendamos entre 7 e 30 dias para melhores resultados
                  </p>
                </div>
              </CardContent>
            </Card>

            {channels.length > 0 && duration && (
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Voltar
                </Button>
                <Button onClick={() => setStep(3)} className="bg-honey-gradient hover:bg-primary/90">
                  Gerar Plano
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Plano Gerado */}
        {step === 3 && (
          <div className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Seu Plano de Campanha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-accent/30 rounded-lg">
                      <h3 className="font-semibold">Objetivo</h3>
                      <p className="text-sm text-muted-foreground">
                        {objectives.find(o => o.id === objective)?.label}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-accent/30 rounded-lg">
                      <h3 className="font-semibold">Canais</h3>
                      <p className="text-sm text-muted-foreground">
                        {channels.length} plataformas
                      </p>
                    </div>
                    <div className="text-center p-4 bg-accent/30 rounded-lg">
                      <h3 className="font-semibold">Duração</h3>
                      <p className="text-sm text-muted-foreground">
                        {duration} dias
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {mockPlan.slice(0, parseInt(duration) / 2).map((post, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border border-border rounded-lg hover:shadow-soft transition-smooth group">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-primary">D{post.day}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{post.content}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {post.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            📱 {post.platform}
                          </p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-smooth">
                          <Button variant="outline" size="sm">
                            <Edit2 className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Voltar
              </Button>
              <div className="flex gap-2">
                <Button variant="outline">
                  Exportar para Calendário
                </Button>
                <Button className="bg-honey-gradient hover:bg-primary/90">
                  Salvar Plano
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Planner;