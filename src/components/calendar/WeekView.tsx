import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Instagram, Facebook, Linkedin, Youtube, Music } from "lucide-react";

interface WeekViewProps {
  currentDate: Date;
  events: any[];
}

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

export function WeekView({ currentDate, events }: WeekViewProps) {
  // Calcular início da semana (domingo)
  const startOfWeek = new Date(currentDate);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - day);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => event.date === date.getDate());
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="grid grid-cols-7 gap-px bg-muted">
          {weekDays.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                className={cn(
                  "bg-background min-h-[400px] p-3",
                  isToday && "bg-accent/30"
                )}
              >
                <div className="flex flex-col items-center mb-4 pb-2 border-b">
                  <span className="text-xs text-muted-foreground">
                    {daysOfWeek[index]}
                  </span>
                  <span className={cn(
                    "text-2xl font-bold",
                    isToday && "text-primary"
                  )}>
                    {date.getDate()}
                  </span>
                </div>

                <div className="space-y-2">
                  {dayEvents.map((event, eventIndex) => (
                    <div key={eventIndex} className="p-2 bg-card border rounded-lg">
                      {event.type === 'commemorative' && (
                        <div className="text-xs">
                          <div className="font-medium text-orange-600">
                            🎉 {event.data.name}
                          </div>
                        </div>
                      )}
                      {event.type === 'post' && (
                        <div className="text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              {getSocialIcon(event.data.networks[0])}
                              <span className="font-medium">{event.data.scheduledTime}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {event.data.status === 'scheduled' ? 'Agendado' : 'Rascunho'}
                            </Badge>
                          </div>
                          <div className="font-medium">{event.data.title}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
