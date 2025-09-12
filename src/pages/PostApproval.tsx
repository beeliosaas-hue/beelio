import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Check, X, Edit3, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for the post to be approved
const mockPost = {
  id: "post-123",
  content: "🎉 Novidade incrível chegando! Nossa equipe trabalhou incansavelmente para trazer uma solução inovadora que vai revolucionar sua experiência. Fique ligado para mais detalhes em breve! 🚀\n\n#inovação #tecnologia #novidade #marketing",
  image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
  scheduledDate: "2025-01-15",
  scheduledTime: "14:30",
  socialNetworks: ["instagram", "facebook", "linkedin"],
  brand: {
    name: "TechInova",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop"
  }
};

export default function PostApproval() {
  const [selectedNetwork, setSelectedNetwork] = useState("instagram");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showAdjustForm, setShowAdjustForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [adjustNotes, setAdjustNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submissionType, setSubmissionType] = useState<"approved" | "rejected" | "adjustment" | null>(null);

  const handleApprove = () => {
    setSubmissionType("approved");
    setSubmitted(true);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    setSubmissionType("rejected");
    setSubmitted(true);
  };

  const handleRequestAdjustment = () => {
    setSubmissionType("adjustment");
    setSubmitted(true);
  };

  const getSocialIcon = (network: string) => {
    switch (network) {
      case "facebook":
        return <Facebook className="h-4 w-4" />;
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4" />;
      case "youtube":
        return <Youtube className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getSocialColor = (network: string) => {
    switch (network) {
      case "facebook":
        return "bg-blue-600 text-white";
      case "instagram":
        return "bg-gradient-to-r from-purple-600 to-pink-600 text-white";
      case "linkedin":
        return "bg-blue-700 text-white";
      case "youtube":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getNetworkDisplayName = (network: string) => {
    switch (network) {
      case "facebook":
        return "Facebook";
      case "instagram":
        return "Instagram";
      case "linkedin":
        return "LinkedIn";
      case "youtube":
        return "YouTube";
      default:
        return network;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            {submissionType === "approved" && (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Post aprovado com sucesso ✅
                </h2>
                <p className="text-muted-foreground">
                  O post foi aprovado e será publicado conforme agendado.
                </p>
              </>
            )}
            
            {submissionType === "rejected" && (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Post reprovado ❌
                </h2>
                <p className="text-muted-foreground">
                  Sua justificativa foi enviada ao criador.
                </p>
              </>
            )}
            
            {submissionType === "adjustment" && (
              <>
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Edit3 className="h-8 w-8 text-yellow-600" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Ajuste solicitado ✏️
                </h2>
                <p className="text-muted-foreground">
                  Sua observação foi registrada.
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Beelio – Organize e simplifique seu marketing.
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/src/assets/beelio-logo.png" 
              alt="Beelio" 
              className="h-8"
            />
          </div>
          <div className="flex items-center space-x-3">
            <img 
              src={mockPost.brand.logo} 
              alt={mockPost.brand.name} 
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-muted-foreground">
              {mockPost.brand.name}
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Post Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Social Networks Selector */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      Visualizar como:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {mockPost.socialNetworks.map((network) => (
                        <Button
                          key={network}
                          variant={selectedNetwork === network ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedNetwork(network)}
                          className={cn(
                            "flex items-center space-x-2",
                            selectedNetwork === network && getSocialColor(network)
                          )}
                        >
                          {getSocialIcon(network)}
                          <span>{getNetworkDisplayName(network)}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="border rounded-lg p-4 bg-card">
                    <div className="flex items-start space-x-3 mb-4">
                      <img 
                        src={mockPost.brand.logo} 
                        alt={mockPost.brand.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {mockPost.brand.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {getNetworkDisplayName(selectedNetwork)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-foreground whitespace-pre-wrap">
                        {mockPost.content}
                      </p>
                      
                      <img 
                        src={mockPost.image} 
                        alt="Post"
                        className="w-full rounded-lg object-cover"
                      />
                    </div>
                  </div>

                  {/* Scheduling Info */}
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Agendamento
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(mockPost.scheduledDate).toLocaleDateString('pt-BR')} às {mockPost.scheduledTime}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      {mockPost.socialNetworks.map((network) => (
                        <Badge 
                          key={network} 
                          variant="secondary" 
                          className="text-xs"
                        >
                          {getNetworkDisplayName(network)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Ações de Aprovação
                </h3>
                
                <div className="space-y-4">
                  {/* Approve Button */}
                  <Button 
                    onClick={handleApprove}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Aprovar Post
                  </Button>

                  {/* Reject Button */}
                  <Button 
                    onClick={() => setShowRejectForm(!showRejectForm)}
                    variant="destructive"
                    className="w-full"
                    size="lg"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reprovar Post
                  </Button>

                  {showRejectForm && (
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Justifique o motivo da reprovação (obrigatório)"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="min-h-24"
                      />
                      <div className="flex space-x-2">
                        <Button 
                          onClick={handleReject}
                          variant="destructive"
                          size="sm"
                          disabled={!rejectReason.trim()}
                        >
                          Confirmar Reprovação
                        </Button>
                        <Button 
                          onClick={() => setShowRejectForm(false)}
                          variant="outline"
                          size="sm"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Request Adjustment Button */}
                  <Button 
                    onClick={() => setShowAdjustForm(!showAdjustForm)}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                    size="lg"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Solicitar Ajuste
                  </Button>

                  {showAdjustForm && (
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Observações sobre ajustes necessários (opcional)"
                        value={adjustNotes}
                        onChange={(e) => setAdjustNotes(e.target.value)}
                        className="min-h-24"
                      />
                      <div className="flex space-x-2">
                        <Button 
                          onClick={handleRequestAdjustment}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white"
                          size="sm"
                        >
                          Enviar Solicitação
                        </Button>
                        <Button 
                          onClick={() => setShowAdjustForm(false)}
                          variant="outline"
                          size="sm"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>
                    Esta aprovação é segura e não requer login
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-12">
        <div className="container mx-auto px-6 py-4 text-center">
          <p className="text-sm text-muted-foreground">
            Beelio – Organize e simplifique seu marketing.
          </p>
        </div>
      </footer>
    </div>
  );
}