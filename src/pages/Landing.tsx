import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Sparkles, Calendar, TrendingUp, BarChart3, Zap, Users, Shield } from "lucide-react";
import beelioLogo from "@/assets/beelio-logo.png";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      price: "Gratuito",
      description: "Perfeito para começar",
      features: [
        "Calendário editorial simples",
        "Briefing da marca",
        "Branding da marca",
        "3 créditos Diana/semana",
        "Sugestões rápidas"
      ],
      cta: "Começar Grátis",
      popular: false
    },
    {
      name: "Starter",
      price: "R$ 87",
      period: "/mês",
      description: "Para crescer consistente",
      features: [
        "Tudo do Free +",
        "Calendário de tendências",
        "Biblioteca centralizada",
        "30 posts/mês",
        "5 créditos Diana/dia",
        "Relatórios avançados"
      ],
      cta: "Iniciar Teste",
      popular: true
    },
    {
      name: "Pro",
      price: "R$ 197",
      period: "/mês",
      description: "Para escalar sem limites",
      features: [
        "Tudo do Starter +",
        "Posts ilimitados",
        "Diana ilimitada",
        "Planner IA",
        "Criador ADS",
        "Integrações redes sociais",
        "Suporte prioritário"
      ],
      cta: "Começar Agora",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <img src={beelioLogo} alt="Beelio" className="h-10" />
        <Button variant="outline" onClick={() => navigate('/login')}>
          Entrar
        </Button>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-4 bg-honey-gradient">
          <Sparkles className="h-3 w-3 mr-1" />
          O calendário que pensa por você
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
          Marketing inteligente,<br />resultados reais 🐝
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Centralize planejamento, criação e publicação. Com IA, tendências e consultoria integrada.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="bg-honey-gradient" onClick={() => navigate('/signup')}>
            Começar Grátis
          </Button>
          <Button size="lg" variant="outline">
            Ver Demonstração
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Tudo em um só lugar</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Calendar, title: "Calendário Inteligente", desc: "Planeje com datas, tendências e sugestões automáticas" },
            { icon: Sparkles, title: "Diana IA", desc: "Consultora de marketing 24/7 treinada em frameworks profissionais" },
            { icon: TrendingUp, title: "Tendências em Tempo Real", desc: "Identifique oportunidades antes da concorrência" },
            { icon: BarChart3, title: "Relatórios Estratégicos", desc: "Dashboards personalizáveis com insights acionáveis" },
            { icon: Zap, title: "Publicação Automática", desc: "Agende e publique direto nas redes sociais" },
            { icon: Users, title: "Colaboração em Equipe", desc: "Trabalhe junto com seu time em tempo real" }
          ].map((feature, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">Planos para cada momento</h2>
        <p className="text-center text-muted-foreground mb-12">Comece grátis. Cresça quando quiser.</p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <Card key={i} className={plan.popular ? "border-primary shadow-lg" : ""}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-honey-gradient">
                  Mais Popular
                </Badge>
              )}
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-none shadow-xl">
          <CardContent className="py-12">
            <h2 className="text-3xl font-bold mb-4">Pronto para voar alto? 🚀</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Junte-se a centenas de empresas que já automatizaram seu marketing com o Beelio.
            </p>
            <Button size="lg" className="bg-honey-gradient" onClick={() => navigate('/signup')}>
              Criar Conta Grátis
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Beelio. Todos os direitos reservados.</p>
          <p className="mt-2">
            <a href="/suporte" className="hover:text-primary">Suporte</a> • 
            <a href="/configuracoes" className="hover:text-primary ml-2">Privacidade</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
