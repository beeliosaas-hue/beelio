import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Calendar from "./pages/Calendar";
import Briefing from "./pages/Briefing";
import Branding from "./pages/Branding";
import Trends from "./pages/Trends";
import Planner from "./pages/Planner";
import Library from "./pages/Library";
import PostApproval from "./pages/PostApproval";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
        <Route path="/calendario" element={<Calendar />} />
        <Route path="/calendar" element={<Calendar />} />
          <Route path="/briefing" element={<Briefing />} />
          <Route path="/branding" element={<Branding />} />
          <Route path="/tendencias" element={<Trends />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/biblioteca" element={<Library />} />
          <Route path="/aprovacao/:postId" element={<PostApproval />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;