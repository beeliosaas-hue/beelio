import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Star, MessageSquare } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const faqData = [
  {
    category: "Conta",
    questions: [
      {
        id: "create-account",
        question: "Como criar minha conta no Beelio?",
        answer: "Acesse a página inicial do Beelio, clique em 'Começar Agora' e escolha seu plano (Free, Starter ou Pro). Preencha seus dados (nome, e-mail e senha) e pronto! Você será direcionado para o onboarding rápido para personalizar sua experiência."
      },
      {
        id: "onboarding",
        question: "O que é o onboarding e por que devo preencher?",
        answer: "O onboarding é um formulário inicial onde você informa nome da marca, setor, público-alvo e objetivos. Com essas informações, a Diana IA personaliza todas as sugestões e estratégias para sua marca específica, tornando o Beelio muito mais eficiente para você."
      },
      {
        id: "change-plan",
        question: "Posso mudar de plano a qualquer momento?",
        answer: "Sim! Você pode fazer upgrade ou downgrade em Configurações > Assinatura. O upgrade é imediato com crédito proporcional, e o downgrade entra em vigor no próximo ciclo de cobrança."
      },
      {
        id: "delete-account",
        question: "Como excluir minha conta?",
        answer: "Vá em Configurações > Privacidade e Dados > Excluir Conta. Todos os seus dados serão permanentemente removidos em até 30 dias, conforme LGPD. Após exclusão, não é possível recuperar os dados."
      }
    ]
  },
  {
    category: "Integrações",
    questions: [
      {
        id: "social-networks",
        question: "Quais redes sociais posso integrar?",
        answer: "No Plano Pro você pode integrar Instagram, TikTok e LinkedIn diretamente. Seus posts agendados no calendário são publicados automaticamente. Planos Free e Starter permitem criar posts internamente, mas a publicação é manual."
      },
      {
        id: "connect-instagram",
        question: "Como conectar meu Instagram?",
        answer: "Plano Pro: Vá em Configurações > Integrações > Instagram > Conectar. Você será redirecionado para autorizar o Beelio no Facebook/Instagram. Após autorização, selecione a conta desejada e pronto!"
      },
      {
        id: "integration-security",
        question: "É seguro conectar minhas redes sociais?",
        answer: "Sim! Usamos OAuth 2.0, o mesmo padrão de segurança do Google e Facebook. Não armazenamos suas senhas e você pode revogar o acesso a qualquer momento."
      }
    ]
  },
  {
    category: "Planos",
    questions: [
      {
        id: "plans-difference",
        question: "Qual a diferença entre os planos?",
        answer: "FREE: Calendário, Briefing, Branding, 3 créditos Diana/semana. STARTER (R$ 87/mês): +Tendências, Biblioteca, 30 posts/mês, 5 créditos/dia. PRO (R$ 197/mês): Posts ilimitados, Diana ilimitada, Planner IA, Criador ADS, Integrações com redes."
      },
      {
        id: "credits-diana",
        question: "Como funcionam os créditos da Diana?",
        answer: "Cada interação com a Diana consome 1 crédito. FREE: 3 créditos/semana (renova segunda 00h). STARTER: 5 créditos/dia (renova diariamente 00h). PRO: ilimitado. Seu saldo aparece no canto inferior do chat."
      },
      {
        id: "free-limitations",
        question: "O que posso fazer no plano Free?",
        answer: "Calendário editorial simples, Briefing da marca, Branding, Sugestões rápidas de conteúdo e 3 interações semanais com a Diana. É ideal para conhecer a plataforma e planejar conteúdo básico."
      },
      {
        id: "annual-discount",
        question: "Tem desconto anual?",
        answer: "Sim! Plano Starter anual: ~15% OFF (R$ 57/mês). Plano Pro anual: ~15% OFF (R$ 127/mês). Você paga o valor total à vista e economiza significativamente."
      }
    ]
  },
  {
    category: "Relatórios",
    questions: [
      {
        id: "reports-plans",
        question: "Quais relatórios tenho acesso em cada plano?",
        answer: "FREE: Relatório básico (calendário planejado). STARTER: + Análise de tendências e biblioteca. PRO: + Métricas de engajamento, desempenho por rede social, relatórios personalizáveis e exportação avançada em PDF/CSV."
      },
      {
        id: "export-reports",
        question: "Posso exportar meus relatórios?",
        answer: "Sim! Todos os planos permitem exportação em PDF e CSV. Vá em Relatórios > Selecione o período > Exportar. Escolha o formato desejado e o download iniciará automaticamente."
      },
      {
        id: "report-frequency",
        question: "Com que frequência os relatórios são atualizados?",
        answer: "Os dados são atualizados em tempo real. Você pode gerar relatórios de qualquer período: semanal, mensal, trimestral ou personalizado."
      }
    ]
  },
  {
    category: "Diana",
    questions: [
      {
        id: "diana-capabilities",
        question: "O que a Diana pode fazer por mim?",
        answer: "A Diana gera ideias de posts, cria calendários editoriais completos, analisa concorrência, sugere tendências, cria copies prontas com hashtags, monta estratégias de campanha e responde dúvidas de marketing baseadas em frameworks profissionais (Kotler, Ogilvy, Cialdini)."
      },
      {
        id: "diana-personalization",
        question: "A Diana se adapta à minha marca?",
        answer: "Sim! Ela lê automaticamente seu Briefing (missão, público, valores) e Branding (cores, fontes, tom). Todas as sugestões são personalizadas para sua marca específica. Por isso é importante preencher essas seções!"
      },
      {
        id: "diana-limitations",
        question: "Quais limitações a Diana tem?",
        answer: "A Diana não inventa funcionalidades que o Beelio não possui, não acessa dados de terceiros sem autorização e respeita os limites de créditos do seu plano. Ela é especialista em marketing, mas sempre baseada em dados reais e frameworks reconhecidos."
      },
      {
        id: "diana-language",
        question: "A Diana fala português brasileiro?",
        answer: "Perfeitamente! Ela foi treinada especificamente para o mercado brasileiro, incluindo datas comemorativas locais, gírias, comportamento do consumidor nacional e tendências regionais."
      }
    ]
  },
  {
    category: "Suporte",
    questions: [
      {
        id: "support-channels",
        question: "Como entro em contato com o suporte?",
        answer: "Você pode abrir um chamado direto na plataforma (Suporte 24/7 > Abrir Chamado), enviar e-mail para suporte@beelio-ia.com ou, em casos urgentes, usar o WhatsApp prioritário disponível nos planos pagos."
      },
      {
        id: "response-time",
        question: "Qual o tempo de resposta do suporte?",
        answer: "Chamados normais: até 24h. Prioridade (Starter): até 12h. Urgência (Pro): até 4h. Emergências críticas são tratadas imediatamente via WhatsApp (apenas Pro)."
      },
      {
        id: "help-center",
        question: "Onde encontro tutoriais e guias?",
        answer: "Acesse a Base de Conhecimento em Suporte 24/7. Lá você encontra artigos, vídeos tutoriais e guias passo a passo sobre todas as funcionalidades do Beelio."
      }
    ]
  }
];

const featuredQuestions = [
  { id: "create-account", label: "Como criar minha conta no Beelio?" },
  { id: "plans-difference", label: "Qual a diferença entre os planos?" },
  { id: "credits-diana", label: "Como funcionam os créditos da Diana?" },
  { id: "diana-capabilities", label: "O que a Diana pode fazer por mim?" },
  { id: "social-networks", label: "Quais redes sociais posso integrar?" },
  { id: "export-reports", label: "Posso exportar meus relatórios?" }
];

interface FAQSectionProps {
  onOpenTicket: () => void;
}

export function FAQSection({ onOpenTicket }: FAQSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const filteredFAQ = faqData
    .filter(cat => selectedCategory === "Todas" || cat.category === selectedCategory)
    .map(cat => ({
      ...cat,
      questions: cat.questions.filter(q =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(cat => cat.questions.length > 0);

  const totalResults = filteredFAQ.reduce((acc, cat) => acc + cat.questions.length, 0);

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Busque por palavras-chave..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas">Todas as categorias</SelectItem>
            {faqData.map(cat => (
              <SelectItem key={cat.category} value={cat.category}>
                {cat.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Featured Questions */}
      {!searchQuery && selectedCategory === "Todas" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Perguntas Mais Frequentes</h3>
          </div>
          <div className="grid gap-2">
            {featuredQuestions.map(fq => {
              const allQuestions = faqData.flatMap(cat => cat.questions);
              const question = allQuestions.find(q => q.id === fq.id);
              return (
                <Button
                  key={fq.id}
                  variant="outline"
                  className="justify-start text-left h-auto py-3 px-4"
                  onClick={() => {
                    const element = document.getElementById(`faq-${fq.id}`);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {fq.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* FAQ List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          Todas as Perguntas
          {totalResults > 0 && (
            <span className="text-muted-foreground ml-2">
              ({totalResults} {totalResults === 1 ? "resultado" : "resultados"})
            </span>
          )}
        </h3>

        {filteredFAQ.length === 0 ? (
          <Alert>
            <AlertDescription>
              Nenhuma pergunta encontrada com esses critérios. Tente pesquisar por outros termos ou{" "}
              <Button variant="link" className="p-0 h-auto" onClick={onOpenTicket}>
                abra um chamado
              </Button>
              {" "}para obter ajuda personalizada.
            </AlertDescription>
          </Alert>
        ) : (
          filteredFAQ.map(category => (
            <div key={category.category} className="space-y-3">
              <h4 className="font-medium text-primary">{category.category}</h4>
              <Accordion type="single" collapsible className="space-y-2">
                {category.questions.map(q => (
                  <AccordionItem
                    key={q.id}
                    value={q.id}
                    id={`faq-${q.id}`}
                    className="border border-border rounded-lg px-4 bg-accent/20"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      {q.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {q.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))
        )}
      </div>

      {/* CTA to Open Ticket */}
      <Alert className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-500/50">
        <MessageSquare className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-sm">
            <strong>Não encontrou o que procurava?</strong><br />
            Nossa equipe está pronta para ajudar você com questões específicas
          </span>
          <Button onClick={onOpenTicket} className="bg-honey-gradient hover:bg-primary/90 ml-4">
            Abrir Chamado
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
