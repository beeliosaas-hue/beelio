import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { CalendarView } from "@/components/dashboard/CalendarView";
import { DianaChat } from "@/components/dashboard/DianaChat";
import { ReportsWidget } from "@/components/dashboard/ReportsWidget";

const Index = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen w-full bg-subtle-gradient">
        {/* Header */}
        <DashboardHeader />
        
        <div className="flex w-full">
          {/* Sidebar */}
          <DashboardSidebar />
          
          {/* Main Content */}
          <main className="flex-1 p-6 space-y-6">
            {/* Stats Cards */}
            <StatsCards />
            
            {/* Calendar View */}
            <CalendarView />
            
            {/* Reports Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                Relatórios Rápidos
              </h2>
              <ReportsWidget />
            </div>
          </main>
        </div>
        
        {/* Diana Chat Float */}
        <DianaChat />
      </div>
    </SidebarProvider>
  );
};

export default Index;
