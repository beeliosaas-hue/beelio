import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  FileText, 
  Cookie, 
  Shield, 
  DollarSign, 
  Headphones, 
  Lock, 
  Copyright, 
  MessageSquare,
  Download,
  ChevronDown,
  ChevronUp,
  Database,
  Settings as SettingsIcon,
  Trash2,
  FileDown,
  History,
  User,
  CreditCard,
  Link as LinkIcon,
  Bell,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

type MenuSection = "conta" | "assinatura" | "integracoes" | "notificacoes" | "equipe" | "politicas" | "privacidade";

interface Policy {
  id: string;
  title: string;
  icon: any;
  content: string;
}

const officialPolicies: Policy[] = [
  {
    id: "privacy",
    title: "Política de Privacidade",
    icon: Shield,
    content: `A sua privacidade é importante para nós.
As informações pessoais fornecidas são utilizadas exclusivamente para melhorar sua experiência, personalizar nossos serviços e cumprir obrigações legais.
Não compartilhamos seus dados com terceiros sem o seu consentimento. Todas as informações são tratadas de acordo com a LGPD e legislações aplicáveis.`
  },
  {
    id: "cookies",
    title: "Política de Cookies",
    icon: Cookie,
    content: `O Beelio utiliza cookies e tecnologias semelhantes para:
- Garantir o funcionamento da plataforma.
- Personalizar a experiência do usuário.
- Coletar dados estatísticos para melhoria contínua.

O usuário pode configurar seu navegador para recusar cookies, mas isso pode afetar algumas funcionalidades.`
  },
  {
    id: "terms",
    title: "Termos de Uso",
    icon: FileText,
    content: `Ao acessar e utilizar o Beelio, você concorda com os seguintes termos:
- Utilizar a plataforma de forma ética e em conformidade com a legislação aplicável.
- Não compartilhar acesso ou credenciais com terceiros sem autorização.
- Reconhecer que o conteúdo do Beelio é protegido por direitos autorais.

O descumprimento destes termos pode resultar em suspensão ou cancelamento do acesso.`
  },
  {
    id: "refund",
    title: "Política de Reembolso e Cancelamento",
    icon: DollarSign,
    content: `O Beelio oferece:
- Prazo de 7 dias corridos para solicitação de reembolso, conforme o Código de Defesa do Consumidor.
- Cancelamentos após esse prazo não geram direito a reembolso, mas o usuário pode manter acesso até o final do ciclo pago.`
  },
  {
    id: "support",
    title: "Política de Atendimento ao Cliente",
    icon: Headphones,
    content: `Nosso compromisso é oferecer suporte ágil e eficiente:
- Canais oficiais: e-mail (beelio.saas@gmail.com) e chat dentro da plataforma.
- Tempo médio de resposta: até 24h em dias úteis.
- Todo atendimento será feito de forma respeitosa, clara e objetiva.`
  },
  {
    id: "security",
    title: "Política de Segurança da Informação",
    icon: Lock,
    content: `O Beelio adota medidas rigorosas para proteger seus dados:
- Criptografia em trânsito e em repouso.
- Monitoramento contínuo de segurança.
- Acesso restrito a informações sensíveis apenas por pessoal autorizado.

Em caso de incidente, o usuário será notificado imediatamente, conforme exigido pela LGPD.`
  },
  {
    id: "intellectual",
    title: "Política de Propriedade Intelectual",
    icon: Copyright,
    content: `Todo o conteúdo, marca, design, código-fonte e funcionalidades do Beelio são de propriedade exclusiva da Beelio Tecnologia LTDA.
- É proibida a reprodução, distribuição ou modificação sem autorização expressa.
- O uso indevido da marca ou dos materiais poderá gerar responsabilização civil e criminal.`
  },
  {
    id: "communication",
    title: "Política de Comunicação & Redes Sociais",
    icon: MessageSquare,
    content: `O Beelio mantém presença ativa em redes sociais para compartilhar novidades, dicas e informações relevantes.
- As interações devem ser respeitosas, sem ofensas ou discursos de ódio.
- Comentários impróprios poderão ser removidos.
- As redes sociais não substituem os canais oficiais de suporte.`
  }
];

function OfficialPolicyCard({ policy }: { policy: Policy }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownloadPDF = () => {
    toast.success(`${policy.title} baixado com sucesso!`);
    // Implementar download real em PDF
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-border bg-card">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <policy.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base font-medium text-foreground">{policy.title}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadPDF();
                  }}
                  className="hover:text-primary"
                >
                  <Download className="h-4 w-4" />
                </Button>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="text-sm text-foreground whitespace-pre-line leading-relaxed">
              {policy.content}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function PoliciesTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-border bg-card">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            As políticas oficiais do Beelio foram desenvolvidas para garantir transparência, segurança e conformidade legal. 
            Você pode fazer o download em PDF a qualquer momento.
          </p>
        </CardContent>
      </Card>

      {/* Policies List */}
      <div className="space-y-3">
        {officialPolicies.map((policy) => (
          <OfficialPolicyCard key={policy.id} policy={policy} />
        ))}
      </div>
    </div>
  );
}

function PrivacyTab() {
  const [cookiesEssential, setCookiesEssential] = useState(true);
  const [cookiesMarketing, setCookiesMarketing] = useState(false);
  const [cookiesAnalytics, setCookiesAnalytics] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [requestHistory] = useState([
    { date: "2024-01-15", type: "Exportação", status: "Concluído", icon: Download },
    { date: "2024-01-10", type: "Alteração", status: "Concluído", icon: FileDown },
    { date: "2024-01-05", type: "Visualização", status: "Concluído", icon: History },
  ]);

  const handleExportData = () => {
    toast.success("Solicitação de exportação enviada! Você receberá um e-mail em breve.");
  };

  const handleDeleteAccount = () => {
    toast.success("Solicitação de exclusão enviada. Você receberá um e-mail de confirmação.");
  };

  return (
    <div className="space-y-6">
      {/* Meus Dados */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Meus Dados</CardTitle>
          <CardDescription>
            Na Beelio, você tem total controle sobre suas informações pessoais. Seus dados são coletados apenas para oferecer a melhor experiência possível e nunca são vendidos a terceiros.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-foreground mb-2">Dados atualmente armazenados:</h4>
            <ul className="space-y-1 text-sm text-blue-900">
              <li>• Informações de perfil (nome, email, empresa)</li>
              <li>• Preferências de notificação</li>
              <li>• Histórico de posts e campanhas</li>
              <li>• Dados de uso da plataforma</li>
              <li>• Configurações de integração</li>
            </ul>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Encarregado de Dados (DPO):</strong> privacy@beelio.com</p>
            <p><strong>Contato:</strong> dpo@beelio.com</p>
          </div>
        </CardContent>
      </Card>

      {/* Gerenciar Permissões */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Gerenciar Permissões</CardTitle>
          <CardDescription>
            Você pode alterar suas preferências de privacidade a qualquer momento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="space-y-0.5">
              <Label className="text-base font-medium text-foreground">Cookies Essenciais</Label>
              <p className="text-sm text-muted-foreground">Necessários para o funcionamento básico da plataforma</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded">Obrigatório</span>
              <Switch
                checked={cookiesEssential}
                disabled
                className="data-[state=checked]:bg-[#FDB022]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="space-y-0.5">
              <Label className="text-base font-medium text-foreground">Cookies de Marketing</Label>
              <p className="text-sm text-muted-foreground">Utilizados para personalizar anúncios e conteúdo</p>
            </div>
            <Switch
              checked={cookiesMarketing}
              onCheckedChange={setCookiesMarketing}
              className="data-[state=checked]:bg-[#FDB022]"
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="space-y-0.5">
              <Label className="text-base font-medium text-foreground">Cookies de Análise</Label>
              <p className="text-sm text-muted-foreground">Ajudam a entender como você usa a plataforma</p>
            </div>
            <Switch
              checked={cookiesAnalytics}
              onCheckedChange={setCookiesAnalytics}
              className="data-[state=checked]:bg-[#FDB022]"
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="space-y-0.5">
              <Label className="text-base font-medium text-foreground">Notificações por Email</Label>
              <p className="text-sm text-muted-foreground">Receber atualizações e novidades por email</p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
              className="data-[state=checked]:bg-[#FDB022]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Exportar Meus Dados */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Exportar Meus Dados</CardTitle>
          <CardDescription>
            Você pode solicitar a exportação dos seus dados pessoais a qualquer momento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-foreground mb-2">Dados disponíveis para exportação:</h4>
            <ul className="space-y-1 text-sm text-blue-900">
              <li>• Informações de perfil (nome, email, empresa)</li>
              <li>• Preferências de notificação</li>
              <li>• Histórico de posts e campanhas</li>
              <li>• Dados de uso da plataforma</li>
              <li>• Configurações de integração</li>
            </ul>
          </div>
          <div className="text-sm text-muted-foreground mb-4 space-y-1">
            <p><strong>Prazo para entrega:</strong> 7 dias úteis</p>
            <p><strong>Canal de contato:</strong> export@beelio.com</p>
          </div>
          <Button 
            onClick={handleExportData}
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Solicitar Exportação
          </Button>
        </CardContent>
      </Card>

      {/* Exclusão de Conta */}
      <Card className="border-destructive/50 bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            <CardTitle className="text-foreground">Exclusão de Conta</CardTitle>
          </div>
          <CardDescription>
            Você pode excluir permanentemente sua conta e todos os dados associados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-yellow-900 mb-1">
              ⚠️ Atenção: Após a exclusão, não será possível recuperar informações.
            </p>
            <p className="text-sm text-yellow-800">
              Prazo para confirmação: 30 dias
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Solicitar Exclusão
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta
                  e removerá seus dados de nossos servidores.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Sim, excluir minha conta
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Histórico de Solicitações */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Histórico de Solicitações</CardTitle>
          </div>
          <CardDescription>
            Últimas alterações solicitadas por você:
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requestHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma solicitação registrada.</p>
          ) : (
            <div className="space-y-3">
              {requestHistory.map((request, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <request.icon className="h-4 w-4 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">{request.type}</p>
                      <p className="text-xs text-muted-foreground">{request.date}</p>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ContaTab() {
  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Informações da Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" defaultValue="João Silva" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="joao@empresa.com" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input id="company" defaultValue="Minha Empresa LTDA" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" defaultValue="+55 11 99999-9999" />
            </div>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Salvar Alterações</Button>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Alterar Senha</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Senha Atual</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nova Senha</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Alterar Senha</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function AssinaturaTab() {
  const plans = [
    {
      name: "Free",
      price: 0,
      features: [
        "Calendário editorial simples",
        "Briefing da marca",
        "Branding da marca",
        "Chat IA - 3 créditos semanais",
        "Sugestões rápidas de conteúdo"
      ]
    },
    {
      name: "Starter",
      price: 87,
      current: true,
      nextBilling: "15/01/2025",
      features: [
        "TUDO DO PLANO FREE",
        "Calendário de tendências",
        "Biblioteca centralizada",
        "Criar e programar post - internamente no beelio",
        "Até 30 post por mês",
        "Chat IA - 5 créditos por dia"
      ]
    },
    {
      name: "Pro",
      price: 197,
      features: [
        "TUDO DO PLANO STARTER",
        "Criar e programar post - ilimitado e nas redes sociais",
        "Colaboração em equipe",
        "Integração com as redes sociais"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Current Plan Alert */}
      <Card className="border-[#FDB022] bg-[#FFF9E6]">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Plano Starter</h3>
              <p className="text-sm text-muted-foreground">
                R$ 87/mês • Próxima cobrança: 15/01/2025
              </p>
            </div>
            <Button variant="ghost" className="text-[#FDB022] hover:text-[#FDB022] hover:bg-[#FDB022]/10">
              Cancelar Assinatura
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card 
            key={plan.name}
            className={cn(
              "border-2 transition-all",
              plan.current 
                ? "border-[#FDB022] bg-[#FFF9E6]" 
                : "border-border bg-card"
            )}
          >
            <CardHeader>
              <CardTitle className="text-xl text-foreground">{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold text-foreground">R$ {plan.price}</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className={cn(
                  "w-full",
                  plan.current 
                    ? "bg-[#FDB022] text-white hover:bg-[#FDB022]/90" 
                    : "bg-muted text-foreground hover:bg-muted/80"
                )}
                disabled={plan.current}
              >
                {plan.current ? "Plano Atual" : "Selecionar"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function IntegracoesTab() {
  const integrations = [
    { name: "Facebook", icon: "📘", color: "#1877F2" },
    { name: "YouTube", icon: "📺", color: "#FF0000" },
    { name: "TikTok", icon: "🎵", color: "#000000" },
    { name: "LinkedIn", icon: "💼", color: "#0A66C2" },
    { name: "Instagram", icon: "📷", color: "#E4405F" }
  ];

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Redes Sociais</CardTitle>
          <CardDescription>Conecte suas contas para publicar diretamente do Beelio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {integrations.map((integration) => (
            <div 
              key={integration.name}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{integration.icon}</span>
                <span className="font-medium text-foreground">{integration.name}</span>
              </div>
              <Button className="bg-[#FDB022] text-white hover:bg-[#FDB022]/90">
                Conectar
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function NotificacoesTab() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [campaignAlerts, setCampaignAlerts] = useState(true);

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Preferências de Notificação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium text-foreground">Notificações por Email</Label>
              <p className="text-sm text-muted-foreground">Receba atualizações importantes por email</p>
            </div>
            <Switch
              checked={emailNotif}
              onCheckedChange={setEmailNotif}
              className="data-[state=checked]:bg-[#FDB022]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium text-foreground">Notificações Push</Label>
              <p className="text-sm text-muted-foreground">Receba notificações no navegador</p>
            </div>
            <Switch
              checked={pushNotif}
              onCheckedChange={setPushNotif}
              className="data-[state=checked]:bg-[#FDB022]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium text-foreground">Relatório Semanal</Label>
              <p className="text-sm text-muted-foreground">Resumo semanal do desempenho</p>
            </div>
            <Switch
              checked={weeklyReport}
              onCheckedChange={setWeeklyReport}
              className="data-[state=checked]:bg-[#FDB022]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium text-foreground">Alertas de Campanha</Label>
              <p className="text-sm text-muted-foreground">Notificações sobre campanhas ativas</p>
            </div>
            <Switch
              checked={campaignAlerts}
              onCheckedChange={setCampaignAlerts}
              className="data-[state=checked]:bg-[#FDB022]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EquipeTab() {
  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardContent className="pt-6 text-center py-12">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Integração de equipe disponível apenas no Plano Pro
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Para acessar recursos de equipe, faça upgrade para o plano Pro.
          </p>
          <Button className="bg-[#FDB022] text-white hover:bg-[#FDB022]/90">
            Fazer Upgrade
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState<MenuSection>("conta");

  const menuItems = [
    { id: "conta" as MenuSection, label: "Conta", icon: User },
    { id: "assinatura" as MenuSection, label: "Assinatura", icon: CreditCard },
    { id: "integracoes" as MenuSection, label: "Integrações", icon: LinkIcon },
    { id: "notificacoes" as MenuSection, label: "Notificações", icon: Bell },
    { id: "equipe" as MenuSection, label: "Equipe", icon: Users },
    { id: "politicas" as MenuSection, label: "Políticas", icon: FileText },
    { id: "privacidade" as MenuSection, label: "Privacidade e Dados", icon: Shield },
  ];

  return (
    <DashboardLayout>
      <div className="flex gap-6">
        {/* Sidebar Menu */}
        <aside className="w-64 flex-shrink-0">
          <Card className="border-border bg-card">
            <CardContent className="p-2">
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      activeSection === item.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {activeSection === "conta" && <ContaTab />}
          {activeSection === "assinatura" && <AssinaturaTab />}
          {activeSection === "integracoes" && <IntegracoesTab />}
          {activeSection === "notificacoes" && <NotificacoesTab />}
          {activeSection === "equipe" && <EquipeTab />}
          {activeSection === "politicas" && <PoliciesTab />}
          {activeSection === "privacidade" && <PrivacyTab />}
        </div>
      </div>
    </DashboardLayout>
  );
}
