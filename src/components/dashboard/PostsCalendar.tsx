import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const daysOfWeek = ["D", "S", "T", "Q", "Q", "S", "S"];

export function PostsCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8)); // September 2025

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

  const days = generateCalendarDays();
  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <Card className="border border-gray-200 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            📅 Posts Agendados
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
              {monthName}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Days of week header */}
          {daysOfWeek.map((day, index) => (
            <div
              key={index}
              className="p-2 text-center text-xs font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((day, index) => {
            const isHighlighted = day === 14; // Highlight day 14 as in the image
            
            return (
              <div
                key={index}
                className={cn(
                  "aspect-square p-1 text-center text-sm border border-gray-100",
                  day ? "hover:bg-gray-50 cursor-pointer" : "",
                  isHighlighted && "bg-yellow-100 border-yellow-200"
                )}
              >
                {day && (
                  <div className={cn(
                    "w-full h-full flex items-center justify-center rounded",
                    isHighlighted ? "bg-yellow-200 text-yellow-800 font-medium" : "text-gray-700"
                  )}>
                    {day}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-600">Agendado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-600">Aprovado</span>
          </div>
        </div>
        
        <p className="text-center text-xs text-gray-500 mt-3">
          Clique no calendário lateral para detalhes
        </p>
      </CardContent>
    </Card>
  );
}