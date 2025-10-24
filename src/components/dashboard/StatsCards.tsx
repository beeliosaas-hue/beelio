import { TrendingUp, MessageCircle, Calendar, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const statsData = [
  {
    title: "Posts Criados",
    value: "47",
    subtitle: "neste mês",
    progress: 78,
    progressText: "Progresso",
    icon: Calendar,
    trend: "+12%",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Créditos Diana",
    value: "156",
    subtitle: "disponíveis",
    progress: 65,
    progressText: "Progresso",
    icon: MessageCircle,
    trend: "+25%",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    title: "Próxima Campanha",
    value: "Black Friday",
    subtitle: "em 3 dias",
    progress: null,
    icon: Calendar,
    trend: null,
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
  {
    title: "Tendências Ativas",
    value: "8",
    subtitle: "para explorar",
    progress: null,
    icon: TrendingUp,
    trend: "+2%",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, index) => (
        <Card 
          key={index} 
          className="card-interactive border border-border bg-card animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              {stat.trend && (
                <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                  {stat.trend}
                </Badge>
              )}
            </div>
            
            <div className="mb-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</h3>
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </div>
            
            {stat.progress !== null && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{stat.progressText}</span>
                  <span>{stat.progress}%</span>
                </div>
                <Progress 
                  value={stat.progress} 
                  className="h-2"
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}