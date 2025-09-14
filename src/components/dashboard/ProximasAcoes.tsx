import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const proximasAcoes = [
  "Criar mais carrosseis para Instagram",
  "Testar stories interativos", 
  "Reduzir duração dos vídeos"
];

export function ProximasAcoes() {
  return (
    <Card className="border border-gray-200 bg-yellow-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          ⚡ Próximas Ações
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3 mb-4">
          {proximasAcoes.map((acao, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700">{acao}</span>
            </div>
          ))}
        </div>
        
        <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white border-0">
          Aplicar Sugestões Automaticamente
        </Button>
      </CardContent>
    </Card>
  );
}