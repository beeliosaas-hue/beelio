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
  const [notificationsPush, setNotificationsPush] = useState(true);
  const [requestHistory] = useState([
    { date: "15/01/2025", type: "Exportação", status: "Concluído" },
    { date: "10/12/2024", type: "Alteração", status: "Concluído" },
  ]);

  const handleExportData = () => {
    toast.success("Solicitação de exportação enviada! Você receberá um e-mail em breve.");
  };

  const handleDeleteAccount = () => {
    toast.success("Solicitação de exclusão enviada. Você receberá um e-mail de confirmação.");
  };

  return (
    <div className="space-y-6">
      {/* Intro Text */}
      <Card className="border-border bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="text-foreground">Privacidade e Dados</CardTitle>
          <CardDescription>
            Na Beelio, você tem total controle sobre suas informações pessoais.
            Seus dados são coletados apenas para oferecer a melhor experiência possível e nunca são vendidos a terceiros.
            Você pode a qualquer momento revisar, corrigir, exportar ou excluir permanentemente suas informações.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Encarregado de Dados (DPO):</strong> João Silva</p>
            <p><strong>Contato:</strong> dpo@beelio.com.br</p>
          </div>
        </CardContent>
      </Card>

      {/* Meus Dados */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Meus Dados</CardTitle>
          </div>
          <CardDescription>
            Atualmente coletamos e armazenamos os seguintes dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Nome completo e e-mail</li>
            <li>• Informações de perfil e preferências</li>
            <li>• Posts criados e agendados</li>
            <li>• Briefings e brandings salvos</li>
            <li>• Histórico de interações com a Diana IA</li>
            <li>• Arquivos enviados para a biblioteca</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-4">
            Essas informações são utilizadas apenas para personalizar sua experiência e melhorar nossos serviços.
          </p>
        </CardContent>
      </Card>

      {/* Gerenciar Permissões */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Gerenciar Permissões</CardTitle>
          </div>
          <CardDescription>
            Você pode alterar suas preferências a qualquer momento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="cookies-essential">Cookies Essenciais</Label>
              <p className="text-sm text-muted-foreground">Obrigatórios para o funcionamento do site</p>
            </div>
            <Switch
              id="cookies-essential"
              checked={cookiesEssential}
              disabled
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="cookies-marketing">Cookies de Marketing</Label>
              <p className="text-sm text-muted-foreground">Ajudam a personalizar anúncios e conteúdo</p>
            </div>
            <Switch
              id="cookies-marketing"
              checked={cookiesMarketing}
              onCheckedChange={setCookiesMarketing}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications-push">Notificações Push</Label>
              <p className="text-sm text-muted-foreground">Receber alertas e atualizações</p>
            </div>
            <Switch
              id="notifications-push"
              checked={notificationsPush}
              onCheckedChange={setNotificationsPush}
            />
          </div>
        </CardContent>
      </Card>

      {/* Portabilidade */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Portabilidade de Dados</CardTitle>
          </div>
          <CardDescription>
            Solicite o envio de seus dados em formato legível (.json ou .csv)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            <strong>Prazo para entrega:</strong> 7 dias úteis<br />
            <strong>Canal de contato:</strong> suporte@beelio.com.br
          </p>
          <Button onClick={handleExportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Solicitar Exportação
          </Button>
        </CardContent>
      </Card>

      {/* Exclusão de Conta */}
      <Card className="border-border bg-card border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            <CardTitle className="text-foreground">Exclusão de Conta</CardTitle>
          </div>
          <CardDescription>
            Você pode excluir permanentemente sua conta e todos os dados associados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Após a exclusão, <strong>não será possível recuperar informações</strong>.<br />
            <strong>Prazo para confirmação da exclusão:</strong> 30 dias
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Minha Conta
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
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground">
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
            Últimas alterações solicitadas pelo usuário
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requestHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma solicitação registrada.</p>
          ) : (
            <div className="space-y-3">
              {requestHistory.map((request, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{request.type}</p>
                    <p className="text-xs text-muted-foreground">Data: {request.date}</p>
                  </div>
                  <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full">
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
          <CardTitle className="text-lg">Informações da Conta</CardTitle>
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
          <Button className="bg-primary text-primary-foreground">Salvar Alterações</Button>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Alterar Senha</CardTitle>
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
          <Button className="bg-primary text-primary-foreground">Alterar Senha</Button>
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
          {activeSection === "assinatura" && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Assinatura</CardTitle>
                <CardDescription>Gerencie seu plano e faturamento</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Conteúdo em desenvolvimento...</p>
              </CardContent>
            </Card>
          )}
          {activeSection === "integracoes" && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Integrações</CardTitle>
                <CardDescription>Conecte suas redes sociais e ferramentas</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Conteúdo em desenvolvimento...</p>
              </CardContent>
            </Card>
          )}
          {activeSection === "notificacoes" && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>Configure suas preferências de notificação</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Conteúdo em desenvolvimento...</p>
              </CardContent>
            </Card>
          )}
          {activeSection === "equipe" && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Equipe</CardTitle>
                <CardDescription>Gerencie membros e permissões</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Conteúdo em desenvolvimento...</p>
              </CardContent>
            </Card>
          )}
          {activeSection === "politicas" && <PoliciesTab />}
          {activeSection === "privacidade" && <PrivacyTab />}
        </div>
      </div>
    </DashboardLayout>
  );
}
