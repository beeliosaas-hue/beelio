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
  type: "national" | "seasonal";
  month: number;
  isSelected: boolean;
  description?: string;
}

// Feriados Nacionais 2025-2027
const nationalHolidays2025: Holiday[] = [
  { id: "n2025-01", date: "2025-01-01", name: "Confraternização Universal", type: "national", month: 1, isSelected: false, description: "Feriado nacional" },
  { id: "n2025-02", date: "2025-03-03", name: "Carnaval", type: "national", month: 3, isSelected: false, description: "Feriado nacional" },
  { id: "n2025-03", date: "2025-03-04", name: "Carnaval", type: "national", month: 3, isSelected: false, description: "Feriado nacional" },
  { id: "n2025-04", date: "2025-04-18", name: "Paixão de Cristo", type: "national", month: 4, isSelected: false, description: "Feriado nacional" },
  { id: "n2025-05", date: "2025-04-21", name: "Tiradentes", type: "national", month: 4, isSelected: false, description: "Feriado nacional" },
  { id: "n2025-06", date: "2025-05-01", name: "Dia do Trabalho", type: "national", month: 5, isSelected: true, description: "Feriado nacional" },
  { id: "n2025-07", date: "2025-06-19", name: "Corpus Christi", type: "national", month: 6, isSelected: false, description: "Feriado nacional" },
  { id: "n2025-08", date: "2025-09-07", name: "Independência do Brasil", type: "national", month: 9, isSelected: false, description: "Feriado nacional" },
  { id: "n2025-09", date: "2025-10-12", name: "Nossa Sr.a Aparecida - Padroeira do Brasil", type: "national", month: 10, isSelected: false, description: "Feriado nacional" },
  { id: "n2025-10", date: "2025-11-02", name: "Finados", type: "national", month: 11, isSelected: false, description: "Feriado nacional" },
  { id: "n2025-11", date: "2025-11-15", name: "Proclamação da República", type: "national", month: 11, isSelected: false, description: "Feriado nacional" },
  { id: "n2025-12", date: "2025-11-20", name: "Dia Nacional de Zumbi e da Consciência Negra", type: "national", month: 11, isSelected: false, description: "Feriado nacional" },
  { id: "n2025-13", date: "2025-12-25", name: "Natal", type: "national", month: 12, isSelected: true, description: "Feriado nacional" }
];

const nationalHolidays2026: Holiday[] = [
  { id: "n2026-01", date: "2026-01-01", name: "Confraternização Universal", type: "national", month: 1, isSelected: false, description: "Feriado nacional" },
  { id: "n2026-02", date: "2026-02-16", name: "Carnaval", type: "national", month: 2, isSelected: false, description: "Feriado nacional" },
  { id: "n2026-03", date: "2026-02-17", name: "Carnaval", type: "national", month: 2, isSelected: false, description: "Feriado nacional" },
  { id: "n2026-04", date: "2026-04-03", name: "Paixão de Cristo", type: "national", month: 4, isSelected: false, description: "Feriado nacional" },
  { id: "n2026-05", date: "2026-04-21", name: "Tiradentes", type: "national", month: 4, isSelected: false, description: "Feriado nacional" },
  { id: "n2026-06", date: "2026-05-01", name: "Dia do Trabalho", type: "national", month: 5, isSelected: false, description: "Feriado nacional" },
  { id: "n2026-07", date: "2026-06-04", name: "Corpus Christi", type: "national", month: 6, isSelected: false, description: "Feriado nacional" },
  { id: "n2026-08", date: "2026-09-07", name: "Independência do Brasil", type: "national", month: 9, isSelected: false, description: "Feriado nacional" },
  { id: "n2026-09", date: "2026-10-12", name: "Nossa Sr.a Aparecida - Padroeira do Brasil", type: "national", month: 10, isSelected: false, description: "Feriado nacional" },
  { id: "n2026-10", date: "2026-11-02", name: "Finados", type: "national", month: 11, isSelected: false, description: "Feriado nacional" },
  { id: "n2026-11", date: "2026-11-15", name: "Proclamação da República", type: "national", month: 11, isSelected: false, description: "Feriado nacional" },
  { id: "n2026-12", date: "2026-11-20", name: "Dia Nacional de Zumbi e da Consciência Negra", type: "national", month: 11, isSelected: false, description: "Feriado nacional" },
  { id: "n2026-13", date: "2026-12-25", name: "Natal", type: "national", month: 12, isSelected: false, description: "Feriado nacional" }
];

const nationalHolidays2027: Holiday[] = [
  { id: "n2027-01", date: "2027-01-01", name: "Confraternização Universal", type: "national", month: 1, isSelected: false, description: "Feriado nacional" },
  { id: "n2027-02", date: "2027-02-08", name: "Carnaval", type: "national", month: 2, isSelected: false, description: "Feriado nacional" },
  { id: "n2027-03", date: "2027-02-09", name: "Carnaval", type: "national", month: 2, isSelected: false, description: "Feriado nacional" },
  { id: "n2027-04", date: "2027-03-26", name: "Paixão de Cristo", type: "national", month: 3, isSelected: false, description: "Feriado nacional" },
  { id: "n2027-05", date: "2027-04-21", name: "Tiradentes", type: "national", month: 4, isSelected: false, description: "Feriado nacional" },
  { id: "n2027-06", date: "2027-05-01", name: "Dia do Trabalho", type: "national", month: 5, isSelected: false, description: "Feriado nacional" },
  { id: "n2027-07", date: "2027-05-27", name: "Corpus Christi", type: "national", month: 5, isSelected: false, description: "Feriado nacional" },
  { id: "n2027-08", date: "2027-09-07", name: "Independência do Brasil", type: "national", month: 9, isSelected: false, description: "Feriado nacional" },
  { id: "n2027-09", date: "2027-10-12", name: "Nossa Sr.a Aparecida - Padroeira do Brasil", type: "national", month: 10, isSelected: false, description: "Feriado nacional" },
  { id: "n2027-10", date: "2027-11-02", name: "Finados", type: "national", month: 11, isSelected: false, description: "Feriado nacional" },
  { id: "n2027-11", date: "2027-11-15", name: "Proclamação da República", type: "national", month: 11, isSelected: false, description: "Feriado nacional" },
  { id: "n2027-12", date: "2027-11-20", name: "Dia Nacional de Zumbi e da Consciência Negra", type: "national", month: 11, isSelected: false, description: "Feriado nacional" },
  { id: "n2027-13", date: "2027-12-25", name: "Natal", type: "national", month: 12, isSelected: false, description: "Feriado nacional" }
];

// Datas Sazonais (selecionadas mais importantes)
const seasonalHolidays2025: Holiday[] = [
  { id: "s2025-01", date: "2025-01-25", name: "Dia da Conversão de São Paulo", type: "seasonal", month: 1, isSelected: false, description: "Data comemorativa religiosa" },
  { id: "s2025-02", date: "2025-02-14", name: "Dia dos Namorados (Valentine's Day)", type: "seasonal", month: 2, isSelected: true, description: "Data comemorativa comercial" },
  { id: "s2025-03", date: "2025-03-08", name: "Dia Internacional da Mulher", type: "seasonal", month: 3, isSelected: true, description: "Data comemorativa mundial" },
  { id: "s2025-04", date: "2025-04-07", name: "Dia Mundial da Saúde", type: "seasonal", month: 4, isSelected: false, description: "Data comemorativa da OMS" },
  { id: "s2025-05", date: "2025-05-11", name: "Dia das Mães", type: "seasonal", month: 5, isSelected: true, description: "Data comemorativa comercial" },
  { id: "s2025-06", date: "2025-06-05", name: "Dia Mundial do Meio Ambiente", type: "seasonal", month: 6, isSelected: true, description: "Data comemorativa ambiental" },
  { id: "s2025-07", date: "2025-07-20", name: "Dia do Amigo", type: "seasonal", month: 7, isSelected: false, description: "Data comemorativa social" },
  { id: "s2025-08", date: "2025-08-11", name: "Dia dos Pais", type: "seasonal", month: 8, isSelected: true, description: "Data comemorativa comercial" },
  { id: "s2025-09", date: "2025-09-21", name: "Dia da Árvore", type: "seasonal", month: 9, isSelected: false, description: "Data comemorativa ambiental" },
  { id: "s2025-10", date: "2025-10-12", name: "Dia das Crianças", type: "seasonal", month: 10, isSelected: true, description: "Data comemorativa comercial" },
  { id: "s2025-11", date: "2025-11-29", name: "Black Friday", type: "seasonal", month: 11, isSelected: true, description: "Data comercial internacional" },
  { id: "s2025-12", date: "2025-12-31", name: "Réveillon", type: "seasonal", month: 12, isSelected: true, description: "Data comemorativa mundial" }
];

const seasonalHolidays2026: Holiday[] = [
  { id: "s2026-01", date: "2026-01-25", name: "Dia da Conversão de São Paulo", type: "seasonal", month: 1, isSelected: false, description: "Data comemorativa religiosa" },
  { id: "s2026-02", date: "2026-02-14", name: "Dia dos Namorados (Valentine's Day)", type: "seasonal", month: 2, isSelected: false, description: "Data comemorativa comercial" },
  { id: "s2026-03", date: "2026-03-08", name: "Dia Internacional da Mulher", type: "seasonal", month: 3, isSelected: false, description: "Data comemorativa mundial" },
  { id: "s2026-04", date: "2026-04-07", name: "Dia Mundial da Saúde", type: "seasonal", month: 4, isSelected: false, description: "Data comemorativa da OMS" },
  { id: "s2026-05", date: "2026-05-10", name: "Dia das Mães", type: "seasonal", month: 5, isSelected: false, description: "Data comemorativa comercial" },
  { id: "s2026-06", date: "2026-06-05", name: "Dia Mundial do Meio Ambiente", type: "seasonal", month: 6, isSelected: false, description: "Data comemorativa ambiental" },
  { id: "s2026-07", date: "2026-07-20", name: "Dia do Amigo", type: "seasonal", month: 7, isSelected: false, description: "Data comemorativa social" },
  { id: "s2026-08", date: "2026-08-09", name: "Dia dos Pais", type: "seasonal", month: 8, isSelected: false, description: "Data comemorativa comercial" },
  { id: "s2026-09", date: "2026-09-21", name: "Dia da Árvore", type: "seasonal", month: 9, isSelected: false, description: "Data comemorativa ambiental" },
  { id: "s2026-10", date: "2026-10-12", name: "Dia das Crianças", type: "seasonal", month: 10, isSelected: false, description: "Data comemorativa comercial" },
  { id: "s2026-11", date: "2026-11-27", name: "Black Friday", type: "seasonal", month: 11, isSelected: false, description: "Data comercial internacional" },
  { id: "s2026-12", date: "2026-12-31", name: "Réveillon", type: "seasonal", month: 12, isSelected: false, description: "Data comemorativa mundial" }
];

const seasonalHolidays2027: Holiday[] = [
  { id: "s2027-01", date: "2027-01-25", name: "Dia da Conversão de São Paulo", type: "seasonal", month: 1, isSelected: false, description: "Data comemorativa religiosa" },
  { id: "s2027-02", date: "2027-02-14", name: "Dia dos Namorados (Valentine's Day)", type: "seasonal", month: 2, isSelected: false, description: "Data comemorativa comercial" },
  { id: "s2027-03", date: "2027-03-08", name: "Dia Internacional da Mulher", type: "seasonal", month: 3, isSelected: false, description: "Data comemorativa mundial" },
  { id: "s2027-04", date: "2027-04-07", name: "Dia Mundial da Saúde", type: "seasonal", month: 4, isSelected: false, description: "Data comemorativa da OMS" },
  { id: "s2027-05", date: "2027-05-09", name: "Dia das Mães", type: "seasonal", month: 5, isSelected: false, description: "Data comemorativa comercial" },
  { id: "s2027-06", date: "2027-06-05", name: "Dia Mundial do Meio Ambiente", type: "seasonal", month: 6, isSelected: false, description: "Data comemorativa ambiental" },
  { id: "s2027-07", date: "2027-07-20", name: "Dia do Amigo", type: "seasonal", month: 7, isSelected: false, description: "Data comemorativa social" },
  { id: "s2027-08", date: "2027-08-08", name: "Dia dos Pais", type: "seasonal", month: 8, isSelected: false, description: "Data comemorativa comercial" },
  { id: "s2027-09", date: "2027-09-21", name: "Dia da Árvore", type: "seasonal", month: 9, isSelected: false, description: "Data comemorativa ambiental" },
  { id: "s2027-10", date: "2027-10-12", name: "Dia das Crianças", type: "seasonal", month: 10, isSelected: false, description: "Data comemorativa comercial" },
  { id: "s2027-11", date: "2027-11-26", name: "Black Friday", type: "seasonal", month: 11, isSelected: false, description: "Data comercial internacional" },
  { id: "s2027-12", date: "2027-12-31", name: "Réveillon", type: "seasonal", month: 12, isSelected: false, description: "Data comemorativa mundial" }
];

const allHolidays = {
  2025: { national: nationalHolidays2025, seasonal: seasonalHolidays2025 },
  2026: { national: nationalHolidays2026, seasonal: seasonalHolidays2026 },
  2027: { national: nationalHolidays2027, seasonal: seasonalHolidays2027 }
};

export function HolidaysView() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [filterType, setFilterType] = useState<"national" | "seasonal">("national");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [holidays, setHolidays] = useState(() => {
    const yearData = allHolidays[2025 as keyof typeof allHolidays];
    return [...yearData.national, ...yearData.seasonal];
  });

  const currentYearData = allHolidays[parseInt(selectedYear) as keyof typeof allHolidays];
  const currentTypeHolidays = currentYearData[filterType];

  const filteredHolidays = currentTypeHolidays.filter(holiday => {
    if (selectedMonth === null) return true;
    return holiday.month === selectedMonth;
  });

  const toggleHoliday = (holidayId: string) => {
    const yearKey = parseInt(selectedYear) as keyof typeof allHolidays;
    
    // Update the original data
    if (filterType === "national") {
      allHolidays[yearKey].national = allHolidays[yearKey].national.map(holiday => 
        holiday.id === holidayId 
          ? { ...holiday, isSelected: !holiday.isSelected }
          : holiday
      );
    } else {
      allHolidays[yearKey].seasonal = allHolidays[yearKey].seasonal.map(holiday => 
        holiday.id === holidayId 
          ? { ...holiday, isSelected: !holiday.isSelected }
          : holiday
      );
    }
    
    // Force re-render
    setHolidays([...allHolidays[yearKey].national, ...allHolidays[yearKey].seasonal]);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "national":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "seasonal":
        return "bg-purple-100 text-purple-700 border-purple-200";
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
      default:
        return "Outros";
    }
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const selectedCount = currentTypeHolidays.filter(h => h.isSelected).length;

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
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2027">2027</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                <Select value={filterType} onValueChange={(value) => setFilterType(value as "national" | "seasonal")}>
                  <SelectTrigger className="w-48 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="national">Feriados Nacionais</SelectItem>
                    <SelectItem value="seasonal">Datas Sazonais</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Mês</label>
                <Select value={selectedMonth?.toString() || "all"} onValueChange={(value) => setSelectedMonth(value === "all" ? null : parseInt(value))}>
                  <SelectTrigger className="w-40 mt-1">
                    <SelectValue placeholder="Todos os meses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os meses</SelectItem>
                    {monthNames.map((month, index) => (
                      <SelectItem key={index + 1} value={(index + 1).toString()}>
                        {month}
                      </SelectItem>
                    ))}
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