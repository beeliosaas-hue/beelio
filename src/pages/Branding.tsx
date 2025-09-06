import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Palette, Type, Image, Download, Eye } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const Branding = () => {
  const [logos, setLogos] = useState({
    primary: null,
    secondary: null,
    submark: null,
    logomark: null
  });

  const colorPalette = [
    { name: "Primária", color: "#FFD84D", usage: "Logos e CTAs principais" },
    { name: "Secundária", color: "#FFF8E1", usage: "Fundos e áreas secundárias" },
    { name: "Texto", color: "#2D3748", usage: "Títulos e textos principais" },
    { name: "Cinza", color: "#718096", usage: "Textos secundários" },
    { name: "Branco", color: "#FFFFFF", usage: "Fundos e contrastes" }
  ];

  const fonts = [
    { name: "Inter", type: "Primária", usage: "Títulos e headings", weight: "400, 600, 700" },
    { name: "Open Sans", type: "Secundária", usage: "Corpo de texto", weight: "400, 600" },
    { name: "Poppins", type: "Complementar", usage: "CTAs e destaques", weight: "500, 700" }
  ];

  const assets = [
    { name: "Ícone Abelha", type: "Ícone", format: "SVG" },
    { name: "Ilustração Mel", type: "Ilustração", format: "PNG" },
    { name: "Pattern Hexágono", type: "Padrão", format: "SVG" },
    { name: "Mascote Beelio", type: "Mascote", format: "PNG" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Branding</h1>
          <p className="text-muted-foreground">
            Gerencie todos os elementos visuais da sua marca
          </p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logos */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                Logos da Marca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(logos).map(([type, logo]) => (
                  <div key={type} className="space-y-2">
                    <label className="text-sm font-medium capitalize">{type} Logo</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-smooth cursor-pointer">
                      {logo ? (
                        <div>Logo carregado</div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                          <p className="text-sm text-muted-foreground">
                            Upload {type}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Paleta de Cores */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Paleta de Cores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {colorPalette.map((color, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border border-border rounded-lg">
                    <div
                      className="w-16 h-16 rounded-lg border border-border"
                      style={{ backgroundColor: color.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{color.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {color.color}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{color.usage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tipografia */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5 text-primary" />
                Tipografia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fonts.map((font, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium" style={{ fontFamily: font.name }}>
                          {font.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {font.type}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {font.weight}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{font.usage}</p>
                    <div className="mt-3 space-y-1">
                      <p className="text-2xl font-bold" style={{ fontFamily: font.name }}>
                        The quick brown fox
                      </p>
                      <p className="text-base" style={{ fontFamily: font.name }}>
                        jumps over the lazy dog
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock Post */}
                <div className="bg-gradient-to-br from-bee-yellow-light to-white p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-bee-yellow rounded-full flex items-center justify-center">
                      🐝
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Beelio</p>
                      <p className="text-xs text-muted-foreground">@beelio_oficial</p>
                    </div>
                  </div>
                  <p className="text-sm mb-3">
                    🍯 Organize seu marketing como uma abelha organiza sua colmeia! 
                    Nossa IA te ajuda a criar posts incríveis.
                  </p>
                  <div className="bg-white rounded p-3 text-center">
                    <p className="font-bold text-bee-yellow-dark">Calendário Inteligente</p>
                    <p className="text-xs text-muted-foreground">Powered by Beelio</p>
                  </div>
                </div>

                {/* Mock Business Card */}
                <div className="bg-white border-2 border-bee-yellow p-4 rounded-lg">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-bee-yellow rounded-full flex items-center justify-center mx-auto mb-2">
                      🐝
                    </div>
                    <h3 className="font-bold text-bee-yellow-dark">Beelio</h3>
                    <p className="text-xs text-muted-foreground">Calendário Inteligente</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assets da Marca */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                Assets da Marca
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assets.map((asset, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-accent/30 rounded-lg transition-smooth">
                  <div>
                    <p className="font-medium text-sm">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">{asset.type} • {asset.format}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button variant="outline" size="sm" className="w-full mt-3">
                <Upload className="h-4 w-4 mr-2" />
                Adicionar Asset
              </Button>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="space-y-3">
            <Button className="w-full bg-honey-gradient hover:bg-primary/90">
              <Download className="h-4 w-4 mr-2" />
              Exportar Brand Kit
            </Button>
            <Button variant="outline" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Gerar Mockups
            </Button>
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
};

export default Branding;