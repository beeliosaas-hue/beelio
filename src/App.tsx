import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookieConsentBanner } from "@/components/ui/cookie-consent-banner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Calendar from "./pages/Calendar";
import Briefing from "./pages/Briefing";
import Branding from "./pages/Branding";
import Trends from "./pages/Trends";
import Planner from "./pages/Planner";
import Library from "./pages/Library";
import PostApproval from "./pages/PostApproval";
import Diana from "./pages/Diana";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CookieConsentBanner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/calendario" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/briefing" element={<ProtectedRoute><Briefing /></ProtectedRoute>} />
          <Route path="/branding" element={<ProtectedRoute><Branding /></ProtectedRoute>} />
          <Route path="/tendencias" element={<ProtectedRoute><Trends /></ProtectedRoute>} />
          <Route path="/planner" element={<ProtectedRoute><Planner /></ProtectedRoute>} />
          <Route path="/biblioteca" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/diana" element={<ProtectedRoute><Diana /></ProtectedRoute>} />
          <Route path="/aprovacao/:postId" element={<ProtectedRoute><PostApproval /></ProtectedRoute>} />
          <Route path="/relatorios" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/suporte" element={<ProtectedRoute><Support /></ProtectedRoute>} />
          <Route path="/configuracoes" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;