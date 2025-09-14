import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye } from "lucide-react";

const melhorConteudo = [
  {
    title: "Dicas de produtividade",
    platform: "Instagram",
    type: "Carrossel",
    likes: "4.2k",
    views: "12.8k",
    platformColor: "bg-pink-100 text-pink-700"
  },
  {
    title: "Behind the scenes",
    platform: "LinkedIn",
    type: "Vídeo",
    likes: "3.8k",
    views: "9.5k",
    platformColor: "bg-blue-100 text-blue-700"
  },
  {
    title: "Tutorial rápido",
    platform: "Instagram",
    type: "Reels",
    likes: "3.1k",
    views: "8.2k",
    platformColor: "bg-pink-100 text-pink-700"
  },
];

export function MelhorConteudo() {
  return (
    <Card className="border border-gray-200 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Melhor Conteúdo do Mês
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {melhorConteudo.map((conteudo, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">{conteudo.title}</h4>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${conteudo.platformColor} border-0`}>
                    {conteudo.platform}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {conteudo.type}
                  </Badge>
                </div>
              </div>
              <div className="text-right text-xs text-gray-600">
                <div className="flex items-center gap-1 mb-1">
                  <Heart className="h-3 w-3" />
                  {conteudo.likes}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {conteudo.views}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}