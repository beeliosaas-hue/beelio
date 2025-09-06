import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Palette, Target, Users, MessageSquare } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const Briefing = () => {
  const [brandName, setBrandName] = useState("");
  const [mission, setMission] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("");
  const [colors, setColors] = useState<string[]>([]);

  const colorOptions = [
    "#FFD84D", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", 
    "#FECA57", "#FF9FF3", "#54A0FF", "#5F27CD", "#00D2D3"
  ];

  const addColor = (color: string) => {
    if (!colors.includes(color) && colors.length < 5) {
      setColors([...colors, color]);
    }
  };

  const removeColor = (color: string) => {
    setColors(colors.filter(c => c !== color));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Briefing da Marca</h1>
          <p className="text-muted-foreground">
            Defina a identidade da sua marca para gerar conteúdos mais assertivos
          </p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário Principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="brand-name">Nome da Marca</Label>
                <Input
                  id="brand-name"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Ex: Beelio"
                />
              </div>
              
              <div>
                <Label htmlFor="mission">Missão e Propósito</Label>
                <Textarea
                  id="mission"
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  placeholder="Descreva qual é o propósito da sua marca..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Público-Alvo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="Descreva seu público ideal: idade, interesses, comportamentos..."
                rows={4}
              />
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Tom de Voz
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tom de voz da marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal e Profissional</SelectItem>
                  <SelectItem value="amigavel">Amigável e Próximo</SelectItem>
                  <SelectItem value="divertido">Divertido e Descontraído</SelectItem>
                  <SelectItem value="inspirador">Inspirador e Motivacional</SelectItem>
                  <SelectItem value="tecnico">Técnico e Especialista</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Paleta de Cores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Cores da Marca (máximo 5)</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      className="w-12 h-12 rounded-lg border-2 border-border hover:border-primary transition-smooth"
                      style={{ backgroundColor: color }}
                      onClick={() => addColor(color)}
                    />
                  ))}
                </div>
              </div>
              
              {colors.length > 0 && (
                <div>
                  <Label>Cores Selecionadas</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {colors.map((color) => (
                      <Badge
                        key={color}
                        variant="secondary"
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => removeColor(color)}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview da Marca */}
        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Preview da Identidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {brandName && (
                <div className="text-center p-4 bg-accent/30 rounded-lg">
                  <h3 className="text-2xl font-bold text-foreground">{brandName}</h3>
                  {mission && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                      {mission}
                    </p>
                  )}
                </div>
              )}
              
              {colors.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Paleta de Cores</Label>
                  <div className="flex gap-1 mt-2">
                    {colors.map((color) => (
                      <div
                        key={color}
                        className="flex-1 h-8 rounded"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {tone && (
                <div>
                  <Label className="text-sm font-medium">Tom de Voz</Label>
                  <Badge variant="outline" className="mt-1">
                    {tone}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Button className="w-full bg-honey-gradient hover:bg-primary/90 text-primary-foreground">
            Salvar Briefing
          </Button>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
};

export default Briefing;