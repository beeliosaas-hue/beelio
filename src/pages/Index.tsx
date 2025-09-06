import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { CalendarView } from "@/components/dashboard/CalendarView";
import { ReportsWidget } from "@/components/dashboard/ReportsWidget";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do seu calendário de marketing inteligente
          </p>
        </div>
        
        {/* Stats Cards */}
        <StatsCards />
        
        {/* Mini Calendar View */}
        <CalendarView />
        
        {/* Reports Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            Relatórios Rápidos
          </h2>
          <ReportsWidget />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
