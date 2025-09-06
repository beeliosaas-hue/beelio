import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, Hash, Lightbulb, ArrowUpRight, Video, Image, Users } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const trends = [
  {
    rank: 1,
    title: "Marketing de Influência Micro",
    platform: "Instagram",
    category: "Estratégia",
    growth: "+95%",
    engagement: "+45%",
    audience: "Pequenas empresas",
    tags: ["#microinfluencer", "#marketing", "#engagement"],
    description: "Pequenos influenciadores com 1K-10K seguidores estão gerando mais engajamento que macro influenciadores"
  },
  {
    rank: 2,
    title: "Conteúdo Educativo em Vídeo",
    platform: "TikTok",
    category: "Conteúdo",
    growth: "+88%",
    engagement: "+32%",
    audience: "Jovens 18-35",
    tags: ["#educational", "#tutorial", "#learnonditiktok"],
    description: "Vídeos curtos educativos estão performando excepcionalmente bem, especialmente tutoriais de 15-30 segundos"
  },
  {
    rank: 3,
    title: "Stories Interativos",
    platform: "Instagram",
    category: "Engajamento",
    growth: "+92%",
    engagement: "+28%",
    audience: "Todos os públicos",
    tags: ["#interactive", "#stories", "#engagement"],
    description: "Enquetes, quizzes e caixas de perguntas estão aumentando significativamente o engajamento em Stories"
  },
  {
    rank: 4,
    title: "Marketing de Nostalgia",
    platform: "Facebook",
    category: "Emocional",
    growth: "+76%",
    engagement: "+22%",
    audience: "Millennials 25-40",
    tags: ["#nostalgia", "#throwback", "#memories"],
    description: "Conteúdos que despertam nostalgia dos anos 90 e 2000 estão gerando alta conexão emocional"
  },
  {
    rank: 5,
    title: "Transparência de Bastidores",
    platform: "LinkedIn",
    category: "Autenticidade",
    growth: "+64%",
    engagement: "+38%",
    audience: "Profissionais B2B",
    tags: ["#behindthescenes", "#transparency", "#authentic"],
    description: "Posts mostrando o dia a dia real das empresas e processos internos estão ganhando muita tração"
  }
];

const upcomingDates = [
  { date: "31/12", title: "Ano Novo", category: "Retrospectivas e metas" },
  { date: "15/01", title: "Dia do Carteiro", category: "Gratidão e reconhecimento" },
  { date: "25/01", title: "Dia dos Namorados", category: "Campanhas românticas" },
  { date: "14/02", title: "Dia dos Namorados", category: "Campanhas românticas" },
  { date: "08/03", title: "Dia da Mulher", category: "Empoderamento feminino" }
];

const popularHashtags = [
  "#marketingdigital", "#empreendedorismo", "#inovacao", "#vendas",
  "#networking", "#startups", "#motivacao", "#sucesso",
  "#estrategia", "#branding", "#vendasonline", "#digitalmarketing"
];

const weeklyInsights = [
  {
    icon: Video,
    title: "Vídeos curtos +40%",
    description: "Conteúdo de até 30 segundos teve crescimento expressivo"
  },
  {
    icon: Users,
    title: "Stories interativos",
    description: "Enquetes e perguntas aumentaram engajamento em 35%"
  },
  {
    icon: Hash,
    title: "Autenticidade em alta",
    description: "Conteúdo genuíno performa 2x melhor que produzido"
  }
];

const Trends = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Central de Tendências</h1>
          <p className="text-muted-foreground">
            Descubra as últimas tendências de marketing digital
          </p>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-sm text-muted-foreground">Tendências Ativas</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">1.2M</p>
                <p className="text-sm text-muted-foreground">Visualizações</p>
              </div>
              <Users className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">87%</p>
                <p className="text-sm text-muted-foreground">Engajamento Médio</p>
              </div>
              <ArrowUpRight className="h-8 w-8 text-bee-yellow" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">Diária</p>
                <p className="text-sm text-muted-foreground">Atualizações</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tendências Principais */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-bee-yellow-dark">
                🔥 Tendências em Alta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {trends.map((trend) => (
                <div key={trend.rank} className="border border-border rounded-lg p-4 hover:shadow-soft transition-smooth">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full font-bold text-sm">
                        #{trend.rank}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{trend.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {trend.platform}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {trend.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {trend.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-sm">
                      <span className="text-success font-medium">{trend.growth} Alto</span>
                      <span className="text-primary">{trend.engagement}</span>
                      <span className="text-muted-foreground">{trend.audience}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mt-2">
                    {trend.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Direita */}
        <div className="space-y-6">
          {/* Próximas Datas */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-bee-yellow-dark">
                📅 Próximas Datas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingDates.map((date, index) => (
                <div key={index} className="flex items-start gap-3 p-2 hover:bg-accent/30 rounded-lg transition-smooth">
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                    {date.date}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{date.title}</p>
                    <p className="text-xs text-muted-foreground">{date.category}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-3">
                Ver Calendário Completo
              </Button>
            </CardContent>
          </Card>

          {/* Hashtags Populares */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-bee-yellow-dark">
                🏷️ Hashtags Populares
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {popularHashtags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs cursor-pointer hover:bg-primary/20 transition-smooth">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Explorar Mais
              </Button>
            </CardContent>
          </Card>

          {/* Insights da Semana */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-bee-yellow-dark">
                💡 Insights da Semana
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {weeklyInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-bee-yellow/20 p-2 rounded-lg">
                    <insight.icon className="h-4 w-4 text-bee-yellow-dark" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{insight.title}</p>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
};

export default Trends;