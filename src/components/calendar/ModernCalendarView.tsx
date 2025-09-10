import { useState } from "react";
import { ChevronLeft, ChevronRight, Filter, Plus, MoreHorizontal, Clock, Facebook, Instagram, Linkedin, Youtube, PartyPopper, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  content: string;
  scheduledTime: string;
  networks: string[];
  status: "scheduled" | "published" | "draft";
  thumbnail?: string;
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
    date: 15,
    type: "commemorative",
    data: {
      title: "Dia do Consumidor",
      description: "Data comemorativa nacional"
    }
  },
  {
    date: 18,
    type: "trend",
    data: {
      title: "Marketing Digital em Alta",
      description: "Tendência: +45% de engajamento"
    }
  },
  {
    date: 20,
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

interface ModernCalendarViewProps {
  onCreatePost: () => void;
}

export function ModernCalendarView({ onCreatePost }: ModernCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const currentMonth = currentDate.toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });

  const generateCalendarDays = () => {
    const days = [];
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const days = generateCalendarDays();
  const today = new Date().getDate();

  const getEventsForDay = (day: number): CalendarEvent[] => {
    return mockEvents.filter(event => event.date === day);
  };

  const getSocialIcon = (network: string) => {
    switch (network) {
      case "facebook": return Facebook;
      case "instagram": return Instagram;
      case "linkedin": return Linkedin;
      case "youtube": return Youtube;
      default: return Instagram;
    }
  };

  const getSocialColor = (network: string) => {
    switch (network) {
      case "facebook": return "text-blue-600 border-blue-200";
      case "instagram": return "text-purple-600 border-purple-200";
      case "linkedin": return "text-blue-700 border-blue-200";
      case "youtube": return "text-red-600 border-red-200";
      default: return "text-gray-600 border-gray-200";
    }
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

  return (
    <Card className="shadow-elevation">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
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
            <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium text-sm px-4 capitalize">{currentMonth}</span>
            <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
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
                  "min-h-[140px] p-2 border border-border bg-card hover:bg-accent/30 transition-smooth cursor-pointer",
                  day ? "hover:shadow-soft" : "bg-muted/30",
                  isToday && "ring-2 ring-primary bg-primary/5"
                )}
              >
                {day && (
                  <>
                    <div className={cn(
                      "text-sm font-medium mb-2 flex items-center justify-between",
                      isToday ? "text-primary" : "text-foreground"
                    )}>
                      <span>{day}</span>
                      {events.length > 0 && (
                        <Badge variant="outline" className="text-xs h-5">
                          {events.length}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {events.slice(0, 3).map((event, eventIndex) => {
                        if (event.type === "commemorative") {
                          return (
                            <div
                              key={eventIndex}
                              className="text-xs p-1.5 rounded border bg-purple-50 text-purple-700 border-purple-200 flex items-center space-x-1"
                            >
                              <PartyPopper className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{event.data.title}</span>
                            </div>
                          );
                        }
                        
                        if (event.type === "trend") {
                          return (
                            <div
                              key={eventIndex}
                              className="text-xs p-1.5 rounded border bg-orange-50 text-orange-700 border-orange-200 flex items-center space-x-1"
                            >
                              <Flame className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{event.data.title}</span>
                            </div>
                          );
                        }
                        
                        if (event.type === "post") {
                          const post = event.data as Post;
                          return (
                            <Popover key={eventIndex}>
                              <PopoverTrigger asChild>
                                <div className="text-xs p-1.5 rounded border bg-primary/10 text-primary border-primary/30 cursor-pointer hover:bg-primary/20 transition-colors">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3" />
                                      <span className="font-medium">{post.scheduledTime}</span>
                                    </div>
                                    <Badge 
                                      variant={post.status === "scheduled" ? "default" : post.status === "published" ? "secondary" : "outline"}
                                      className="text-xs h-4"
                                    >
                                      {post.status === "scheduled" ? "Agendado" : post.status === "published" ? "Publicado" : "Rascunho"}
                                    </Badge>
                                  </div>
                                  
                                  <div className="truncate font-medium mb-1">{post.title}</div>
                                  
                                  <div className="flex items-center space-x-1">
                                    {post.networks.slice(0, 3).map((network, idx) => {
                                      const Icon = getSocialIcon(network);
                                      return (
                                        <Icon 
                                          key={idx} 
                                          className={cn("h-3 w-3", getSocialColor(network).split(' ')[0])} 
                                        />
                                      );
                                    })}
                                    {post.networks.length > 3 && (
                                      <span className="text-xs">+{post.networks.length - 3}</span>
                                    )}
                                  </div>
                                </div>
                              </PopoverTrigger>
                              
                              <PopoverContent className="w-80" align="start">
                                <div className="space-y-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-semibold">{post.title}</h4>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {post.content.slice(0, 100)}...
                                      </p>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{post.scheduledTime}</span>
                                    <Badge variant="outline">{post.type}</Badge>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-2">
                                    {post.networks.map((network, idx) => {
                                      const Icon = getSocialIcon(network);
                                      return (
                                        <div key={idx} className={cn("flex items-center space-x-1 text-xs px-2 py-1 rounded border", getSocialColor(network))}>
                                          <Icon className="h-3 w-3" />
                                          <span className="capitalize">{network}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  
                                  <div className="flex space-x-2">
                                    <Button size="sm" variant="outline" className="flex-1">
                                      Editar
                                    </Button>
                                    <Button size="sm" variant="outline" className="flex-1">
                                      Duplicar
                                    </Button>
                                    <Button size="sm" variant="destructive">
                                      Excluir
                                    </Button>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          );
                        }
                        
                        return null;
                      })}
                      
                      {events.length > 3 && (
                        <div className="text-xs text-muted-foreground p-1 text-center">
                          +{events.length - 3} mais
                        </div>
                      )}
                      
                      {events.length === 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onCreatePost}
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
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Posts Agendados</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}