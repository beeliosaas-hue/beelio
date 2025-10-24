import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Check, X, Edit3, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import beelioLogo from "@/assets/beelio-logo.png";

interface Post {
  id: string;
  titulo: string;
  conteudo: string;
  midia_urls: string[];
  redes_sociais: string[];
  data_agendamento: string;
  status: string;
  user_id: string;
}

// Ícone TikTok customizado
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export default function PostApproval() {
  const { postId } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState("instagram");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showAdjustForm, setShowAdjustForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [adjustNotes, setAdjustNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submissionType, setSubmissionType] = useState<"approved" | "rejected" | "adjustment" | null>(null);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .eq("status", "aprovacao")
        .single();

      if (error) throw error;
      
      setPost(data);
      if (data.redes_sociais && data.redes_sociais.length > 0) {
        setSelectedNetwork(data.redes_sociais[0]);
      }
    } catch (error: any) {
      console.error("Erro ao carregar post:", error);
      toast.error("Post não encontrado ou já foi processado");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({ 
          status: "agendado",
          updated_at: new Date().toISOString()
        })
        .eq("id", postId);

      if (error) throw error;

      setSubmissionType("approved");
      setSubmitted(true);
      toast.success("Post aprovado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao aprovar post:", error);
      toast.error("Erro ao aprovar post. Tente novamente.");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Por favor, justifique a reprovação");
      return;
    }

    try {
      const { error } = await supabase
        .from("posts")
        .update({ 
          status: "reprovado",
          conteudo: `${post?.conteudo}\n\n---\nMotivo da reprovação: ${rejectReason}`,
          updated_at: new Date().toISOString()
        })
        .eq("id", postId);

      if (error) throw error;

      setSubmissionType("rejected");
      setSubmitted(true);
      toast.success("Reprovação registrada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao reprovar post:", error);
      toast.error("Erro ao reprovar post. Tente novamente.");
    }
  };

  const handleRequestAdjustment = async () => {
    try {
      const adjustmentNote = adjustNotes.trim() 
        ? `\n\n---\nAjustes solicitados: ${adjustNotes}` 
        : "";

      const { error } = await supabase
        .from("posts")
        .update({ 
          status: "rascunho",
          conteudo: `${post?.conteudo}${adjustmentNote}`,
          updated_at: new Date().toISOString()
        })
        .eq("id", postId);

      if (error) throw error;

      setSubmissionType("adjustment");
      setSubmitted(true);
      toast.success("Solicitação de ajuste enviada!");
    } catch (error: any) {
      console.error("Erro ao solicitar ajuste:", error);
      toast.error("Erro ao solicitar ajuste. Tente novamente.");
    }
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
      case "tiktok":
        return <TikTokIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getSocialColor = (network: string) => {
    switch (network) {
      case "facebook":
        return "bg-[#1877F2]";
      case "instagram":
        return "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]";
      case "linkedin":
        return "bg-[#0A66C2]";
      case "youtube":
        return "bg-[#FF0000]";
      case "tiktok":
        return "bg-[#000000]";
      default:
        return "bg-gray-600";
    }
  };

  const getNetworkDisplayName = (network: string) => {
    const names: Record<string, string> = {
      facebook: "Facebook",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      youtube: "YouTube",
      tiktok: "TikTok"
    };
    return names[network] || network;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Post não encontrado
            </h2>
            <p className="text-muted-foreground">
              O post pode ter sido removido ou o link está incorreto.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={beelioLogo} 
              alt="Beelio" 
              className="h-7 sm:h-8"
            />
          </div>
          <Badge variant="outline" className="text-xs sm:text-sm">
            Aguardando Aprovação
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Post Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-6">
                  {/* Social Networks Selector */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      Visualizar como:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.redes_sociais?.map((network) => (
                        <Button
                          key={network}
                          variant={selectedNetwork === network ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedNetwork(network)}
                          className={cn(
                            "flex items-center space-x-2 text-white",
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
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg">🐝</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {post.titulo}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {getNetworkDisplayName(selectedNetwork)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-foreground whitespace-pre-wrap">
                        {post.conteudo}
                      </p>
                      
                      {post.midia_urls && post.midia_urls.length > 0 && (
                        <img 
                          src={post.midia_urls[0]} 
                          alt="Post"
                          className="w-full rounded-lg object-cover"
                        />
                      )}
                    </div>
                  </div>

                  {/* Scheduling Info */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/50 rounded-lg gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Agendamento
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {post.data_agendamento 
                          ? new Date(post.data_agendamento).toLocaleString('pt-BR')
                          : 'Não agendado'}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {post.redes_sociais?.map((network) => (
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
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Ações de Aprovação
                </h3>
                
                <div className="space-y-3 sm:space-y-4">
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
                          Confirmar
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
                          Enviar
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
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
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
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-8 sm:mt-12">
        <div className="container mx-auto px-4 sm:px-6 py-4 text-center">
          <p className="text-sm text-muted-foreground">
            Beelio – Organize e simplifique seu marketing.
          </p>
        </div>
      </footer>
    </div>
  );
}
