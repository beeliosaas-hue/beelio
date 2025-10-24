import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Calendar,
  FileText,
  Palette,
  FolderOpen,
  MessageCircle,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Lightbulb,
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Calendário",
    url: "/calendario",
    icon: Calendar,
  },
  {
    title: "Briefing",
    url: "/briefing",
    icon: FileText,
  },
  {
    title: "Branding",
    url: "/branding",
    icon: Palette,
  },
  {
    title: "Tendências",
    url: "/tendencias",
    icon: TrendingUp,
  },
  {
    title: "Planner IA",
    url: "/planner",
    icon: Lightbulb,
  },
  {
    title: "Diana (Chat IA)",
    url: "/diana",
    icon: MessageCircle,
  },
  {
    title: "Biblioteca",
    url: "/biblioteca",
    icon: FolderOpen,
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: BarChart3,
  },
  {
    title: "Suporte 24/7",
    url: "/suporte",
    icon: Headphones,
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar
      className={cn(
        "border-r border-sidebar-border bg-sidebar transition-smooth",
        isCollapsed ? "w-16" : "w-64"
      )}
      collapsible="icon"
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 hover:bg-sidebar-accent"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <SidebarContent>
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">
              Menu Principal
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "transition-smooth rounded-lg",
                      isActive(item.url)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-soft"
                        : "hover:bg-sidebar-accent/50"
                    )}
                  >
                    <NavLink to={item.url} className="flex items-center">
                      <item.icon 
                        className={cn(
                          "h-5 w-5 transition-smooth",
                          isActive(item.url) && "text-primary"
                        )} 
                      />
                      {!isCollapsed && (
                        <span className="ml-3 text-sm">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  );
}