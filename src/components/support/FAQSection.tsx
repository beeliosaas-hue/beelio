import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Star, MessageSquare } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const faqData = [
  {
    category: "Funcionalidades",
    questions: [
      {
        id: "campaign-create",
        question: "Como criar minha primeira campanha no Beelio?",
        answer: "Para criar sua primeira campanha, acesse o Planner IA no menu lateral, clique em 'Nova Campanha', preencha o objetivo, selecione as plataformas e defina a duração. A Diana IA irá gerar automaticamente um plano completo de conteúdo para você."
      },
      {
        id: "social-support",
        question: "Quais redes sociais o Beelio suporta?",
        answer: "O Beelio suporta as principais redes sociais: Instagram, Facebook, TikTok, LinkedIn e YouTube. Você pode publicar e programar conteúdo diretamente para todas essas plataformas através da nossa interface integrada."
      },
      {
        id: "plan-billing",
        question: "Como funciona a cobrança dos planos?",
        answer: "Os planos são cobrados mensalmente: Plano Free (gratuito), Starter (R$ 67/mês) e Pro (R$ 147/mês). Oferecemos desconto de aproximadamente 15% para assinaturas anuais. Você pode cancelar a qualquer momento sem multa."
      },
      {
        id: "diana-portuguese",
        question: "A Diana IA entende português brasileiro?",
        answer: "Sim! A Diana foi treinada especificamente para entender português brasileiro e conhece profundamente o mercado brasileiro, incluindo datas comemorativas locais, tendências e comportamento do consumidor nacional."
      }
    ]
  },
  {
    category: "Plataforma",
    questions: [
      {
        id: "calendar-sync",
        question: "Como sincronizar o calendário com minhas redes sociais?",
        answer: "No Plano Pro, você pode conectar suas redes sociais através de Configurações > Integrações. Após conectar, todos os posts agendados no calendário serão automaticamente publicados nas plataformas selecionadas."
      },
      {
        id: "library-storage",
        question: "Qual o limite de armazenamento na Biblioteca?",
        answer: "Plano Free: 500MB | Starter: 5GB | Pro: 50GB. Você pode fazer upload de imagens, vídeos, artes e documentos. Todos os arquivos ficam organizados com tags para fácil localização."
      }
    ]
  },
  {
    category: "Pagamentos",
    questions: [
      {
        id: "payment-methods",
        question: "Quais formas de pagamento são aceitas?",
        answer: "Aceitamos cartão de crédito (Visa, Mastercard, Amex, Elo), PIX e boleto bancário. O pagamento é processado de forma segura através do Stripe."
      },
      {
        id: "upgrade-plan",
        question: "Posso fazer upgrade do meu plano a qualquer momento?",
        answer: "Sim! Você pode fazer upgrade imediatamente. O valor proporcional do plano atual será creditado e você terá acesso instantâneo aos recursos do novo plano."
      }
    ]
  },
  {
    category: "Cancelamento",
    questions: [
      {
        id: "cancel-subscription",
        question: "Posso cancelar meu plano a qualquer momento?",
        answer: "Sim, você pode cancelar a qualquer momento em Configurações > Assinatura. Seu acesso continuará até o final do período já pago. Não há multa de cancelamento."
      },
      {
        id: "refund-policy",
        question: "Como solicitar reembolso?",
        answer: "Oferecemos reembolso integral se solicitado em até 7 dias após a compra. Para solicitar, abra um chamado ou entre em contato via suporte@beelio.com.br."
      }
    ]
  }
];

const featuredQuestions = [
  { id: "campaign-create", label: "Como criar minha primeira campanha no Beelio?" },
  { id: "social-support", label: "Quais redes sociais o Beelio suporta?" },
  { id: "plan-billing", label: "Como funciona a cobrança dos planos?" },
  { id: "diana-portuguese", label: "A Diana IA entende português brasileiro?" }
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
