import { Download, Plus, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CalendarHeaderProps {
  activeTab: "calendar" | "holidays";
  onTabChange: (tab: "calendar" | "holidays") => void;
  onCreatePost: () => void;
  onSchedulePost: () => void;
  onExportCalendar: () => void;
}

export function CalendarHeader({ 
  activeTab, 
  onTabChange, 
  onCreatePost, 
  onSchedulePost, 
  onExportCalendar 
}: CalendarHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Header with title and actions */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Calendário Inteligente</h1>
          <p className="text-muted-foreground">
            Gerencie todos os seus posts e campanhas em um só lugar
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={onCreatePost}
            className="bg-warning hover:bg-warning/90 text-warning-foreground font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Post Rápido
          </Button>
          
          <Button
            onClick={onSchedulePost}
            className="bg-success hover:bg-success/90 text-success-foreground font-medium"
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Agendar Post
          </Button>
          
          <Button
            variant="outline"
            onClick={onExportCalendar}
            className="border-border hover:bg-accent"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Navigation tabs */}
      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as "calendar" | "holidays")}>
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="calendar" className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4" />
            <span>Calendário</span>
          </TabsTrigger>
          <TabsTrigger value="holidays" className="flex items-center space-x-2">
            <Badge variant="secondary" className="h-4 w-4 rounded-full p-0 flex items-center justify-center">
              !
            </Badge>
            <span>Datas e Feriados</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}