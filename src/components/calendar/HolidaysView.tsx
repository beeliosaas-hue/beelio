import { useState } from "react";
import { Calendar as CalendarIcon, Star, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Holiday {
  id: string;
  date: string;
  name: string;
  type: "national" | "seasonal" | "segment";
  segment?: string;
  isSelected: boolean;
  description?: string;
}

const mockHolidays: Holiday[] = [
  {
    id: "1",
    date: "2025-01-01",
    name: "Confraternização Universal",
    type: "national",
    isSelected: false,
    description: "Feriado nacional"
  },
  {
    id: "2",
    date: "2025-03-08",
    name: "Dia Internacional da Mulher",
    type: "seasonal",
    isSelected: true,
    description: "Data comemorativa mundial"
  },
  {
    id: "3",
    date: "2025-04-21",
    name: "Tiradentes",
    type: "national",
    isSelected: false,
    description: "Feriado nacional"
  },
  {
    id: "4",
    date: "2025-05-01",
    name: "Dia do Trabalhador",
    type: "national",
    isSelected: true,
    description: "Feriado nacional"
  },
  {
    id: "5",
    date: "2025-05-11",
    name: "Dia das Mães",
    type: "seasonal",
    isSelected: true,
    description: "Data comemorativa comercial"
  },
  {
    id: "6",
    date: "2025-06-15",
    name: "Dia do Advogado",
    type: "segment",
    segment: "Jurídico",
    isSelected: false,
    description: "Data específica do segmento jurídico"
  },
  {
    id: "7",
    date: "2025-08-11",
    name: "Dia da Comunicação",
    type: "segment",
    segment: "Marketing",
    isSelected: true,
    description: "Data específica da área de comunicação"
  },
  {
    id: "8",
    date: "2025-11-29",
    name: "Black Friday",
    type: "seasonal",
    isSelected: true,
    description: "Data comercial internacional"
  },
  {
    id: "9",
    date: "2025-12-25",
    name: "Natal",
    type: "national",
    isSelected: true,
    description: "Feriado nacional e religioso"
  }
];

export function HolidaysView() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [filterType, setFilterType] = useState<"all" | "national" | "seasonal" | "segment">("all");
  const [holidays, setHolidays] = useState(mockHolidays);

  const filteredHolidays = holidays.filter(holiday => {
    if (filterType === "all") return true;
    return holiday.type === filterType;
  });

  const toggleHoliday = (holidayId: string) => {
    setHolidays(prev => 
      prev.map(holiday => 
        holiday.id === holidayId 
          ? { ...holiday, isSelected: !holiday.isSelected }
          : holiday
      )
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "national":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "seasonal":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "segment":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "national":
        return "Feriado Nacional";
      case "seasonal":
        return "Data Comemorativa";
      case "segment":
        return "Segmento Específico";
      default:
        return "Outros";
    }
  };

  const selectedCount = holidays.filter(h => h.isSelected).length;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Datas e Feriados</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Ano</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-32 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2027">2027</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
                  <SelectTrigger className="w-48 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="national">Feriados Nacionais</SelectItem>
                    <SelectItem value="seasonal">Datas Comemorativas</SelectItem>
                    <SelectItem value="segment">Segmento Específico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Datas selecionadas</div>
              <div className="text-2xl font-bold text-primary">{selectedCount}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Holidays List */}
      <div className="grid gap-4">
        {filteredHolidays.map((holiday) => {
          const holidayDate = new Date(holiday.date);
          const formattedDate = holidayDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long'
          });

          return (
            <Card 
              key={holiday.id}
              className={cn(
                "transition-all cursor-pointer hover:shadow-md",
                holiday.isSelected && "ring-2 ring-primary bg-primary/5"
              )}
              onClick={() => toggleHoliday(holiday.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Checkbox 
                      checked={holiday.isSelected}
                      className="pointer-events-none"
                    />
                    
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-foreground">{holiday.name}</h3>
                        <Badge className={getTypeColor(holiday.type)}>
                          {getTypeLabel(holiday.type)}
                        </Badge>
                        {holiday.segment && (
                          <Badge variant="outline" className="text-xs">
                            {holiday.segment}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {holiday.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-semibold text-primary">
                      {formattedDate}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedYear}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card className="bg-accent/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-success" />
              <span className="font-medium">
                {selectedCount} datas selecionadas aparecerão automaticamente no seu calendário
              </span>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Data Personalizada
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}