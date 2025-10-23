import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  History
} from "lucide-react";
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

interface Policy {
  id: string;
  title: string;
  icon: any;
  defaultContent: string;
  fields: { label: string; placeholder: string; key: string }[];
}

const policies: Policy[] = [
  {
    id: "privacy",
    title: "Política de Privacidade",
    icon: FileText,
    defaultContent: `A sua privacidade é importante para nós.
As informações pessoais fornecidas são coletadas apenas para melhorar sua experiência, personalizar nossos serviços e cumprir obrigações legais.
Não compartilhamos seus dados com terceiros sem o seu consentimento. Todas as informações são tratadas de acordo com a Lei Geral de Proteção de Dados (LGPD) e demais legislações aplicáveis.

Responsável pelo Tratamento de Dados: [NOME DA EMPRESA]
Contato para questões de privacidade: [E-MAIL DE SUPORTE]`,
    fields: [
      { label: "Nome da Empresa", placeholder: "Ex: Beelio Marketing", key: "company_name" },
      { label: "E-mail de Suporte", placeholder: "suporte@empresa.com", key: "support_email" }
    ]
  },
  {
    id: "cookies",
    title: "Política de Cookies",
    icon: Cookie,
    defaultContent: `Utilizamos cookies para melhorar o desempenho do nosso site, personalizar conteúdos e analisar o tráfego.
Você pode aceitar todos os cookies, recusar ou personalizar suas preferências. Nenhum dado será coletado sem o seu consentimento prévio.

Empresa Controladora: [NOME DA EMPRESA]
Contato: [E-MAIL DE SUPORTE]`,
    fields: [
      { label: "Nome da Empresa", placeholder: "Ex: Beelio Marketing", key: "company_name" },
      { label: "E-mail de Suporte", placeholder: "suporte@empresa.com", key: "support_email" }
    ]
  },
  {
    id: "terms",
    title: "Termos de Uso",
    icon: Shield,
    defaultContent: `Ao acessar e utilizar nossa plataforma, você concorda em seguir as condições aqui estabelecidas.
É vedado o uso para fins ilícitos, fraudulentos ou que possam comprometer a segurança do sistema.
A [NOME DA EMPRESA] não se responsabiliza por usos indevidos e se reserva o direito de atualizar estes termos a qualquer momento.

Última atualização: [DATA]`,
    fields: [
      { label: "Nome da Empresa", placeholder: "Ex: Beelio Marketing", key: "company_name" },
      { label: "Data de Atualização", placeholder: "DD/MM/AAAA", key: "update_date" }
    ]
  },
  {
    id: "refund",
    title: "Política de Reembolso e Cancelamento",
    icon: DollarSign,
    defaultContent: `O usuário pode solicitar cancelamento da assinatura a qualquer momento.
Nos casos de cobrança indevida ou falha técnica comprovada, será realizado reembolso integral no prazo máximo de [X DIAS] dias.
Após esse período, cancelamentos não geram reembolso proporcional, salvo exceções previstas em lei.

Canal para solicitação: [E-MAIL DE SUPORTE]
Responsável financeiro: [NOME DO RESPONSÁVEL/SETOR]`,
    fields: [
      { label: "Prazo para Reembolso (dias)", placeholder: "Ex: 7", key: "refund_days" },
      { label: "E-mail de Suporte", placeholder: "suporte@empresa.com", key: "support_email" },
      { label: "Responsável Financeiro", placeholder: "Nome/Setor", key: "financial_responsible" }
    ]
  },
  {
    id: "support",
    title: "Política de Atendimento ao Cliente",
    icon: Headphones,
    defaultContent: `Nosso compromisso é oferecer suporte ágil e humanizado.

Canais oficiais de contato: [E-MAIL / WHATSAPP / TELEFONE]
Horário de atendimento: [HORÁRIO]
Prazo máximo de resposta: [X HORAS/DIAS]
Responsável pelo suporte: [NOME/SETOR]`,
    fields: [
      { label: "Canais de Contato", placeholder: "E-mail, WhatsApp, Telefone", key: "contact_channels" },
      { label: "Horário de Atendimento", placeholder: "Seg-Sex 9h-18h", key: "business_hours" },
      { label: "Prazo de Resposta", placeholder: "24 horas", key: "response_time" },
      { label: "Responsável", placeholder: "Nome/Setor", key: "support_responsible" }
    ]
  },
  {
    id: "security",
    title: "Política de Segurança da Informação",
    icon: Lock,
    defaultContent: `Adotamos medidas técnicas e administrativas para proteger dados e sistemas contra acessos não autorizados, perda ou vazamento.
Todos os acessos internos são controlados e monitorados.
Em caso de incidente de segurança, o usuário será notificado em até [X HORAS] após a identificação.

Responsável pela segurança da informação: [NOME / SETOR]
Contato de emergência: [E-MAIL / TELEFONE]`,
    fields: [
      { label: "Prazo de Notificação (horas)", placeholder: "Ex: 24", key: "notification_hours" },
      { label: "Responsável pela Segurança", placeholder: "Nome/Setor", key: "security_responsible" },
      { label: "Contato de Emergência", placeholder: "E-mail/Telefone", key: "emergency_contact" }
    ]
  },
  {
    id: "intellectual",
    title: "Política de Propriedade Intelectual",
    icon: Copyright,
    defaultContent: `Todos os conteúdos, softwares, marcas e materiais disponibilizados são de propriedade exclusiva da [NOME DA EMPRESA].
É proibida a cópia, distribuição ou uso não autorizado para fins comerciais ou pessoais.
Qualquer infração poderá resultar em medidas judiciais cabíveis.

Responsável legal: [NOME DO RESPONSÁVEL / SETOR]
Contato: [E-MAIL DE SUPORTE]`,
    fields: [
      { label: "Nome da Empresa", placeholder: "Ex: Beelio Marketing", key: "company_name" },
      { label: "Responsável Legal", placeholder: "Nome/Setor", key: "legal_responsible" },
      { label: "E-mail de Suporte", placeholder: "suporte@empresa.com", key: "support_email" }
    ]
  },
  {
    id: "communication",
    title: "Política de Comunicação & Redes Sociais",
    icon: MessageSquare,
    defaultContent: `A comunicação da [NOME DA EMPRESA] reflete seus valores de respeito, transparência e ética.
Não serão tolerados comentários ofensivos, discriminatórios ou que incitem ódio em nossos canais digitais.
Reservamo-nos o direito de remover conteúdos que infrinjam estas regras.

Responsável pela comunicação: [NOME/SETOR]
Contato oficial: [E-MAIL / INSTAGRAM / LINKEDIN]`,
    fields: [
      { label: "Nome da Empresa", placeholder: "Ex: Beelio Marketing", key: "company_name" },
      { label: "Responsável pela Comunicação", placeholder: "Nome/Setor", key: "communication_responsible" },
      { label: "Contatos Oficiais", placeholder: "E-mail, Instagram, LinkedIn", key: "official_contacts" }
    ]
  }
];

function PolicyCard({ policy }: { policy: Policy }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(policy.defaultContent);
  const [fields, setFields] = useState<Record<string, string>>({});

  const handleFieldChange = (key: string, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const handleDownloadPDF = () => {
    toast.success(`${policy.title} baixado com sucesso!`);
  };

  const handleSave = () => {
    toast.success(`${policy.title} salvo com sucesso!`);
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
                <CardTitle className="text-lg text-foreground">{policy.title}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadPDF();
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            {/* Dynamic Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {policy.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={`${policy.id}-${field.key}`}>{field.label}</Label>
                  <Input
                    id={`${policy.id}-${field.key}`}
                    placeholder={field.placeholder}
                    value={fields[field.key] || ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  />
                </div>
              ))}
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
              <Label htmlFor={`${policy.id}-content`}>Conteúdo da Política</Label>
              <Textarea
                id={`${policy.id}-content`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setContent(policy.defaultContent)}>
                Restaurar Padrão
              </Button>
              <Button onClick={handleSave} className="bg-primary text-primary-foreground">
                Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
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

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie políticas e configurações de privacidade
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="policies" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="policies">Políticas</TabsTrigger>
            <TabsTrigger value="privacy">Privacidade e Dados</TabsTrigger>
          </TabsList>

          <TabsContent value="policies" className="space-y-4 mt-6">
            {policies.map((policy) => (
              <PolicyCard key={policy.id} policy={policy} />
            ))}
          </TabsContent>

          <TabsContent value="privacy" className="mt-6">
            <PrivacyTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
