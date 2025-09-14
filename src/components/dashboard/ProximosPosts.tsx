import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const proximosPosts = [
  {
    title: "Dicas de produtividade",
    date: "05/12 às 09:00",
    status: "Agendado",
    statusColor: "bg-blue-100 text-blue-700",
    icon: "💡"
  },
  {
    title: "Novidades do produto",
    date: "06/12 às 14:30",
    status: "Aprovado",
    statusColor: "bg-green-100 text-green-700",
    icon: "📱"
  },
  {
    title: "Behind the scenes",
    date: "12/12 às 16:00",
    status: "Agendado",
    statusColor: "bg-blue-100 text-blue-700",
    icon: "🎬"
  },
  {
    title: "Tutorial completo",
    date: "15/12 às 10:00",
    status: "Aprovado",
    statusColor: "bg-green-100 text-green-700",
    icon: "📚"
  },
];

export function ProximosPosts() {
  return (
    <Card className="border border-gray-200 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          🕐 Próximos Posts
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {proximosPosts.map((post, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-lg">{post.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{post.title}</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.date}
                  </p>
                </div>
              </div>
              <Badge className={`text-xs ${post.statusColor} border-0`}>
                {post.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}