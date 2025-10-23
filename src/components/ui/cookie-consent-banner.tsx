import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Cookie, Settings, Shield, BarChart3, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface CookiePreferences {
  essential: boolean;
  performance: boolean;
  functionality: boolean;
  thirdParty: boolean;
}

const STORAGE_KEY = "beelio_cookie_consent";

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    performance: false,
    functionality: false,
    thirdParty: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      // Aguarda 1 segundo antes de mostrar o banner para melhor UX
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const saveConsent = (consentType: "all" | "essential" | "custom") => {
    let finalPreferences: CookiePreferences;

    if (consentType === "all") {
      finalPreferences = {
        essential: true,
        performance: true,
        functionality: true,
        thirdParty: true,
      };
    } else if (consentType === "essential") {
      finalPreferences = {
        essential: true,
        performance: false,
        functionality: false,
        thirdParty: false,
      };
    } else {
      finalPreferences = preferences;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        type: consentType,
        preferences: finalPreferences,
        timestamp: new Date().toISOString(),
      })
    );

    setIsVisible(false);
    setShowCustomize(false);
  };

  const handleAcceptAll = () => {
    saveConsent("all");
  };

  const handleRejectNonEssential = () => {
    saveConsent("essential");
  };

  const handleCustomize = () => {
    setShowCustomize(true);
  };

  const handleSaveCustom = () => {
    saveConsent("custom");
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Banner Principal */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6",
          "bg-background/95 backdrop-blur-sm border-t border-border shadow-lg",
          "animate-in slide-in-from-bottom duration-500"
        )}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Ícone e Conteúdo */}
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <Cookie className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground text-base">
                  🍪 Nós valorizamos sua privacidade
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Usamos cookies para melhorar sua experiência, personalizar conteúdo e analisar o
                  tráfego. Ao clicar em "Aceitar todos", você concorda com o uso de cookies conforme
                  nossa{" "}
                  <a
                    href="/configuracoes"
                    className="text-primary hover:underline font-medium"
                  >
                    Política de Cookies
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCustomize}
                className="w-full sm:w-auto order-3 sm:order-1"
              >
                <Settings className="h-4 w-4 mr-2" />
                Personalizar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRejectNonEssential}
                className="w-full sm:w-auto order-2"
              >
                Rejeitar não essenciais
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="w-full sm:w-auto order-1 sm:order-3 bg-primary hover:bg-primary/90"
              >
                Aceitar todos
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Personalização */}
      <Dialog open={showCustomize} onOpenChange={setShowCustomize}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              Preferências de Cookies
            </DialogTitle>
            <DialogDescription>
              Escolha quais tipos de cookies você deseja aceitar. Os cookies essenciais são
              obrigatórios para o funcionamento básico da plataforma.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Cookies Essenciais */}
            <div className="flex items-start justify-between gap-4 p-4 border border-border rounded-lg bg-accent/30">
              <div className="flex items-start gap-3 flex-1">
                <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <Label className="text-base font-semibold text-foreground flex items-center gap-2">
                    Cookies Essenciais
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                      Obrigatório
                    </span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Necessários para o funcionamento básico da plataforma, como autenticação,
                    segurança e preferências de sessão. Estes cookies não podem ser desativados.
                  </p>
                </div>
              </div>
              <Switch checked={preferences.essential} disabled className="mt-1 shrink-0" />
            </div>

            {/* Cookies de Desempenho */}
            <div className="flex items-start justify-between gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-start gap-3 flex-1">
                <BarChart3 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <Label
                    htmlFor="performance"
                    className="text-base font-semibold text-foreground cursor-pointer"
                  >
                    Cookies de Desempenho
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Coletam informações anônimas sobre como você usa a plataforma, ajudando-nos a
                    melhorar a experiência e corrigir problemas.
                  </p>
                </div>
              </div>
              <Switch
                id="performance"
                checked={preferences.performance}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, performance: checked })
                }
                className="mt-1 shrink-0"
              />
            </div>

            {/* Cookies de Funcionalidade */}
            <div className="flex items-start justify-between gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-start gap-3 flex-1">
                <Zap className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <Label
                    htmlFor="functionality"
                    className="text-base font-semibold text-foreground cursor-pointer"
                  >
                    Cookies de Funcionalidade
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Lembram suas escolhas e preferências (como idioma, tema, cores da marca) para
                    oferecer uma experiência personalizada.
                  </p>
                </div>
              </div>
              <Switch
                id="functionality"
                checked={preferences.functionality}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, functionality: checked })
                }
                className="mt-1 shrink-0"
              />
            </div>

            {/* Cookies de Terceiros */}
            <div className="flex items-start justify-between gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="h-5 w-5 text-purple-500 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <Label
                    htmlFor="thirdParty"
                    className="text-base font-semibold text-foreground cursor-pointer"
                  >
                    Cookies de Terceiros
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Utilizados por serviços integrados (como redes sociais, analytics e
                    pagamentos) para fornecer funcionalidades adicionais.
                  </p>
                </div>
              </div>
              <Switch
                id="thirdParty"
                checked={preferences.thirdParty}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, thirdParty: checked })
                }
                className="mt-1 shrink-0"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCustomize(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveCustom} className="w-full sm:w-auto">
              Salvar Preferências
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
