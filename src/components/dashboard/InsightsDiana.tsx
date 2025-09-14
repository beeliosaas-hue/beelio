import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target } from "lucide-react";

const insights = [
  {
    icon: TrendingUp,
    title: "Posts com carrossel performaram +45%",
    description: "Conteúdos com múltiplas imagens geram mais engajamento",
    value: "2.8k",
    change: "+45%",
    changeType: "positive",
    borderColor: "border-l-green-400",
    bgColor: "bg-green-50"
  },
  {
    icon: TrendingDown,
    title: "Vídeos longos tiveram baixo alcance",
    description: "Vídeos acima de 60s não performaram bem",
    value: "892",
    change: "-23%",
    changeType: "negative",
    borderColor: "border-l-red-400",
    bgColor: "bg-red-50"
  },
  {
    icon: Target,
    title: "Teste stories interativos",
    description: "Enquetes e perguntas estão em alta no seu segmento",
    value: "",
    change: "",
    changeType: "neutral",
    borderColor: "border-l-blue-400",
    bgColor: "bg-blue-50"
  },
];

export function InsightsDiana() {
  return (
    <Card className="border border-gray-200 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          🤖 Insights da Diana
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className={`p-3 rounded-lg border-l-4 ${insight.borderColor} ${insight.bgColor}`}>
              <div className="flex items-start gap-3">
                <insight.icon className={`h-5 w-5 mt-0.5 ${
                  insight.changeType === 'positive' ? 'text-green-600' : 
                  insight.changeType === 'negative' ? 'text-red-600' : 'text-blue-600'
                }`} />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{insight.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                  {insight.value && (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{insight.value}</span>
                      <span className={`text-xs font-medium ${
                        insight.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {insight.change}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}