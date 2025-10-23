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
    // Implementar exportação para PDF/CSV
    console.log("Exportando calendário...");
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