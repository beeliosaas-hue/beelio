import { TrendingUp, MessageCircle, Calendar, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const statsData = [
  {
    title: "Posts Criados",
    value: "12",
    total: "50",
    subtitle: "de 50 posts (Plano Pro)",
    progress: 24,
    icon: Calendar,
    trend: "+3 esta semana",
    color: "text-primary",
    bgColor: "bg-accent/30",
  },
  {
    title: "Créditos Diana",
    value: "∞",
    subtitle: "Ilimitado (Plano Pro)",
    progress: 100,
    icon: MessageCircle,
    trend: "Plano ativo",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Tendências Ativas",
    value: "8",
    subtitle: "Para seu segmento",
    progress: null,
    icon: TrendingUp,
    trend: "2 novas hoje",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Próxima Campanha",
    value: "Black Friday",
    subtitle: "Em 15 dias",
    progress: null,
    icon: Zap,
    trend: "Preparação sugerida",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <Card key={index} className="border-border bg-card shadow-soft hover:shadow-elevation transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2 mb-2">
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              {stat.total && (
                <div className="text-sm text-muted-foreground">
                  /{stat.total}
                </div>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground mb-3">
              {stat.subtitle}
            </p>
            
            {stat.progress !== null && (
              <div className="space-y-2">
                <Progress 
                  value={stat.progress} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{stat.progress}% usado</span>
                  <span>{100 - stat.progress}% restante</span>
                </div>
              </div>
            )}
            
            <div className="mt-3">
              <Badge variant="secondary" className="text-xs">
                {stat.trend}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}