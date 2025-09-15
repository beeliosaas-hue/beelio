import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Edit3, Eye, Trash2, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Briefing {
  id: string;
  brandName: string;
  createdAt: Date;
  status: 'completed' | 'in-progress';
  progress: number;
}

interface BriefingCardProps {
  briefing: Briefing;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
}

export function BriefingCard({ briefing, onEdit, onView, onDelete, onDownload }: BriefingCardProps) {
  const getStatusConfig = (status: string, progress: number) => {
    if (status === 'completed') {
      return {
        label: 'Concluído',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        progressColor: 'bg-green-500'
      };
    }
    return {
      label: 'Em andamento',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      progressColor: 'bg-orange-500'
    };
  };

  const statusConfig = getStatusConfig(briefing.status, briefing.progress);

  return (
    <Card className="shadow-soft hover:shadow-md transition-all duration-200">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{briefing.brandName}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>📅</span>
            <span>{format(briefing.createdAt, "dd/MM/yyyy", { locale: ptBR })}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge 
              variant="secondary" 
              className={`${statusConfig.bgColor} ${statusConfig.color} border-0`}
            >
              {statusConfig.label}
            </Badge>
            <span className="text-sm text-muted-foreground">{briefing.progress}% completo</span>
          </div>
          <Progress value={briefing.progress} className="h-2">
            <div 
              className={`h-full ${statusConfig.progressColor} rounded-full transition-all`}
              style={{ width: `${briefing.progress}%` }}
            />
          </Progress>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(briefing.id)}
            className="flex-1"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button
            size="sm"
            onClick={() => onView(briefing.id)}
            className="flex-1 bg-honey-gradient hover:bg-primary/90"
          >
            <Eye className="w-4 h-4 mr-2" />
            Visualizar
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(briefing.id)}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Baixar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(briefing.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}