import { useState } from "react";
import { ChevronLeft, ChevronRight, Instagram, Facebook, Linkedin, Youtube, Music, MoreHorizontal } from "lucide-react";
import { WeekView } from "./WeekView";
import { DayView } from "./DayView";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  content: string;
  scheduledTime: string;
  networks: string[];
  status: "scheduled" | "published" | "draft" | "pending";
  type: "post" | "story" | "reel";
}

interface CalendarEvent {
  date: number;
  type: "commemorative" | "trend" | "post";
  data: any;
}

const mockPosts: Post[] = [
  {
    id: "1",
    title: "Dicas de Produtividade",
    content: "5 dicas essenciais para aumentar sua produtividade no trabalho...",
    scheduledTime: "09:00",
    networks: ["instagram", "linkedin"],
    status: "scheduled",
    type: "post"
  },
  {
    id: "2", 
    title: "Stories sobre Sustentabilidade",
    content: "Como nossa empresa está contribuindo para um mundo mais sustentável...",
    scheduledTime: "14:30",
    networks: ["instagram"],
    status: "draft",
    type: "story"
  }
];

const mockEvents: CalendarEvent[] = [
  {
    date: 7,
    type: "commemorative",
    data: {
      name: "Independência do Brasil",
      description: "7 de Setembro"
    }
  },
  {
    date: 14,
    type: "post",
    data: mockPosts[0]
  },
  {
    date: 22,
    type: "post",
    data: mockPosts[1]
  }
];

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const getSocialIcon = (network: string) => {
  switch (network) {
    case "facebook": return <Facebook className="h-3 w-3" />;
    case "instagram": return <Instagram className="h-3 w-3" />;
    case "linkedin": return <Linkedin className="h-3 w-3" />;
    case "youtube": return <Youtube className="h-3 w-3" />;
    case "tiktok": return <Music className="h-3 w-3" />;
    default: return <Instagram className="h-3 w-3" />;
  }
};

const getSocialColor = (network: string) => {
  switch (network) {
    case "facebook": return "bg-blue-100 text-blue-800 border-blue-200";
    case "instagram": return "bg-purple-100 text-purple-800 border-purple-200";
    case "linkedin": return "bg-blue-100 text-blue-800 border-blue-200";
    case "youtube": return "bg-red-100 text-red-800 border-red-200";
    case "tiktok": return "bg-slate-100 text-slate-800 border-slate-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

interface ModernCalendarViewProps {
  onCreatePost: () => void;
}

export function ModernCalendarView({ onCreatePost }: ModernCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8)); // September 2025
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [statusFilter, setStatusFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

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

  const calendarDays = generateCalendarDays();

  const getEventsForDay = (day: number): CalendarEvent[] => {
    return mockEvents.filter(event => event.date === day);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarContent = () => {
    if (viewMode === "week") {
      return <WeekView currentDate={currentDate} events={mockEvents} />;
    }
    
    if (viewMode === "day") {
      return <DayView currentDate={currentDate} events={mockEvents} />;
    }

    // Monthly view
    return (
      <Card className="w-full">
        <CardContent className="p-0">
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-muted">
            {/* Days of week header */}
            {daysOfWeek.map((day, index) => (
              <div
                key={index}
                className="bg-background p-3 text-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((day, index) => {
              const isCurrentMonth = day !== null;
              const dayEvents = isCurrentMonth ? getEventsForDay(day) : [];
              const isHighlighted = day === 7;
              const isSelected = day === 14;
              
              return (
                <div
                  key={index}
                  className={cn(
                    "bg-background min-h-[120px] p-2 border-r border-b border-muted",
                    !isCurrentMonth && "bg-muted/30",
                    isHighlighted && "bg-red-50 border-red-200",
                    isSelected && "bg-yellow-100 border-yellow-300"
                  )}
                >
                  {isCurrentMonth && (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className={cn(
                          "text-sm font-medium",
                          isHighlighted && "text-red-600 font-bold",
                          isSelected && "text-yellow-800 font-bold"
                        )}>
                          {day}
                        </span>
                        {dayEvents.length > 0 && (
                          <Badge variant="secondary" className="h-5 text-xs">
                            {dayEvents.length}
                          </Badge>
                        )}
                      </div>
                      
                      {isHighlighted && (
                        <div className="text-xs text-red-600 font-medium mb-1">
                          Independência do Brasil
                        </div>
                      )}
                      
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event, eventIndex) => (
                          <div key={eventIndex}>
                            {event.type === 'commemorative' && (
                              <div className="bg-orange-100 text-orange-800 text-xs p-1 rounded truncate">
                                🎉 {event.data.name}
                              </div>
                            )}
                            {event.type === 'trend' && (
                              <div className="bg-purple-100 text-purple-800 text-xs p-1 rounded truncate">
                                📈 {event.data.name}
                              </div>
                            )}
                            {event.type === 'post' && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <div className="cursor-pointer">
                                    <div className={cn(
                                      "text-xs p-1 rounded border-l-2 truncate",
                                      getSocialColor(event.data.networks[0])
                                    )}>
                                      <div className="flex items-center space-x-1">
                                        {getSocialIcon(event.data.networks[0])}
                                        <span>{event.data.scheduledTime}</span>
                                      </div>
                                      <div className="font-medium truncate">
                                        {event.data.title}
                                      </div>
                                    </div>
                                  </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-semibold">{event.data.title}</h4>
                                      <Badge variant={
                                        event.data.status === 'published' ? 'default' :
                                        event.data.status === 'scheduled' ? 'secondary' :
                                        event.data.status === 'pending' ? 'destructive' : 'outline'
                                      }>
                                        {event.data.status === 'published' ? 'Publicado' :
                                         event.data.status === 'scheduled' ? 'Agendado' :
                                         event.data.status === 'pending' ? 'Pendente' : 'Rascunho'}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {event.data.content}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-xs text-muted-foreground">Redes:</span>
                                      {event.data.networks.map((network, netIndex) => (
                                        <div key={netIndex} className="flex items-center">
                                          {getSocialIcon(network)}
                                        </div>
                                      ))}
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t">
                                      <span className="text-xs text-muted-foreground">
                                        {event.data.scheduledTime}
                                      </span>
                                      <Button size="sm" variant="outline">
                                        <MoreHorizontal className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{dayEvents.length - 2} mais
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="p-4 border-t bg-muted/20">
            <div className="flex items-center justify-center space-x-6 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-200 border-l-2 border-orange-500 rounded-sm"></div>
                <span>Datas Comemorativas</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-200 border-l-2 border-purple-500 rounded-sm"></div>
                <span>Tendências</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-200 border-l-2 border-blue-500 rounded-sm"></div>
                <span>Posts Agendados</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filter controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold min-w-[200px] text-center">
            {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Todos os Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
              <SelectItem value="scheduled">Agendado</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="pending">Aguardando Aprovação</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Todos os Canais" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Canais</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
            </SelectContent>
          </Select>
          
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "month" | "week" | "day")}>
            <TabsList>
              <TabsTrigger value="month">Mensal</TabsTrigger>
              <TabsTrigger value="week">Semanal</TabsTrigger>
              <TabsTrigger value="day">Diário</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Calendar */}
      {renderCalendarContent()}
    </div>
  );
}