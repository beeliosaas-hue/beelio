import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { DashboardWidgets } from "@/components/dashboard/DashboardWidgets";
import { PostsCalendar } from "@/components/dashboard/PostsCalendar";
import { ProximosPosts } from "@/components/dashboard/ProximosPosts";
import { EstatisticasRapidas } from "@/components/dashboard/EstatisticasRapidas";
import { InsightsDiana } from "@/components/dashboard/InsightsDiana";
import { MelhorConteudo } from "@/components/dashboard/MelhorConteudo";
import { ProximasAcoes } from "@/components/dashboard/ProximasAcoes";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Verificar se usuário já tem briefing ou branding
      const { data: briefing } = await supabase
        .from('briefings')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      const { data: branding } = await supabase
        .from('brandings')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      // Se não tiver nem briefing nem branding, mostrar onboarding
      if (!briefing && !branding) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error('Erro ao verificar onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <OnboardingModal open={showOnboarding} onComplete={handleOnboardingComplete} />
      
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Visão geral da sua estratégia de marketing
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Última atualização: {new Date().toLocaleString('pt-BR', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
        
        {/* Stats Cards */}
        <StatsCards />
        
        {/* Quick Access Widgets */}
        <DashboardWidgets />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Calendar */}
          <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <PostsCalendar />
          </div>
          
          {/* Right Column - Próximos Posts */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <ProximosPosts />
          </div>
        </div>
        
        {/* Secondary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <EstatisticasRapidas />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <InsightsDiana />
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <MelhorConteudo />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <ProximasAcoes />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
