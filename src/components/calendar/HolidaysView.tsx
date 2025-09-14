import { useState } from "react";
import { Calendar, Plus, Heart, Briefcase, GraduationCap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const years = ["2025", "2026", "2027"];

const nationalHolidays = {
  "2025": [
    { date: "1º de Janeiro", name: "Confraternização Universal", month: "Janeiro" },
    { date: "3 de Março", name: "Carnaval", month: "Março" },
    { date: "4 de Março", name: "Carnaval", month: "Março" },
    { date: "18 de Abril", name: "Paixão de Cristo", month: "Abril" },
    { date: "21 de Abril", name: "Tiradentes", month: "Abril" },
    { date: "1º de Maio", name: "Dia do Trabalho", month: "Maio" },
    { date: "19 de Junho", name: "Corpus Christi", month: "Junho" },
    { date: "7 de Setembro", name: "Independência do Brasil", month: "Setembro" },
    { date: "12 de Outubro", name: "Nossa Sra. Aparecida", month: "Outubro" },
    { date: "2 de Novembro", name: "Finados", month: "Novembro" },
    { date: "15 de Novembro", name: "Proclamação da República", month: "Novembro" },
    { date: "20 de Novembro", name: "Consciência Negra", month: "Novembro" },
    { date: "25 de Dezembro", name: "Natal", month: "Dezembro" }
  ],
  "2026": [
    { date: "1º de Janeiro", name: "Confraternização Universal", month: "Janeiro" },
    { date: "16 de Fevereiro", name: "Carnaval", month: "Fevereiro" },
    { date: "17 de Fevereiro", name: "Carnaval", month: "Fevereiro" },
    { date: "3 de Abril", name: "Paixão de Cristo", month: "Abril" },
    { date: "21 de Abril", name: "Tiradentes", month: "Abril" },
    { date: "1º de Maio", name: "Dia do Trabalho", month: "Maio" },
    { date: "4 de Junho", name: "Corpus Christi", month: "Junho" },
    { date: "7 de Setembro", name: "Independência do Brasil", month: "Setembro" },
    { date: "12 de Outubro", name: "Nossa Sra. Aparecida", month: "Outubro" },
    { date: "2 de Novembro", name: "Finados", month: "Novembro" },
    { date: "15 de Novembro", name: "Proclamação da República", month: "Novembro" },
    { date: "20 de Novembro", name: "Consciência Negra", month: "Novembro" },
    { date: "25 de Dezembro", name: "Natal", month: "Dezembro" }
  ],
  "2027": [
    { date: "1º de Janeiro", name: "Confraternização Universal", month: "Janeiro" },
    { date: "8 de Fevereiro", name: "Carnaval", month: "Fevereiro" },
    { date: "9 de Fevereiro", name: "Carnaval", month: "Fevereiro" },
    { date: "26 de Março", name: "Paixão de Cristo", month: "Março" },
    { date: "21 de Abril", name: "Tiradentes", month: "Abril" },
    { date: "1º de Maio", name: "Dia do Trabalho", month: "Maio" },
    { date: "27 de Maio", name: "Corpus Christi", month: "Maio" },
    { date: "7 de Setembro", name: "Independência do Brasil", month: "Setembro" },
    { date: "12 de Outubro", name: "Nossa Sra. Aparecida", month: "Outubro" },
    { date: "2 de Novembro", name: "Finados", month: "Novembro" },
    { date: "15 de Novembro", name: "Proclamação da República", month: "Novembro" },
    { date: "20 de Novembro", name: "Consciência Negra", month: "Novembro" },
    { date: "25 de Dezembro", name: "Natal", month: "Dezembro" }
  ]
};

const seasonalDates = {
  "2025": [
    { date: "4 de Janeiro", name: "Dia Mundial do Braille", month: "Janeiro", icon: "👁️" },
    { date: "25 de Janeiro", name: "Dia do Carteiro", month: "Janeiro", icon: "📮" },
    { date: "31 de Janeiro", name: "Dia do Mágico", month: "Janeiro", icon: "🎩" },
    { date: "14 de Fevereiro", name: "Dia dos Namorados (Internacional)", month: "Fevereiro", icon: "❤️" },
    { date: "20 de Fevereiro", name: "Dia Mundial da Justiça Social", month: "Fevereiro", icon: "⚖️" },
    { date: "8 de Março", name: "Dia Internacional da Mulher", month: "Março", icon: "👩" },
    { date: "22 de Março", name: "Dia Mundial da Água", month: "Março", icon: "💧" },
    { date: "7 de Abril", name: "Dia Mundial da Saúde", month: "Abril", icon: "🏥" },
    { date: "23 de Abril", name: "Dia Mundial do Livro", month: "Abril", icon: "📚" },
    { date: "12 de Junho", name: "Dia dos Namorados", month: "Junho", icon: "💕" },
    { date: "5 de Junho", name: "Dia Mundial do Meio Ambiente", month: "Junho", icon: "🌱" },
    { date: "11 de Agosto", name: "Dia do Advogado", month: "Agosto", icon: "⚖️" },
    { date: "22 de Agosto", name: "Dia do Folclore", month: "Agosto", icon: "🎭" },
    { date: "5 de Setembro", name: "Dia da Amazônia", month: "Setembro", icon: "🌳" },
    { date: "1º de Outubro", name: "Dia do Idoso", month: "Outubro", icon: "👴" },
    { date: "31 de Outubro", name: "Halloween", month: "Outubro", icon: "🎃" },
    { date: "19 de Novembro", name: "Dia da Bandeira", month: "Novembro", icon: "🇧🇷" },
    { date: "24 de Dezembro", name: "Véspera de Natal", month: "Dezembro", icon: "🎄" }
  ],
  "2026": [
    { date: "4 de Janeiro", name: "Dia Mundial do Braille", month: "Janeiro", icon: "👁️" },
    { date: "25 de Janeiro", name: "Dia do Carteiro", month: "Janeiro", icon: "📮" },
    { date: "31 de Janeiro", name: "Dia do Mágico", month: "Janeiro", icon: "🎩" },
    { date: "14 de Fevereiro", name: "Dia dos Namorados (Internacional)", month: "Fevereiro", icon: "❤️" },
    { date: "20 de Fevereiro", name: "Dia Mundial da Justiça Social", month: "Fevereiro", icon: "⚖️" },
    { date: "8 de Março", name: "Dia Internacional da Mulher", month: "Março", icon: "👩" },
    { date: "22 de Março", name: "Dia Mundial da Água", month: "Março", icon: "💧" },
    { date: "7 de Abril", name: "Dia Mundial da Saúde", month: "Abril", icon: "🏥" },
    { date: "23 de Abril", name: "Dia Mundial do Livro", month: "Abril", icon: "📚" },
    { date: "12 de Junho", name: "Dia dos Namorados", month: "Junho", icon: "💕" },
    { date: "5 de Junho", name: "Dia Mundial do Meio Ambiente", month: "Junho", icon: "🌱" },
    { date: "11 de Agosto", name: "Dia do Advogado", month: "Agosto", icon: "⚖️" },
    { date: "22 de Agosto", name: "Dia do Folclore", month: "Agosto", icon: "🎭" },
    { date: "5 de Setembro", name: "Dia da Amazônia", month: "Setembro", icon: "🌳" },
    { date: "1º de Outubro", name: "Dia do Idoso", month: "Outubro", icon: "👴" },
    { date: "31 de Outubro", name: "Halloween", month: "Outubro", icon: "🎃" },
    { date: "19 de Novembro", name: "Dia da Bandeira", month: "Novembro", icon: "🇧🇷" },
    { date: "24 de Dezembro", name: "Véspera de Natal", month: "Dezembro", icon: "🎄" }
  ],
  "2027": [
    { date: "4 de Janeiro", name: "Dia Mundial do Braille", month: "Janeiro", icon: "👁️" },
    { date: "25 de Janeiro", name: "Dia do Carteiro", month: "Janeiro", icon: "📮" },
    { date: "31 de Janeiro", name: "Dia do Mágico", month: "Janeiro", icon: "🎩" },
    { date: "14 de Fevereiro", name: "Dia dos Namorados (Internacional)", month: "Fevereiro", icon: "❤️" },
    { date: "20 de Fevereiro", name: "Dia Mundial da Justiça Social", month: "Fevereiro", icon: "⚖️" },
    { date: "8 de Março", name: "Dia Internacional da Mulher", month: "Março", icon: "👩" },
    { date: "22 de Março", name: "Dia Mundial da Água", month: "Março", icon: "💧" },
    { date: "7 de Abril", name: "Dia Mundial da Saúde", month: "Abril", icon: "🏥" },
    { date: "23 de Abril", name: "Dia Mundial do Livro", month: "Abril", icon: "📚" },
    { date: "12 de Junho", name: "Dia dos Namorados", month: "Junho", icon: "💕" },
    { date: "5 de Junho", name: "Dia Mundial do Meio Ambiente", month: "Junho", icon: "🌱" },
    { date: "11 de Agosto", name: "Dia do Advogado", month: "Agosto", icon: "⚖️" },
    { date: "22 de Agosto", name: "Dia do Folclore", month: "Agosto", icon: "🎭" },
    { date: "5 de Setembro", name: "Dia da Amazônia", month: "Setembro", icon: "🌳" },
    { date: "1º de Outubro", name: "Dia do Idoso", month: "Outubro", icon: "👴" },
    { date: "31 de Outubro", name: "Halloween", month: "Outubro", icon: "🎃" },
    { date: "19 de Novembro", name: "Dia da Bandeira", month: "Novembro", icon: "🇧🇷" },
    { date: "24 de Dezembro", name: "Véspera de Natal", month: "Dezembro", icon: "🎄" }
  ]
};

export function HolidaysView() {
  const [selectedYear, setSelectedYear] = useState("2025");

  const getHolidaysByMonth = (holidays: any[]) => {
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                   "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    
    return months.map(month => ({
      month,
      holidays: holidays.filter(holiday => holiday.month === month)
    })).filter(monthGroup => monthGroup.holidays.length > 0);
  };

  const currentHolidays = nationalHolidays[selectedYear as keyof typeof nationalHolidays] || [];
  const currentSeasonalDates = seasonalDates[selectedYear as keyof typeof seasonalDates] || [];

  return (
    <div className="space-y-6">
      {/* Year selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Feriados e Datas Comemorativas</h2>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feriados Nacionais */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center py-4 border-b">Feriados Nacionais</h3>
          {getHolidaysByMonth(currentHolidays).map((monthGroup, index) => (
            <div key={index} className="space-y-3">
              <h4 className="text-lg font-medium text-warning flex items-center gap-2">
                <span className="w-2 h-2 bg-warning rounded-full"></span>
                {monthGroup.month} {selectedYear}
              </h4>
              <div className="space-y-2">
                {monthGroup.holidays.map((holiday, holidayIndex) => (
                  <div
                    key={holidayIndex}
                    className="bg-purple-50 border border-purple-100 rounded-lg p-3 hover:bg-purple-100/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <h5 className="font-medium text-sm">{holiday.name}</h5>
                          <p className="text-xs text-muted-foreground">{holiday.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-purple-600 border-purple-200 text-xs">
                          Sazonal
                        </Badge>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Datas Sazonais */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center py-4 border-b">Datas Sazonais</h3>
          {getHolidaysByMonth(currentSeasonalDates).map((monthGroup, index) => (
            <div key={index} className="space-y-3">
              <h4 className="text-lg font-medium text-warning flex items-center gap-2">
                <span className="w-2 h-2 bg-warning rounded-full"></span>
                {monthGroup.month} {selectedYear}
              </h4>
              <div className="space-y-2">
                {monthGroup.holidays.map((date, dateIndex) => (
                  <div
                    key={dateIndex}
                    className="bg-purple-50 border border-purple-100 rounded-lg p-3 hover:bg-purple-100/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm">
                          {date.icon}
                        </div>
                        <div>
                          <h5 className="font-medium text-sm">{date.name}</h5>
                          <p className="text-xs text-muted-foreground">{date.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-purple-600 border-purple-200 text-xs">
                          Sazonal
                        </Badge>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}