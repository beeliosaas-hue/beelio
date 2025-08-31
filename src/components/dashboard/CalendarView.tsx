import { useState } from "react";
import { ChevronLeft, ChevronRight, Filter, Plus, PartyPopper, Flame, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const mockEvents = [
  {
    date: 15,
    type: "commemorative",
    title: "Dia do Consumidor",
    icon: PartyPopper,
    color: "bg-purple-500/20 text-purple-700 border-purple-200",
  },
  {
    date: 18,
    type: "trend",
    title: "Marketing Digital",
    icon: Flame,
    color: "bg-orange-500/20 text-orange-700 border-orange-200",
  },
  {
    date: 20,
    type: "post",
    title: "Post sobre Sustentabilidade",
    icon: Image,
    color: "bg-primary/20 text-primary border-primary/30",
  },
  {
    date: 22,
    type: "post",
    title: "Dicas de Produtividade",
    icon: Image,
    color: "bg-primary/20 text-primary border-primary/30",
  },
];

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const currentMonth = "Novembro 2024";

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");

  // Generate calendar days (simplified)
  const generateCalendarDays = () => {
    const days = [];
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const days = generateCalendarDays();
  const today = new Date().getDate();

  const getEventsForDay = (day: number) => {
    return mockEvents.filter(event => event.date === day);
  };

  return (
    <Card className="shadow-elevation">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardTitle className="text-xl font-semibold">
              Calendário Inteligente
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("month")}
              >
                Mês
              </Button>
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("week")}
              >
                Semana
              </Button>
              <Button
                variant={viewMode === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("day")}
              >
                Dia
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium text-sm px-4">{currentMonth}</span>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {/* Days of week header */}
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-muted-foreground border-b"
            >
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((day, index) => {
            const events = day ? getEventsForDay(day) : [];
            const isToday = day === today;
            
            return (
              <div
                key={index}
                className={cn(
                  "min-h-[120px] p-2 border border-border bg-card hover:bg-accent/30 transition-smooth cursor-pointer",
                  day ? "hover:shadow-soft" : "bg-muted/30",
                  isToday && "ring-2 ring-primary bg-primary/5"
                )}
              >
                {day && (
                  <>
                    <div className={cn(
                      "text-sm font-medium mb-2",
                      isToday ? "text-primary" : "text-foreground"
                    )}>
                      {day}
                    </div>
                    
                    <div className="space-y-1">
                      {events.slice(0, 2).map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className={cn(
                            "text-xs p-1.5 rounded border flex items-center space-x-1",
                            event.color
                          )}
                        >
                          <event.icon className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{event.title}</span>
                        </div>
                      ))}
                      
                      {events.length > 2 && (
                        <div className="text-xs text-muted-foreground p-1">
                          +{events.length - 2} mais
                        </div>
                      )}
                      
                      {events.length === 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-8 text-xs opacity-0 hover:opacity-100 transition-smooth"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Adicionar
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <PartyPopper className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-muted-foreground">Datas Comemorativas</span>
          </div>
          <div className="flex items-center space-x-2">
            <Flame className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-muted-foreground">Tendências</span>
          </div>
          <div className="flex items-center space-x-2">
            <Image className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Posts Planejados</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}