import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Heart, BarChart3 } from "lucide-react";

const estatisticas = [
  {
    icon: Calendar,
    label: "Posts Agendados",
    value: "6",
    change: "+12%",
    changeType: "positive"
  },
  {
    icon: Users,
    label: "Alcance Total",
    value: "24.5K",
    change: "+8.2%",
    changeType: "positive"
  },
  {
    icon: Heart,
    label: "Engajamento",
    value: "4.8%",
    change: "+15%",
    changeType: "positive"
  },
  {
    icon: BarChart3,
    label: "Performance",
    value: "87%",
    change: "+5%",
    changeType: "positive"
  },
];

export function EstatisticasRapidas() {
  return (
    <Card className="border border-gray-200 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          📊 Estatísticas Rápidas
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4">
          {estatisticas.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-600 mb-1">{stat.label}</div>
              <div className="text-xs text-green-600 font-medium">{stat.change}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}