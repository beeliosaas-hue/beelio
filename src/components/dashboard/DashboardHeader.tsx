import { Bell, HelpCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TooltipCustom } from "@/components/ui/tooltip-custom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import beelioLogo from "@/assets/beelio-logo.png";
import { useNavigate } from "react-router-dom";

export function DashboardHeader() {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-50 shadow-soft">
      {/* Logo Section */}
      <div className="flex items-center space-x-3">
        <img 
          src={beelioLogo} 
          alt="Beelio - Calendário Inteligente de Marketing" 
          className="h-10 w-auto cursor-pointer hover-scale"
          onClick={() => navigate('/')}
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <TooltipCustom content="Notificações (3 novas)">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover-scale">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-primary text-primary-foreground text-xs animate-pulse-glow">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 animate-slide-in-right">
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover-lift cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Nova tendência detectada! 🚨</p>
                  <p className="text-xs text-muted-foreground">Marketing digital está em alta hoje</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover-lift cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Diana tem sugestões 🐝</p>
                  <p className="text-xs text-muted-foreground">3 ideias de posts para esta semana</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover-lift cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Post agendado com sucesso ✅</p>
                  <p className="text-xs text-muted-foreground">Seu post será publicado às 14h</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipCustom>

        {/* Support */}
        <TooltipCustom content="Central de Ajuda">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover-scale"
            onClick={() => navigate('/suporte')}
          >
            <HelpCircle className="w-5 h-5" />
          </Button>
        </TooltipCustom>

        {/* User Account */}
        <TooltipCustom content="Minha Conta">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 hover-scale">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="animate-slide-in-right">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/configuracoes')} className="cursor-pointer">
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/configuracoes')} className="cursor-pointer">
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Planos</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive">Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipCustom>
      </div>
    </header>
  );
}