import { useState } from "react";
import { MessageCircle, Send, X, Sparkles, Calendar, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import beelioIcon from "@/assets/beelio-icon.png";

interface Message {
  id: string;
  type: "user" | "diana";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const mockMessages: Message[] = [
  {
    id: "1",
    type: "diana",
    content: "Olá! Sou a Diana, sua assistente inteligente de marketing. Como posso ajudar você hoje?",
    timestamp: new Date(),
  },
  {
    id: "2",
    type: "user",
    content: "Preciso de ideias para posts sobre sustentabilidade",
    timestamp: new Date(),
  },
  {
    id: "3",
    type: "diana",
    content: "Ótima escolha! Aqui estão 3 ideias de posts sobre sustentabilidade para sua marca:",
    timestamp: new Date(),
    suggestions: [
      "5 dicas práticas para reduzir o desperdício no dia a dia",
      "Como nossa empresa adota práticas sustentáveis",
      "Pequenas ações que fazem grande diferença no meio ambiente"
    ],
  },
];

export function DianaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate Diana's response
    setTimeout(() => {
      const dianaResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "diana",
        content: "Entendi! Deixe-me pensar em algumas sugestões para você...",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, dianaResponse]);
    }, 1000);
  };

  const handleDragToCalendar = (suggestion: string) => {
    // This would integrate with the calendar component
    console.log("Arrastar para calendário:", suggestion);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-honey-gradient hover:bg-primary/90 shadow-elevation z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-elevation z-50 bg-card border-border">
      <CardHeader className="bg-honey-gradient text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
              <img src={beelioIcon} alt="Diana" className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-lg">Diana IA</CardTitle>
              <p className="text-sm opacity-90">Sua assistente de marketing</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col h-full p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.type === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] p-3 rounded-lg",
                  message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                <p className="text-sm">{message.content}</p>
                
                {message.suggestions && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-1 text-xs opacity-70">
                      <Sparkles className="h-3 w-3" />
                      <span>Sugestões (arraste para o calendário):</span>
                    </div>
                    {message.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="bg-card p-2 rounded border text-sm cursor-move hover:shadow-soft transition-smooth flex items-center justify-between group"
                        draggable
                        onDragStart={() => handleDragToCalendar(suggestion)}
                      >
                        <span className="text-foreground">{suggestion}</span>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-smooth">
                          <GripVertical className="h-3 w-3 text-muted-foreground" />
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-muted/30">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua pergunta..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              size="icon"
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex space-x-2">
              <Badge variant="secondary" className="text-xs">
                ∞ Créditos
              </Badge>
              <Badge variant="outline" className="text-xs">
                Plano Pro
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">Sempre online</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}