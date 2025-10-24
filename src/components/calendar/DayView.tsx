import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Instagram, Facebook, Linkedin, Youtube, Music, Clock } from "lucide-react";

interface DayViewProps {
  currentDate: Date;
  events: any[];
}

const getSocialIcon = (network: string) => {
  switch (network) {
    case "facebook": return <Facebook className="h-4 w-4" />;
    case "instagram": return <Instagram className="h-4 w-4" />;
    case "linkedin": return <Linkedin className="h-4 w-4" />;
    case "youtube": return <Youtube className="h-4 w-4" />;
    case "tiktok": return <Music className="h-4 w-4" />;
    default: return <Instagram className="h-4 w-4" />;
  }
};

export function DayView({ currentDate, events }: DayViewProps) {
  const dayEvents = events.filter(event => event.date === currentDate.getDate());

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6 pb-4 border-b">
          <h2 className="text-2xl font-bold">
            {currentDate.toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {dayEvents.length} {dayEvents.length === 1 ? 'evento agendado' : 'eventos agendados'}
          </p>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {hours.map((hour) => {
            const hourEvents = dayEvents.filter(event => {
              if (event.type === 'post' && event.data.scheduledTime) {
                const eventHour = parseInt(event.data.scheduledTime.split(':')[0]);
                return eventHour === hour;
              }
              return false;
            });

            return (
              <div key={hour} className="flex gap-4">
                <div className="w-20 flex-shrink-0 pt-1">
                  <span className="text-sm text-muted-foreground font-medium">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                </div>
                
                <div className="flex-1 border-l-2 border-muted pl-4 pb-4">
                  {hourEvents.length > 0 ? (
                    <div className="space-y-2">
                      {hourEvents.map((event, index) => (
                        <Card key={index} className="p-4 border-l-4 border-primary">
                          {event.type === 'post' && (
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1 flex-1">
                                  <h4 className="font-semibold text-base">{event.data.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {event.data.content}
                                  </p>
                                </div>
                                <Badge 
                                  variant={event.data.status === 'scheduled' ? 'default' : 'secondary'}
                                  className="ml-2"
                                >
                                  {event.data.status === 'scheduled' ? 'Agendado' : 'Rascunho'}
                                </Badge>
                              </div>

                              <div className="flex items-center justify-between pt-3 border-t">
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    {event.data.scheduledTime}
                                  </span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-muted-foreground">Redes:</span>
                                  {event.data.networks.map((network, netIndex) => (
                                    <div key={netIndex} className="flex items-center">
                                      {getSocialIcon(network)}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="h-8" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {dayEvents.filter(e => e.type === 'commemorative').length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3">Datas Comemorativas</h3>
            <div className="space-y-2">
              {dayEvents
                .filter(e => e.type === 'commemorative')
                .map((event, index) => (
                  <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="font-medium text-orange-800">
                      🎉 {event.data.name}
                    </div>
                    {event.data.description && (
                      <div className="text-sm text-orange-600 mt-1">
                        {event.data.description}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
