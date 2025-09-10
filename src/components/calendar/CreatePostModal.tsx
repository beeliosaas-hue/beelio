import { useState } from "react";
import { X, Upload, Clock, Check, ExternalLink, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "schedule";
}

const socialNetworks = [
  { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-600", bgColor: "bg-blue-50" },
  { id: "instagram", name: "Instagram", icon: Instagram, color: "text-purple-600", bgColor: "bg-purple-50" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-700", bgColor: "bg-blue-50" },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-600", bgColor: "bg-red-50" },
];

export function CreatePostModal({ isOpen, onClose, mode }: CreatePostModalProps) {
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [postContent, setPostContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<"pending" | "approved" | "rejected">("pending");

  if (!isOpen) return null;

  const handleNetworkToggle = (networkId: string) => {
    setSelectedNetworks(prev => 
      prev.includes(networkId) 
        ? prev.filter(id => id !== networkId)
        : [...prev, networkId]
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaFile(file);
    }
  };

  const generateApprovalLink = () => {
    const baseUrl = window.location.origin;
    const postId = Math.random().toString(36).substr(2, 9);
    return `${baseUrl}/approve/${postId}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            {mode === "create" ? "Criar Post Rápido" : "Agendar Post"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Content Section */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="content">Conteúdo da Publicação</Label>
              <Textarea
                id="content"
                placeholder="Digite o texto do seu post..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="min-h-[120px] mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="media">Upload de Mídia</Label>
              <div className="mt-2">
                <label htmlFor="media" className="flex items-center justify-center w-full p-6 border-2 border-dashed border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {mediaFile ? mediaFile.name : "Clique para fazer upload da imagem ou vídeo"}
                    </p>
                  </div>
                  <input
                    id="media"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Social Networks Selection */}
          <div className="space-y-4">
            <Label>Redes Sociais de Destino</Label>
            <div className="grid grid-cols-2 gap-3">
              {socialNetworks.map((network) => {
                const Icon = network.icon;
                const isSelected = selectedNetworks.includes(network.id);
                
                return (
                  <div
                    key={network.id}
                    onClick={() => handleNetworkToggle(network.id)}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all",
                      isSelected 
                        ? `${network.bgColor} border-current ${network.color} shadow-sm`
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Checkbox checked={isSelected} />
                    <Icon className={cn("h-5 w-5", network.color)} />
                    <span className="font-medium">{network.name}</span>
                  </div>
                );
              })}
            </div>
            
            {selectedNetworks.length > 0 && (
              <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm text-muted-foreground">
                  Publicar em todas as redes selecionadas simultaneamente
                </span>
              </div>
            )}
          </div>

          {/* Scheduling Section */}
          {mode === "schedule" && (
            <div className="space-y-4">
              <Label>Configurações de Agendamento</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Approval Section */}
          <div className="space-y-4">
            <Label>Aprovação Interna</Label>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={approvalStatus === "approved" ? "default" : "outline"}
                onClick={() => setApprovalStatus("approved")}
                className="flex items-center space-x-2"
              >
                <Check className="h-4 w-4" />
                <span>Aprovar Post</span>
              </Button>
              
              <Button
                variant={approvalStatus === "rejected" ? "destructive" : "outline"}
                onClick={() => setApprovalStatus("rejected")}
                className="flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Reprovar Post</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  const link = generateApprovalLink();
                  navigator.clipboard.writeText(link);
                }}
                className="flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Gerar Link de Aprovação</span>
              </Button>
            </div>
            
            {approvalStatus !== "pending" && (
              <Badge variant={approvalStatus === "approved" ? "default" : "destructive"}>
                {approvalStatus === "approved" ? "Post Aprovado" : "Post Reprovado"}
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              disabled={!postContent || selectedNetworks.length === 0}
            >
              {mode === "create" ? "Criar Post" : "Agendar Post"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}