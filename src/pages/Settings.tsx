import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
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
  Users,
  CheckSquare
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
import { TeamManagement } from '@/components/settings/TeamManagement';
import { ApprovalsList } from '@/components/settings/ApprovalsList';

type MenuSection = "conta" | "assinatura" | "integracoes" | "notificacoes" | "equipe" | "aprovacoes" | "politicas" | "privacidade";

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
    content: `Última atualização: 23/10/2025

No Beelio, a sua privacidade e a segurança dos seus dados são prioridades. Esta Política de Privacidade explica como coletamos, utilizamos, armazenamos e protegemos suas informações ao utilizar nossa plataforma.

1. Controlador dos Dados
O Beelio é o controlador dos dados pessoais fornecidos pelos usuários, sendo responsável pelo tratamento conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD).

2. Dados que Coletamos
Coletamos apenas os dados necessários para oferecer a melhor experiência na plataforma:
• Dados cadastrais: nome, e-mail, senha, nome da empresa, segmento de atuação.
• Dados de marca: identidade visual, paleta de cores, tipografia, materiais enviados.
• Dados de uso: interações na plataforma (posts criados, relatórios gerados, prompts enviados à Diana).
• Dados de pagamento: processados via terceiros (Stripe), sem armazenamento de informações sensíveis de cartão em nossos servidores.
• Dados técnicos: IP, tipo de navegador e informações de dispositivo para segurança e melhoria de performance.

3. Finalidade do Tratamento
Os dados são tratados para:
• Permitir acesso à conta e autenticação do usuário.
• Personalizar a experiência de uso (Diana e recursos da plataforma).
• Gerar relatórios e análises estratégicas de marketing.
• Garantir segurança contra fraudes e acessos não autorizados.
• Cumprir obrigações legais e regulatórias.

4. Compartilhamento de Dados
Não vendemos seus dados. Compartilhamos informações apenas quando necessário:
• Serviços de nuvem e banco de dados: Supabase (armazenamento seguro de conteúdo e histórico).
• Integrações de redes sociais: Instagram, TikTok, LinkedIn (mediante autorização do usuário).
• Pagamentos: Stripe (para processar transações financeiras).
• Todos os parceiros seguem padrões de segurança internacionais e estão comprometidos com a proteção dos dados.

5. Armazenamento e Segurança
• Usamos Supabase para autenticação, banco de dados e armazenamento de arquivos, garantindo criptografia em repouso e em trânsito (TLS/SSL).
• Backups automáticos são realizados para evitar perda de dados.
• Implementamos controles de acesso restritos e monitoramento contínuo contra incidentes de segurança.

6. Direitos do Usuário (LGPD)
Você pode, a qualquer momento:
• Solicitar confirmação de tratamento dos seus dados.
• Acessar e corrigir informações.
• Solicitar exclusão definitiva da conta e dados (opção disponível nas configurações).
• Solicitar portabilidade dos dados em formato estruturado (CSV, PDF).
• Revogar consentimento para uso de dados.

7. Retenção dos Dados
Mantemos os dados apenas pelo tempo necessário para cumprir a finalidade contratada e atender obrigações legais.

8. Cookies e Tecnologias de Rastreamento
Usamos cookies essenciais e de performance para lembrar preferências de login, melhorar a experiência de navegação e analisar métricas de uso da plataforma.

Contato:
📩 E-mail: suporte@beelio-ia.com
📱 WhatsApp: (41) 99201-3261`
  },
  {
    id: "cookies",
    title: "Política de Cookies",
    icon: Cookie,
    content: `Última atualização: 23/10/2025

O Beelio utiliza cookies e tecnologias semelhantes para oferecer uma experiência melhor, personalizada e mais segura.

1. O que são Cookies?
Cookies são pequenos arquivos de texto armazenados no navegador do usuário quando ele acessa a plataforma. Eles servem para reconhecer o dispositivo, lembrar preferências e melhorar a navegação.

2. Por que usamos Cookies?
Usamos cookies para:
• Funcionalidade essencial: manter você logado, lembrar suas preferências e garantir que a plataforma funcione corretamente.
• Personalização: adaptar a experiência ao seu perfil e preferências de uso (ex.: manter suas cores da marca salvas).
• Segurança: prevenir acessos não autorizados e proteger sua conta.
• Análise e desempenho: entender como a plataforma é utilizada e melhorar continuamente.
• Marketing e integrações: quando autorizado, conectar sua conta com redes sociais (Instagram, LinkedIn, TikTok etc.).

3. Tipos de Cookies que usamos
• Cookies estritamente necessários: indispensáveis para o funcionamento do Beelio (ex.: autenticação, sessão do usuário).
• Cookies de desempenho: coletam dados anônimos sobre como os usuários interagem com a plataforma, ajudando a otimizar funcionalidades.
• Cookies de funcionalidade: lembram preferências do usuário (idioma, cores, fontes).
• Cookies de terceiros: utilizados por integrações (ex.: Stripe para pagamentos, Supabase para autenticação e banco de dados, Google Analytics para métricas).

4. Consentimento
Ao acessar o Beelio pela primeira vez, você verá um banner de cookies que permite:
• Aceitar todos os cookies
• Rejeitar cookies não essenciais
• Personalizar preferências
• Você pode alterar suas escolhas a qualquer momento em Configurações > Privacidade.

5. Como gerenciar Cookies
Você pode configurar seu navegador para bloquear ou excluir cookies, ou usar a aba de Configurações de Cookies no próprio Beelio. Atenção: ao desativar alguns cookies, certas funcionalidades podem não funcionar corretamente.

Contato:
📩 E-mail: suporte@beelio-ia.com
📱 WhatsApp: (41) 99201-3261`
  },
  {
    id: "terms",
    title: "Termos de Uso",
    icon: FileText,
    content: `Última atualização: 23/10/2025

Bem-vindo(a) ao Beelio! Ao acessar ou utilizar nossa plataforma, você concorda com estes Termos de Uso.

1. Definições
• Beelio: Plataforma de software desenvolvida para auxiliar empresas e profissionais na organização, planejamento e execução de estratégias de marketing digital.
• Usuário: Pessoa física ou jurídica que cria uma conta na plataforma.
• Plano: Modalidade de uso da plataforma, podendo ser gratuita ou paga (Starter, Pro ou outros futuros planos).

2. Aceitação dos Termos
Ao criar uma conta, você declara que leu, entendeu e concorda com estes Termos, é maior de 18 anos e fornecerá informações verdadeiras e atualizadas.

3. Serviços Oferecidos
O Beelio disponibiliza: Calendário Editorial Inteligente, Briefing de Marca, Relatórios Estratégicos, Criador de Conteúdo e Ads, Colaboração em Equipe, Assistente Virtual Diana, entre outras funcionalidades.

4. Planos e Pagamentos
O Beelio oferece planos gratuitos e pagos. Nos planos pagos, o pagamento será realizado via Stripe. O não pagamento pode resultar em suspensão da conta. O usuário pode cancelar sua assinatura a qualquer momento.

5. Uso Permitido
O usuário compromete-se a utilizar o Beelio apenas para fins lícitos, não tentar burlar sistemas de segurança e não compartilhar dados de login com terceiros não autorizados.

6. Propriedade Intelectual
O Beelio, sua marca, layout, design, funcionalidades e código são de propriedade exclusiva. O usuário mantém a titularidade sobre os conteúdos criados dentro da plataforma.

7. Proteção de Dados (LGPD)
O Beelio coleta e armazena apenas os dados necessários para a execução de seus serviços conforme nossa Política de Privacidade.

8. Limitação de Responsabilidade
O Beelio não se responsabiliza por conteúdos criados pelos usuários, interrupções temporárias de manutenção ou resultados comerciais obtidos pelo uso da plataforma.

9. Foro e Legislação Aplicável
Estes Termos são regidos pela legislação brasileira. Eventuais conflitos deverão ser resolvidos no foro da comarca de Curitiba/Paraná.`
  },
  {
    id: "refund",
    title: "Política de Reembolso e Cancelamento",
    icon: DollarSign,
    content: `Última atualização: 23/10/2025

No Beelio, prezamos pela transparência e respeito aos nossos usuários. Nossa política está em conformidade com o Código de Defesa do Consumidor.

1. Direito de Arrependimento
Conforme o artigo 49 do CDC, o usuário que contratar um plano pago pela internet tem até 7 (sete) dias corridos a partir da contratação para solicitar o cancelamento e reembolso integral do valor pago.

2. Cancelamento da Assinatura
O usuário pode cancelar sua assinatura a qualquer momento, diretamente na plataforma ou pelo suporte:
• Cancelamento imediato: o acesso será suspenso assim que solicitado.
• Cancelamento ao final do ciclo: o usuário poderá utilizar o serviço até o fim do período já pago.

3. Reembolso
• Planos Mensais: após o período de 7 dias do direito de arrependimento, não há reembolso proporcional em caso de cancelamento antes do término do ciclo vigente.
• Planos Anuais: será avaliada a possibilidade de reembolso proporcional, descontando valores referentes ao tempo de uso.
• Casos especiais: em situações de falhas técnicas graves não solucionadas, poderá ser concedido reembolso proporcional.

4. Alteração de Planos
O usuário pode migrar para um plano superior a qualquer momento. Para plano inferior, a alteração será aplicada no próximo ciclo.

5. Suspensão por Uso Indevido
O Beelio se reserva o direito de suspender contas que violem os Termos de Uso (fraude, compartilhamento indevido de credenciais, tentativas de comprometer a segurança). Nesses casos, não haverá reembolso.

6. Como Solicitar
📩 E-mail: suporte@beelio-ia.com
📱 WhatsApp: (41) 99201-3261
Prazo para análise: até 10 dias úteis.`
  },
  {
    id: "support",
    title: "Política de Atendimento ao Cliente",
    icon: Headphones,
    content: `Última atualização: 23/10/2025

No Beelio, acreditamos que um bom atendimento é parte essencial da experiência do usuário.

1. Princípios do Atendimento
• Respeito e cordialidade
• Clareza e objetividade
• Agilidade
• Transparência

2. Canais de Atendimento
• E-mail oficial: suporte@beelio-ia.com
• WhatsApp comercial: (41) 99201-3261
• Chamado integrado no Beelio
• Base de conhecimento/FAQ disponível 24/7

3. Horário de Atendimento
• Atendimento humano: segunda a sexta-feira, das 9h às 18h (horário de Brasília)
• Atendimento automático (Diana e FAQ): disponível 24/7

4. Prazos de Resposta (SLA)
• Consultas gerais e dúvidas técnicas: até 24 horas úteis
• Solicitações de cancelamento/reembolso: até 10 dias úteis
• Demandas críticas (instabilidade, falhas graves): prioridade máxima, resposta inicial em até 2 horas úteis

5. Escalonamento de Chamados
Caso não esteja satisfeito:
• O chamado será escalonado para um analista sênior
• Persistindo, será revisado pela gestão de atendimento
• Se necessário, será direcionado à direção da empresa

6. Responsabilidades do Usuário
Para um atendimento eficiente, solicitamos que o usuário forneça informações claras, utilize os canais oficiais e respeite os prazos informados.

7. Feedback e Melhoria Contínua
O Beelio incentiva o feedback dos usuários. Periodicamente, podem ser enviadas pesquisas de satisfação (NPS).`
  },
  {
    id: "security",
    title: "Política de Segurança da Informação",
    icon: Lock,
    content: `Última atualização: 23/10/2025

Esta Política estabelece diretrizes para proteger a confidencialidade, integridade e disponibilidade das informações, garantindo conformidade com a LGPD.

1. Objetivo
Assegurar que todos os dados de usuários, colaboradores e parceiros sejam tratados de forma segura e transparente.

2. Princípios de Segurança
• Confidencialidade: informações só acessadas por pessoas autorizadas
• Integridade: proteção contra alterações não autorizadas
• Disponibilidade: informações acessíveis sempre que necessário

3. Tratamento de Dados Pessoais (LGPD)
• Coletar apenas dados estritamente necessários
• Informar de forma clara sobre o uso dos dados
• Obter consentimento explícito quando necessário
• Armazenar dados de forma segura e por tempo limitado
• Permitir que titulares exerçam seus direitos (acesso, correção, exclusão, portabilidade)

4. Segurança Técnica
• Criptografia de dados em trânsito (HTTPS) e em repouso
• Controle de acesso com autenticação forte
• Backups regulares e seguros
• Monitoramento e logs para auditoria
• Treinamento contínuo de colaboradores
• Gestão formal de incidentes
• Atualizações regulares de sistemas

5. Responsabilidades
• Usuários: manter credenciais seguras, não compartilhá-las e notificar suspeitas de violação
• Colaboradores: cumprir esta política e reportar vulnerabilidades
• Gestores: monitorar, auditar e implementar melhorias contínuas

6. Gerenciamento de Incidentes
Em caso de incidente:
• Registro e análise imediata
• Medidas de contenção
• Notificação aos usuários afetados conforme LGPD
• Identificação da causa e implementação de medidas preventivas

7. Auditoria
A plataforma realiza auditorias periódicas de segurança e conformidade com a LGPD.`
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
            <p><strong>Contato:</strong> suporte@beelio-ia.com</p>
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
            <p><strong>Canal de contato:</strong> suporte@beelio-ia.com</p>
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
  return <TeamManagement />;
}

function AprovacoesTab() {
  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Gerenciar Aprovações
          </CardTitle>
          <CardDescription>
            Revise e aprove conteúdos criados pela equipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApprovalsList />
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
    { id: "aprovacoes" as MenuSection, label: "Aprovações", icon: CheckSquare },
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
          {activeSection === "aprovacoes" && <AprovacoesTab />}
          {activeSection === "politicas" && <PoliciesTab />}
          {activeSection === "privacidade" && <PrivacyTab />}
        </div>
      </div>
    </DashboardLayout>
  );
}
