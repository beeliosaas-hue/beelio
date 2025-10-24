import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { ModernCalendarView } from "@/components/calendar/ModernCalendarView";
import { HolidaysView } from "@/components/calendar/HolidaysView";
import { CreatePostModal } from "@/components/calendar/CreatePostModal";

const Calendar = () => {
  const [activeTab, setActiveTab] = useState<"calendar" | "holidays">("calendar");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "schedule">("create");

  const handleCreatePost = () => {
    setModalMode("create");
    setIsCreateModalOpen(true);
  };

  const handleSchedulePost = () => {
    setModalMode("schedule");
    setIsCreateModalOpen(true);
  };

  const handleExportCalendar = () => {
    // Criar dados CSV
    const csvData = [
      ['Data', 'Título', 'Conteúdo', 'Horário', 'Redes Sociais', 'Status'],
      // Aqui você buscaria os dados reais do calendário
      ['14/09/2025', 'Dicas de Produtividade', '5 dicas essenciais...', '09:00', 'Instagram, LinkedIn', 'Agendado'],
      ['22/09/2025', 'Stories sobre Sustentabilidade', 'Como nossa empresa está contribuindo...', '14:30', 'Instagram', 'Rascunho'],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `calendario_beelio_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <CalendarHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSchedulePost={handleSchedulePost}
        onExportCalendar={handleExportCalendar}
      />
      
      {activeTab === "calendar" ? (
        <ModernCalendarView onCreatePost={handleCreatePost} />
      ) : (
        <HolidaysView />
      )}

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode={modalMode}
      />
    </DashboardLayout>
  );
};

export default Calendar;