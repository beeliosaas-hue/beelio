import { CalendarView } from "@/components/dashboard/CalendarView";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const Calendar = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Calendário Inteligente</h1>
          <p className="text-muted-foreground">
            Gerencie todos os seus posts e campanhas em um só lugar
          </p>
        </div>
        <CalendarView />
      </div>
    </DashboardLayout>
  );
};

export default Calendar;