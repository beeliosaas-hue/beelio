import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { PostsCalendar } from "@/components/dashboard/PostsCalendar";
import { ProximosPosts } from "@/components/dashboard/ProximosPosts";
import { EstatisticasRapidas } from "@/components/dashboard/EstatisticasRapidas";
import { InsightsDiana } from "@/components/dashboard/InsightsDiana";
import { MelhorConteudo } from "@/components/dashboard/MelhorConteudo";
import { ProximasAcoes } from "@/components/dashboard/ProximasAcoes";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              Visão geral da sua estratégia de marketing
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Última atualização: 14/09/2025 19:19
          </div>
        </div>
        
        {/* Stats Cards */}
        <StatsCards />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Calendar */}
          <div className="lg:col-span-2">
            <PostsCalendar />
          </div>
          
          {/* Right Column - Próximos Posts */}
          <div>
            <ProximosPosts />
          </div>
        </div>
        
        {/* Secondary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EstatisticasRapidas />
          <InsightsDiana />
        </div>
        
        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MelhorConteudo />
          <ProximasAcoes />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
