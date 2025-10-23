import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, BookOpen, Headphones } from "lucide-react";
import { FAQSection } from "@/components/support/FAQSection";
import { TicketsList } from "@/components/support/TicketsList";
import { CreateTicketForm } from "@/components/support/CreateTicketForm";

const Support = () => {
  const [activeTab, setActiveTab] = useState("faq");
  const [showTicketForm, setShowTicketForm] = useState(false);

  return (
    <DashboardLayout>
      <Helmet>
        <title>Suporte 24/7 - Beelio | Central de Ajuda e Atendimento</title>
        <meta name="description" content="Central de Ajuda Beelio: acesse nossa base de conhecimento, abra chamados de suporte e receba atendimento personalizado 24/7." />
        <meta property="og:title" content="Suporte 24/7 - Beelio" />
        <meta property="og:description" content="Estamos aqui para ajudar você. FAQ, chamados e suporte via WhatsApp." />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Central de Ajuda Beelio</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Estamos aqui para ajudar você a aproveitar ao máximo nossa plataforma
          </p>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-semibold">
                1
              </div>
              <span className="text-sm font-medium">FAQ</span>
            </div>
            <div className="w-12 h-0.5 bg-border" />
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                activeTab === "chamados" || showTicketForm ? "bg-yellow-500" : "bg-muted-foreground"
              }`}>
                2
              </div>
              <span className="text-sm font-medium">Chamado</span>
            </div>
            <div className="w-12 h-0.5 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-muted-foreground flex items-center justify-center text-white font-semibold">
                3
              </div>
              <span className="text-sm font-medium">WhatsApp</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="faq" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Base de Conhecimento
                </TabsTrigger>
                <TabsTrigger value="chamados" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Meus Chamados
                </TabsTrigger>
                <TabsTrigger value="abrir" className="flex items-center gap-2">
                  <Headphones className="h-4 w-4" />
                  Abrir Chamado
                </TabsTrigger>
              </TabsList>

              <TabsContent value="faq">
                <FAQSection onOpenTicket={() => setActiveTab("abrir")} />
              </TabsContent>

              <TabsContent value="chamados">
                <TicketsList onCreateNew={() => setActiveTab("abrir")} />
              </TabsContent>

              <TabsContent value="abrir">
                <CreateTicketForm onSuccess={() => setActiveTab("chamados")} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Support;
