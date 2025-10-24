import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

interface OnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

export function OnboardingModal({ open, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Dados do formulário
  const [brandName, setBrandName] = useState('');
  const [segment, setSegment] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [mainGoals, setMainGoals] = useState<string[]>([]);
  const [brandColors, setBrandColors] = useState('');
  const [toneOfVoice, setToneOfVoice] = useState('');

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const goals = [
    'Aumentar reconhecimento de marca',
    'Aumentar engajamento',
    'Gerar leads',
    'Aumentar vendas',
    'Lançar produto/serviço',
    'Educar público'
  ];

  const toggleGoal = (goal: string) => {
    setMainGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Salvar briefing básico
      await supabase.from('briefings').insert({
        user_id: user.id,
        nome_marca: brandName,
        segmento_atuacao: segment,
        cliente_ideal: targetAudience,
        objetivos_marketing: mainGoals,
        tom_voz: toneOfVoice,
        status: 'em_andamento',
        progresso: 50
      });

      // Salvar branding básico
      await supabase.from('brandings').insert({
        user_id: user.id,
        nome_marca: brandName,
        paleta_cores: brandColors.split(',').map(c => c.trim()).filter(Boolean)
      });

      toast.success('Perfil criado com sucesso! Bem-vindo ao Beelio! 🐝✨');
      onComplete();
    } catch (error) {
      console.error('Erro ao salvar onboarding:', error);
      toast.error('Erro ao salvar suas informações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return brandName.trim() !== '' && segment !== '';
      case 2:
        return targetAudience.trim() !== '';
      case 3:
        return mainGoals.length > 0;
      case 4:
        return toneOfVoice !== '';
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Bem-vindo ao Beelio!
            </DialogTitle>
            <span className="text-sm text-muted-foreground">
              Passo {step} de {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Vamos conhecer sua marca! 🐝</h3>
                <p className="text-sm text-muted-foreground">
                  Essas informações nos ajudam a personalizar todo o Beelio para você.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brandName">Nome da sua marca *</Label>
                <Input
                  id="brandName"
                  placeholder="Ex: Beelio Marketing"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="segment">Segmento de atuação *</Label>
                <Select value={segment} onValueChange={setSegment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu segmento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="saas">SaaS/Tecnologia</SelectItem>
                    <SelectItem value="servicos">Serviços</SelectItem>
                    <SelectItem value="alimentacao">Alimentação</SelectItem>
                    <SelectItem value="beleza">Beleza e Estética</SelectItem>
                    <SelectItem value="saude">Saúde e Bem-estar</SelectItem>
                    <SelectItem value="educacao">Educação</SelectItem>
                    <SelectItem value="moda">Moda e Vestuário</SelectItem>
                    <SelectItem value="consultoria">Consultoria</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Quem é seu público-alvo? 🎯</h3>
                <p className="text-sm text-muted-foreground">
                  Conhecer seu público nos ajuda a criar conteúdo mais assertivo.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Descreva seu cliente ideal *</Label>
                <Textarea
                  id="targetAudience"
                  placeholder="Ex: Empreendedores de 25-45 anos que buscam automatizar marketing, classe B/C, ativos em redes sociais..."
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">
                  Inclua: idade, profissão, interesses, dores e comportamentos
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Quais são seus objetivos? 🚀</h3>
                <p className="text-sm text-muted-foreground">
                  Selecione um ou mais objetivos principais (você pode mudar depois).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {goals.map((goal) => (
                  <Button
                    key={goal}
                    variant={mainGoals.includes(goal) ? 'default' : 'outline'}
                    className="h-auto py-3 text-left justify-start"
                    onClick={() => toggleGoal(goal)}
                  >
                    {goal}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Identidade visual básica 🎨</h3>
                <p className="text-sm text-muted-foreground">
                  Essas informações ajudarão a Diana a criar conteúdos alinhados à sua marca.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandColors">Cores principais da marca</Label>
                <Input
                  id="brandColors"
                  placeholder="Ex: Azul, Amarelo, Branco"
                  value={brandColors}
                  onChange={(e) => setBrandColors(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Separe por vírgula. Você pode adicionar mais detalhes depois.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="toneOfVoice">Tom de voz *</Label>
                <Select value={toneOfVoice} onValueChange={setToneOfVoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Como sua marca se comunica?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal e profissional</SelectItem>
                    <SelectItem value="descontraido">Descontraído e amigável</SelectItem>
                    <SelectItem value="inspirador">Inspirador e motivacional</SelectItem>
                    <SelectItem value="tecnico">Técnico e educativo</SelectItem>
                    <SelectItem value="divertido">Divertido e criativo</SelectItem>
                    <SelectItem value="luxo">Sofisticado e elegante</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-accent/30 p-4 rounded-lg border border-primary/20">
                <p className="text-sm">
                  <strong>🐝 Dica da Diana:</strong> Você pode complementar essas informações
                  depois nas seções Briefing e Branding do menu. Quanto mais completo, melhor!
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} disabled={loading}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          )}
          
          <div className="flex-1" />

          {step < totalSteps ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Próximo
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={!canProceed() || loading}>
              {loading ? 'Salvando...' : 'Finalizar'}
              <Sparkles className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
