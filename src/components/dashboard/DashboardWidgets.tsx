import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TooltipCustom } from "@/components/ui/tooltip-custom";
import { 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  MessageCircle,
  Sparkles,
  ArrowRight,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DashboardWidgets() {
  const navigate = useNavigate();

  const widgets = [
    {
      icon: Calendar,
      title: "Calendário Editorial",
      description: "Visualize e organize seus posts",
      action: () => navigate('/calendario'),
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: MessageCircle,
      title: "Chat com Diana",
      description: "Peça sugestões e estratégias",
      action: () => navigate('/diana'),
      color: "text-amber-600",
      bgColor: "bg-amber-100"
    },
    {
      icon: TrendingUp,
      title: "Tendências",
      description: "Descubra o que está bombando",
      action: () => navigate('/tendencias'),
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: BarChart3,
      title: "Relatórios",
      description: "Analise seu desempenho",
      action: () => navigate('/relatorios'),
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
      {widgets.map((widget, index) => (
        <TooltipCustom key={index} content={widget.description}>
          <Card 
            className="card-interactive group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 rounded-full ${widget.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <widget.icon className={`h-8 w-8 ${widget.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {widget.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {widget.description}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={widget.action}
                  className="w-full group-hover:bg-primary/10 transition-colors"
                >
                  Acessar
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TooltipCustom>
      ))}
    </div>
  );
}
