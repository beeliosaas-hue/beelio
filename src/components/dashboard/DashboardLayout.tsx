import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DianaChat } from "@/components/dashboard/DianaChat";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen w-full bg-subtle-gradient">
        {/* Header */}
        <DashboardHeader />
        
        <div className="flex w-full">
          {/* Sidebar */}
          <DashboardSidebar />
          
          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
        
        {/* Diana Chat Float */}
        <DianaChat />
      </div>
    </SidebarProvider>
  );
}