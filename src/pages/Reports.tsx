import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar, 
  Heart, 
  Eye, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Download,
  CheckCircle2,
  XCircle,
  Lightbulb
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock data - será substituído por dados reais do Supabase
const engagementData = [
  { date: "01/12", engagement: 45, likes: 35, comments: 20 },
  { date: "02/12", engagement: 135, likes: 85, comments: 38 },
  { date: "03/12", engagement: 180, likes: 140, comments: 48 },
  { date: "04/12", engagement: 165, likes: 125, comments: 42 },
  { date: "05/12", engagement: 210, likes: 170, comments: 55 },
  { date: "06/12", engagement: 175, likes: 135, comments: 50 },
  { date: "07/12", engagement: 225, likes: 180, comments: 40 },
];

const contentTypeData = [
  { name: "Carrossel", value: 35, color: "hsl(45, 100%, 60%)" },
  { name: "Vídeo", value: 28, color: "hsl(160, 60%, 45%)" },
  { name: "Imagem", value: 22, color: "hsl(0, 70%, 60%)" },
  { name: "Stories", value: 15, color: "hsl(200, 70%, 50%)" },
];

const postsByChannelData = [
  { channel: "Instagram", posts: 24, engagement: 8, reach: 4 },
  { channel: "LinkedIn", posts: 16, engagement: 6, reach: 2 },
  { channel: "Facebook", posts: 12, engagement: 4, reach: 3 },
  { channel: "TikTok", posts: 8, engagement: 3, reach: 1 },
];

const stats = [
  {
    icon: Calendar,
    label: "Posts Publicados",
    value: "60",
    subtitle: "Este mês",
    change: "+12%",
    trend: "up",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: Heart,
    label: "Engajamento Médio",
    value: "8.5%",
    subtitle: "Taxa de engajamento",
    change: "+2.3%",
    trend: "up",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Eye,
    label: "Alcance Total",
    value: "45.2K",
    subtitle: "Pessoas alcançadas",
    change: "+18%",
    trend: "up",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: Users,
    label: "Novos Seguidores",
    value: "1.2K",
    subtitle: "Este mês",
    change: "-5%",
    trend: "down",
    bgColor: "bg-red-50",
    iconColor: "text-red-600",
  },
];

const quickMetrics = [
  { label: "Curtidas Totais", value: "1,290", icon: Heart, color: "text-red-500" },
  { label: "Comentários", value: "386", icon: Users, color: "text-blue-500" },
  { label: "Compartilhamentos", value: "242", icon: TrendingUp, color: "text-green-500" },
  { label: "Visualizações", value: "10.6K", icon: Eye, color: "text-purple-500" },
];

const dianaRecommendations = {
  repeat: [
    "Carrosséis educativos têm 40% mais engajamento",
    "Posts às 18h geram melhor alcance",
    "Conteúdo com perguntas aumenta comentários",
  ],
  avoid: [
    "Posts muito promocionais têm baixo alcance",
    "Horários de madrugada têm pouco engajamento",
    "Excesso de hashtags reduz visibilidade",
  ],
  test: [
    "Vídeos curtos verticais para TikTok",
    "Stories interativos com enquetes",
    "Colaborações com micro-influencers",
  ],
};

export default function Reports() {
  const [period, setPeriod] = useState("30");

  const handleExportPDF = () => {
    // Implementar exportação PDF
    console.log("Exportando relatório em PDF...");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Acompanhe o desempenho das suas campanhas
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="365">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleExportPDF}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-foreground mt-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.subtitle}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Engagement Over Time */}
          <Card className="lg:col-span-2 border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">
                Engajamento ao Longo do Tempo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="hsl(45, 100%, 60%)" 
                    strokeWidth={2}
                    name="Engajamento"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="likes" 
                    stroke="hsl(160, 60%, 45%)" 
                    strokeWidth={2}
                    name="Curtidas"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="comments" 
                    stroke="hsl(0, 70%, 60%)" 
                    strokeWidth={2}
                    name="Comentários"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Content Type Distribution */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">
                Tipos de Conteúdo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={contentTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {contentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {contentTypeData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium text-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Posts by Channel */}
          <Card className="lg:col-span-2 border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">
                Posts por Canal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={postsByChannelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="channel" 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="posts" fill="hsl(160, 60%, 45%)" name="Posts" />
                  <Bar dataKey="engagement" fill="hsl(45, 100%, 60%)" name="Engajamento" />
                  <Bar dataKey="reach" fill="hsl(0, 70%, 60%)" name="Alcance" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Metrics */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">
                Métricas Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quickMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <metric.icon className={`h-5 w-5 ${metric.color}`} />
                      <span className="text-sm text-foreground">{metric.label}</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Diana Recommendations */}
        <Card className="border-border bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-lg">🐝</span>
              </div>
              Recomendações da Diana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* O que repetir */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-foreground">O que repetir</h3>
                </div>
                <ul className="space-y-3">
                  {dianaRecommendations.repeat.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* O que evitar */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-foreground">O que evitar</h3>
                </div>
                <ul className="space-y-3">
                  {dianaRecommendations.avoid.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* O que testar */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-foreground">O que testar</h3>
                </div>
                <ul className="space-y-3">
                  {dianaRecommendations.test.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
